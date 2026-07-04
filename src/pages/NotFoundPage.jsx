import { useEffect } from "react";
import { Header } from "../components/Header.jsx";
import { applyNotFoundMetadata } from "../lib/metadata.js";
import "../styles/home.css";
import "../styles/not-found.css";

export default function NotFoundPage({ onToggleTheme, onOpenPurchase }) {
  useEffect(() => {
    applyNotFoundMetadata();
  }, []);

  return (
    <div className="page-shell not-found-page">
      <Header type="not-found" onToggleTheme={onToggleTheme} onOpenPurchase={onOpenPurchase} />
      <main className="not-found-main">
        <section className="container not-found-hero" aria-labelledby="not-found-title">
          <div className="not-found-copy">
            <div className="section-label">404 / страница не найдена</div>
            <h1 className="not-found-title" id="not-found-title">
              Такой страницы в Coworky нет.
            </h1>
            <p>
              Возможно, ссылка устарела или в адресе появилась ошибка. Вернитесь на главную,
              скачайте приложение или напишите в поддержку, если искали конкретный файл.
            </p>
            <div className="not-found-actions">
              <a className="button button-primary" href="/">
                На главную
              </a>
              <a className="button button-ghost" href="/download">
                Скачать Coworky
              </a>
              <a className="button button-soft" href="mailto:support@coworky.ru">
                Поддержка
              </a>
            </div>
          </div>
          <div className="not-found-panel" aria-hidden="true">
            <div className="not-found-code">404</div>
            <div className="not-found-window">
              <span />
              <span />
              <span />
              <strong>route not found</strong>
              <small>/index.html fallback active</small>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
