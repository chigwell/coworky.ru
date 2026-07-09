import { useState } from "react";
import { Brand } from "./Brand.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";

export function Header({ type = "home", onToggleTheme, onOpenPurchase }) {
  const isDownload = type === "download";
  const isHome = type === "home";
  const isLegal = type === "legal";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileLinks = isDownload
    ? [
        { href: "/", label: "Главная" },
        { href: "#windows", label: "Windows" },
        { href: "#macos", label: "macOS" },
        { href: "#purchase-code", label: "Оплатить услуги", purchase: true },
      ]
    : isHome
      ? [
          { href: "#docs", label: "Документы" },
          { href: "#workflow", label: "Как работает" },
          { href: "#use-cases", label: "Сценарии" },
          { href: "#pricing", label: "Стоимость услуг" },
          { href: "/download", label: "Скачать" },
          { href: "#purchase-code", label: "Оплатить услуги", purchase: true },
        ]
    : [
        { href: "/", label: "Главная" },
        { href: "/download", label: "Скачать" },
        { href: "/terms#refund", label: "Оплата и возврат" },
        { href: "#purchase-code", label: "Оплатить услуги", purchase: true },
      ];

  return (
    <header className="topbar">
      <nav className="container nav" aria-label={isDownload ? "Навигация" : "Главная навигация"}>
        <Brand href={isHome ? "#top" : "/"} />
        {isHome && (
          <div className="nav-links" aria-label="Разделы страницы">
            <a href="#docs">Документы</a>
            <a href="#workflow">Как работает</a>
            <a href="#use-cases">Сценарии</a>
            <a href="#pricing">Стоимость услуг</a>
            <a href="#download">Скачать</a>
          </div>
        )}
        {isLegal && (
          <div className="nav-links" aria-label="Правовые документы">
            <a href="/terms">Соглашение</a>
            <a href="/terms#refund">Оплата и возврат</a>
            <a href="/privacy">Политика данных</a>
            <a href="/download">Скачать</a>
          </div>
        )}
        <div className="nav-actions">
          <ThemeToggle onToggleTheme={onToggleTheme} />
          {isDownload ? (
            <button className="button button-primary" type="button" onClick={onOpenPurchase}>
              Оплатить услуги
            </button>
          ) : (
            <>
              <a className="button button-ghost" href="/download">
                Скачать
              </a>
              <button className="button button-primary" type="button" onClick={onOpenPurchase}>
                Оплатить услуги
              </button>
            </>
          )}
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-label="Открыть меню"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
        <div className={`mobile-menu${isMenuOpen ? " is-open" : ""}`} id="mobile-menu">
          {mobileLinks.map((link) => (
            <a
              key={`${link.href}-${link.label}`}
              href={link.href}
              data-purchase-code={link.purchase ? "" : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
