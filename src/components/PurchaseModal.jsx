import { useEffect, useMemo, useState } from "react";
import { createRobokassaInvoice } from "../lib/robokassaApi.js";
import { storePendingInvoice } from "../lib/paymentStorage.js";

const MIN_AMOUNT_RUB = 100;
const MAX_AMOUNT_RUB = 15000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeAmount(value) {
  return String(value || "").trim().replace(",", ".");
}

function validateAmount(value) {
  const normalized = normalizeAmount(value);
  if (!normalized) return "Укажите сумму пополнения.";
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return "Введите сумму в рублях, например 100 или 1500.50.";

  const amount = Number(normalized);
  if (!Number.isFinite(amount)) return "Введите корректную сумму.";
  if (amount < MIN_AMOUNT_RUB) return "Минимальная сумма пополнения — 100 ₽.";
  if (amount > MAX_AMOUNT_RUB) return "Максимальная сумма пополнения — 15000 ₽.";
  return "";
}

function validateEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!email) return "Укажите email для платежа и проверки кода.";
  if (email.length > 254 || !EMAIL_RE.test(email)) return "Введите корректный email.";
  return "";
}

function amountForApi(value) {
  return Number(normalizeAmount(value)).toFixed(2);
}

function initialAmount(initialPayment) {
  return initialPayment?.amount_rub || initialPayment?.amountRub || "100";
}

function initialEmail(initialPayment) {
  return initialPayment?.email || "";
}

export function PurchaseModal({ isOpen, onClose, initialPayment = null }) {
  const [amountRub, setAmountRub] = useState(initialAmount(initialPayment));
  const [email, setEmail] = useState(initialEmail(initialPayment));
  const [status, setStatus] = useState("idle");
  const [apiError, setApiError] = useState("");
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    setAmountRub(initialAmount(initialPayment));
    setEmail(initialEmail(initialPayment));
    setStatus("idle");
    setApiError("");
    setTouched({});
  }, [initialPayment, isOpen]);

  const errors = useMemo(
    () => ({
      amountRub: validateAmount(amountRub),
      email: validateEmail(email),
    }),
    [amountRub, email],
  );
  const isSubmitting = status === "submitting";
  const hasErrors = Boolean(errors.amountRub || errors.email);

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched({ amountRub: true, email: true });
    setApiError("");

    if (hasErrors) return;

    setStatus("submitting");
    try {
      const invoice = await createRobokassaInvoice({
        email: email.trim().toLowerCase(),
        amountRub: amountForApi(amountRub),
      });
      storePendingInvoice(invoice);
      window.location.assign(invoice.payment_url);
    } catch (error) {
      const retrySuffix = error.retryAfterSeconds ? ` Повторите через ${error.retryAfterSeconds} сек.` : "";
      setApiError(`${error.message || "Не удалось создать платеж."}${retrySuffix}`);
      setStatus("error");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={isSubmitting ? undefined : onClose}>
      <section
        className="purchase-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Закрыть окно"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <div className="section-label">Пополнение баланса</div>
        <h2 id="purchase-title">Пополнить баланс Coworky</h2>
        <p>
          Пополнение баланса означает покупку уникального кода для приложения CoWorky. После успешной
          оплаты через партнера Robokassa скопируйте код и активируйте его в приложении:{" "}
          <a href="/top-up" target="_blank" rel="noreferrer">
            инструкция
          </a>
          .
        </p>
        <form className="purchase-form" onSubmit={handleSubmit} noValidate>
          <label className="purchase-field">
            <span>Сумма, ₽</span>
            <input
              type="text"
              inputMode="decimal"
              name="amount_rub"
              value={amountRub}
              min={MIN_AMOUNT_RUB}
              max={MAX_AMOUNT_RUB}
              disabled={isSubmitting}
              aria-invalid={touched.amountRub && errors.amountRub ? "true" : "false"}
              aria-describedby="purchase-amount-error"
              onBlur={() => setTouched((current) => ({ ...current, amountRub: true }))}
              onChange={(event) => setAmountRub(event.target.value)}
            />
            <small id="purchase-amount-error">
              {touched.amountRub && errors.amountRub ? errors.amountRub : "От 100 до 15000 ₽."}
            </small>
          </label>
          <label className="purchase-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={email}
              autoComplete="email"
              disabled={isSubmitting}
              aria-invalid={touched.email && errors.email ? "true" : "false"}
              aria-describedby="purchase-email-error"
              onBlur={() => setTouched((current) => ({ ...current, email: true }))}
              onChange={(event) => setEmail(event.target.value)}
            />
            <small id="purchase-email-error">
              {touched.email && errors.email ? errors.email : "Нужен для проверки платежа и поддержки."}
            </small>
          </label>
          {apiError ? (
            <div className="purchase-alert" role="alert">
              {apiError}
            </div>
          ) : null}
          <p>
            Минимальная сумма пополнения составляет 100 ₽. Оплачивая код пополнения, вы принимаете{" "}
            <a href="/terms" target="_blank" rel="noreferrer">
              пользовательское соглашение
            </a>{" "}
            и подтверждаете ознакомление с{" "}
            <a href="/privacy" target="_blank" rel="noreferrer">
              политикой обработки данных
            </a>
            .
          </p>
          <p>
            Отказ и возврат неиспользованного баланса по коду пополнения оформляются через{" "}
            <a href="mailto:support@coworky.ru">support@coworky.ru</a>; подробный порядок описан в разделе{" "}
            <a href="/terms#refund" target="_blank" rel="noreferrer">
              «Оплата и возврат»
            </a>
            .
          </p>
          <div className="purchase-actions">
            <button className="button button-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Создаем платеж..." : status === "error" ? "Попробовать снова" : "Пополнить баланс"}
            </button>
            <button className="button button-ghost" type="button" onClick={onClose} disabled={isSubmitting}>
              Закрыть
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
