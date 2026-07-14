import { useEffect, useMemo, useState } from "react";
import { Header } from "../components/Header.jsx";
import { applyPaymentSuccessMetadata } from "../lib/metadata.js";
import { confirmRobokassaInvoice } from "../lib/robokassaApi.js";
import { extractQueryValue, findStoredInvoice, removeStoredInvoice } from "../lib/paymentStorage.js";
import "../styles/home.css";
import "../styles/payment.css";

const MAX_CONFIRM_WAIT_MS = 3 * 60 * 1000;
const TRANSIENT_ERROR_STATUSES = new Set([0, 429, 502, 503]);

function statusText(status) {
  if (status === "failed") return "Платеж отклонен.";
  if (status === "cancelled") return "Платеж отменен.";
  if (status === "expired") return "Время оплаты истекло.";
  return "Оплата не подтверждена.";
}

function copyWithFallback(value) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value);
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  return Promise.resolve();
}

export default function PaymentSuccessPage({ onToggleTheme, onOpenPurchase }) {
  const [state, setState] = useState({
    phase: "locating",
    invoice: null,
    orderId: "",
    message: "Готовим проверку платежа.",
    nextRetrySeconds: 0,
    amountRub: "",
    topupCode: "",
  });
  const [copyStatus, setCopyStatus] = useState("idle");

  useEffect(() => {
    applyPaymentSuccessMetadata();
  }, []);

  const outSum = useMemo(() => extractQueryValue(window.location.search, "OutSum"), []);

  useEffect(() => {
    const robokassaInvId = extractQueryValue(window.location.search, "InvId");
    const invoice = findStoredInvoice({ robokassaInvId });
    const orderId = robokassaInvId || invoice?.invoice_id || "";

    if (!invoice) {
      setState({
        phase: "missing",
        invoice: null,
        orderId,
        message: "Не удалось найти данные платежа в этом браузере.",
        nextRetrySeconds: 0,
        amountRub: outSum || "",
        topupCode: "",
      });
      return undefined;
    }

    let isCancelled = false;
    let timeoutId = null;
    let intervalId = null;
    let attempt = 0;
    const deadline = Date.now() + MAX_CONFIRM_WAIT_MS;

    function clearRetryTimers() {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
      timeoutId = null;
      intervalId = null;
    }

    function setTimeoutState(message) {
      setState({
        phase: "timeout",
        invoice,
        orderId,
        message,
        nextRetrySeconds: 0,
        amountRub: invoice.amount_rub || outSum || "",
        topupCode: "",
      });
    }

    function scheduleRetry(retryAfterSeconds, message) {
      const backoffSeconds = 2 * 2 ** attempt;
      attempt += 1;
      const delaySeconds = Math.max(backoffSeconds, retryAfterSeconds || 0);
      const remainingSeconds = Math.ceil((deadline - Date.now()) / 1000);

      if (remainingSeconds <= 0) {
        setTimeoutState("Оплата пока не подтверждена. Напишите в поддержку и укажите id заказа.");
        return;
      }

      const shouldStopAfterCountdown = delaySeconds > remainingSeconds;
      let countdown = Math.max(1, Math.ceil(Math.min(delaySeconds, remainingSeconds)));
      setState({
        phase: "waiting",
        invoice,
        orderId,
        message: shouldStopAfterCountdown
          ? "Ждем подтверждение до 3 минут. Если оно не придет, покажем инструкцию для поддержки."
          : message,
        nextRetrySeconds: countdown,
        amountRub: invoice.amount_rub || outSum || "",
        topupCode: "",
      });

      intervalId = window.setInterval(() => {
        countdown -= 1;
        setState((current) =>
          current.phase === "waiting"
            ? {
                ...current,
                nextRetrySeconds: Math.max(0, countdown),
              }
            : current,
        );
      }, 1000);
      timeoutId = window.setTimeout(() => {
        if (shouldStopAfterCountdown) {
          setTimeoutState("Оплата пока не подтверждена. Напишите в поддержку и укажите id заказа.");
          return;
        }
        checkPayment();
      }, countdown * 1000);
    }

    async function checkPayment() {
      clearRetryTimers();
      if (isCancelled) return;

      setState({
        phase: "checking",
        invoice,
        orderId,
        message: "Проверяем подтверждение оплаты через API Coworky.",
        nextRetrySeconds: 0,
        amountRub: invoice.amount_rub || outSum || "",
        topupCode: "",
      });

      try {
        const result = await confirmRobokassaInvoice(invoice.invoice_id, invoice.email);
        if (isCancelled) return;

        if (result.statusCode === 200 && result.body?.status === "paid" && result.body?.topup_code) {
          removeStoredInvoice(invoice.invoice_id);
          setState({
            phase: "paid",
            invoice,
            orderId,
            message: "Оплата подтверждена. Скопируйте код и активируйте его в приложении Coworky.",
            nextRetrySeconds: 0,
            amountRub: result.body.amount_rub || invoice.amount_rub || outSum || "",
            topupCode: result.body.topup_code,
          });
          return;
        }

        if (result.statusCode === 409) {
          setState({
            phase: "terminal",
            invoice,
            orderId,
            message: statusText(result.body?.status),
            nextRetrySeconds: 0,
            amountRub: result.body?.amount_rub || invoice.amount_rub || outSum || "",
            topupCode: "",
          });
          return;
        }

        scheduleRetry(result.retryAfterSeconds, "Robokassa еще не прислала подтверждение. Проверим автоматически.");
      } catch (error) {
        if (isCancelled) return;
        if (TRANSIENT_ERROR_STATUSES.has(error.status || 0)) {
          scheduleRetry(error.retryAfterSeconds, error.message || "Сервис оплаты временно недоступен. Повторяем проверку.");
          return;
        }

        setState({
          phase: "error",
          invoice,
          orderId,
          message: error.message || "Не удалось проверить платеж.",
          nextRetrySeconds: 0,
          amountRub: invoice.amount_rub || outSum || "",
          topupCode: "",
        });
      }
    }

    checkPayment();

    return () => {
      isCancelled = true;
      clearRetryTimers();
    };
  }, [outSum]);

  async function handleCopy() {
    if (!state.topupCode) return;
    setCopyStatus("copying");
    try {
      await copyWithFallback(state.topupCode);
      setCopyStatus("copied");
    } catch (_error) {
      setCopyStatus("failed");
    }
  }

  function handleRetry() {
    onOpenPurchase(
      state.invoice
        ? {
            email: state.invoice.email,
            amount_rub: state.invoice.amount_rub,
          }
        : null,
    );
  }

  const isPending = state.phase === "checking" || state.phase === "waiting";

  return (
    <div className="page-shell payment-page">
      <Header type="not-found" onToggleTheme={onToggleTheme} onOpenPurchase={onOpenPurchase} />
      <main className="payment-main">
        <section className="container payment-hero" aria-labelledby="payment-success-title">
          <div className="payment-copy">
            <div className="section-label">Проверка пополнения</div>
            <h1 id="payment-success-title" className="payment-title">
              {state.phase === "paid" ? "Пополнение подтверждено." : "Проверяем платеж."}
            </h1>
            <p>{state.message}</p>
            {state.phase === "waiting" ? (
              <p className="payment-status-line">Следующая проверка через {state.nextRetrySeconds} сек.</p>
            ) : null}
            <dl className="payment-details">
              <div>
                <dt>id заказа</dt>
                <dd>{state.orderId || "не найден"}</dd>
              </div>
              <div>
                <dt>сумма</dt>
                <dd>{state.amountRub ? `${state.amountRub} ₽` : "уточняется"}</dd>
              </div>
            </dl>
            {state.phase === "paid" ? (
              <div className="topup-code-box">
                <span>Код пополнения</span>
                <strong>{state.topupCode}</strong>
                <button className="button button-primary" type="button" onClick={handleCopy}>
                  {copyStatus === "copied" ? "Код скопирован" : "Скопировать код"}
                </button>
                <small>
                  Активируйте код в приложении: Настройки -&gt; Биллинг / расходы -&gt; Top-up code -&gt; Redeem.{" "}
                  <a href="/top-up">Открыть инструкцию</a>
                </small>
                {copyStatus === "failed" ? <small>Не удалось скопировать автоматически. Выделите код вручную.</small> : null}
              </div>
            ) : null}
            {state.phase === "missing" ||
            state.phase === "terminal" ||
            state.phase === "timeout" ||
            state.phase === "error" ? (
              <div className="payment-actions">
                <button className="button button-primary" type="button" onClick={handleRetry}>
                  Пополнить баланс снова
                </button>
                <a className="button button-ghost" href="mailto:support@coworky.ru">
                  support@coworky.ru
                </a>
              </div>
            ) : null}
            {isPending ? <div className="payment-spinner" aria-label="Проверяем оплату" /> : null}
          </div>
          <div className="payment-panel" aria-hidden="true">
            <div className="payment-panel-status">{state.phase === "paid" ? "PAID" : "CHECK"}</div>
            <div className="payment-panel-card">
              <span>{state.phase === "paid" ? "Код готов" : "Серверная проверка"}</span>
              <strong>{state.phase === "paid" ? state.topupCode : state.orderId || "pending"}</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
