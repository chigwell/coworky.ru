import { useEffect } from "react";
import { Brand } from "../components/Brand.jsx";
import { Header } from "../components/Header.jsx";
import { applyTopUpMetadata } from "../lib/metadata.js";
import "../styles/home.css";
import "../styles/legal.css";

export default function TopUpPage({ onToggleTheme, onOpenPurchase }) {
  useEffect(() => {
    applyTopUpMetadata();
  }, []);

  return (
    <div className="page-shell legal-page">
      <Header type="legal" onToggleTheme={onToggleTheme} onOpenPurchase={onOpenPurchase} />
      <main className="container legal-main">
        <section className="legal-hero" aria-labelledby="top-up-title">
          <div className="section-label">Пополнение баланса</div>
          <h1 id="top-up-title">Как активировать код пополнения CoWorky</h1>
          <p>
            При пополнении баланса от 100 ₽ после успешной оплаты через партнера Robokassa
            генерируется уникальный код вида <strong>CW-xxxx-xxx-...</strong>. Этот код нужно
            активировать в приложении CoWorky.
          </p>
        </section>

        <article className="legal-document">
          <section>
            <h2>1. Пополните баланс на сайте</h2>
            <p>
              Нажмите «Пополнить баланс», укажите сумму от 100 до 15000 ₽ и email. После создания
              платежа сайт перенаправит вас на страницу оплаты Robokassa.
            </p>
          </section>

          <section>
            <h2>2. Дождитесь кода</h2>
            <p>
              После успешной оплаты сайт CoWorky проверит платеж через API и покажет код пополнения.
              Скопируйте его кнопкой «Скопировать код».
            </p>
          </section>

          <section>
            <h2>3. Активируйте код в приложении</h2>
            <p>
              Откройте приложение CoWorky и перейдите в раздел{" "}
              <strong>Настройки -&gt; Биллинг / расходы -&gt; Top-up code</strong>. Вставьте код в
              поле <strong>Top-up code</strong> и нажмите <strong>Redeem</strong>.
            </p>
            <p>После успешной активации баланс будет пополнен в приложении CoWorky.</p>
          </section>

          <section>
            <h2>Если код не появился</h2>
            <p>
              Если платеж прошел, но код не появился или не активируется, напишите на{" "}
              <a href="mailto:support@coworky.ru">support@coworky.ru</a> и укажите email платежа,
              сумму и id заказа, если он отображается на странице оплаты.
            </p>
          </section>
        </article>
      </main>

      <footer className="footer legal-footer">
        <div className="container footer-grid">
          <div>
            <Brand href="/" />
            <p>Код пополнения активируется в приложении CoWorky и увеличивает доступный баланс.</p>
          </div>
          <div className="footer-links" aria-label="Ссылки">
            <div>
              <a href="/download">Скачать</a>
              <a href="#purchase-code" data-purchase-code>
                Пополнить баланс
              </a>
            </div>
            <div>
              <a href="/terms">Соглашение</a>
              <a href="/terms#refund">Оплата и возврат</a>
              <a href="mailto:support@coworky.ru">Поддержка</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
