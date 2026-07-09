import { useEffect, useMemo } from "react";
import { Header } from "../components/Header.jsx";
import { applyPaymentFailMetadata } from "../lib/metadata.js";
import { extractQueryValue, findStoredInvoice } from "../lib/paymentStorage.js";
import "../styles/home.css";
import "../styles/payment.css";

export default function PaymentFailPage({ onToggleTheme, onOpenPurchase }) {
  useEffect(() => {
    applyPaymentFailMetadata();
  }, []);

  const payment = useMemo(() => {
    const robokassaInvId = extractQueryValue(window.location.search, "InvId");
    const storedInvoice = findStoredInvoice({ robokassaInvId });
    return {
      robokassaInvId,
      storedInvoice,
      orderId: robokassaInvId || storedInvoice?.invoice_id || "не найден",
    };
  }, []);

  function handleRetry() {
    onOpenPurchase(
      payment.storedInvoice
        ? {
            email: payment.storedInvoice.email,
            amount_rub: payment.storedInvoice.amount_rub,
          }
        : null,
    );
  }

  return (
    <div className="page-shell payment-page">
      <Header type="not-found" onToggleTheme={onToggleTheme} onOpenPurchase={onOpenPurchase} />
      <main className="payment-main">
        <section className="container payment-hero" aria-labelledby="payment-fail-title">
          <div className="payment-copy">
            <div className="section-label">Оплата не завершена</div>
            <h1 id="payment-fail-title" className="payment-title">
              Платеж не прошел или был отменен.
            </h1>
            <p>
              Деньги не были подтверждены платежной системой. Можно повторить оплату или написать в поддержку,
              указав id заказа.
            </p>
            <dl className="payment-details">
              <div>
                <dt>id заказа</dt>
                <dd>{payment.orderId}</dd>
              </div>
              <div>
                <dt>поддержка</dt>
                <dd>
                  <a href="mailto:support@coworky.ru">support@coworky.ru</a>
                </dd>
              </div>
            </dl>
            <div className="payment-actions">
              <button className="button button-primary" type="button" onClick={handleRetry}>
                Повторить оплату
              </button>
              <a className="button button-ghost" href="/">
                На главную
              </a>
            </div>
          </div>
          <div className="payment-panel" aria-hidden="true">
            <div className="payment-panel-status">FAIL</div>
            <div className="payment-panel-card">
              <span>Платеж не подтвержден</span>
              <strong>{payment.orderId}</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
