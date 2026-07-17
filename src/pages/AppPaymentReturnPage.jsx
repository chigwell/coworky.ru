import { useEffect } from "react";
import { Header } from "../components/Header.jsx";
import "../styles/home.css";
import "../styles/payment.css";

export default function AppPaymentReturnPage({ outcome, onToggleTheme, onOpenPurchase }) {
  const succeeded = outcome === "success";

  useEffect(() => {
    document.title = succeeded
      ? "Оплата принята — CoWorky"
      : "Оплата не завершена — CoWorky";
  }, [succeeded]);

  return (
    <div className="page-shell payment-page">
      <Header type="not-found" onToggleTheme={onToggleTheme} onOpenPurchase={onOpenPurchase} />
      <main className="payment-main">
        <section className="container payment-hero" aria-labelledby="app-payment-title">
          <div className="payment-copy">
            <div className="section-label">Пополнение из приложения</div>
            <h1 id="app-payment-title" className="payment-title">
              {succeeded ? "Вернитесь в приложение CoWorky." : "Платёж не завершён."}
            </h1>
            <p>
              {succeeded
                ? "CoWorky автоматически проверит оплату и пополнит баланс. Код копировать не нужно."
                : "Вернитесь в CoWorky: там можно повторно открыть платёж или создать новый счёт."}
            </p>
            <p>
              Эту вкладку можно закрыть. Если баланс долго не обновляется, напишите на{" "}
              <a href="mailto:support@coworky.ru">support@coworky.ru</a>.
            </p>
          </div>
          <div className="payment-panel" aria-hidden="true">
            <div className="payment-panel-status">{succeeded ? "RETURN" : "CANCEL"}</div>
            <div className="payment-panel-card">
              <span>{succeeded ? "Проверка идёт в приложении" : "Оплату можно повторить"}</span>
              <strong>CoWorky</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
