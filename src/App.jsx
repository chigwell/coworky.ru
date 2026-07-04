import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { PurchaseModal } from "./components/PurchaseModal.jsx";
import "./styles/modal.css";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const DownloadPage = lazy(() => import("./pages/DownloadPage.jsx"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage.jsx"));
const TermsPage = lazy(() => import("./pages/TermsPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

const THEME_STORAGE_KEY = "coworky-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";

  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function routeFromPath(pathname) {
  if (pathname === "/") return "home";
  if (pathname === "/download") return "download";
  if (pathname === "/privacy") return "privacy";
  if (pathname === "/terms") return "terms";
  return "not-found";
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const route = useMemo(() => routeFromPath(window.location.pathname), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const handlePurchaseClick = (event) => {
      const trigger = event.target.closest("[data-purchase-code]");
      if (!trigger) return;
      event.preventDefault();
      setIsPurchaseOpen(true);
    };

    document.addEventListener("click", handlePurchaseClick);
    return () => document.removeEventListener("click", handlePurchaseClick);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsPurchaseOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        {route === "download" ? (
          <DownloadPage onToggleTheme={toggleTheme} onOpenPurchase={() => setIsPurchaseOpen(true)} />
        ) : route === "privacy" ? (
          <PrivacyPage onToggleTheme={toggleTheme} onOpenPurchase={() => setIsPurchaseOpen(true)} />
        ) : route === "terms" ? (
          <TermsPage onToggleTheme={toggleTheme} onOpenPurchase={() => setIsPurchaseOpen(true)} />
        ) : route === "not-found" ? (
          <NotFoundPage onToggleTheme={toggleTheme} onOpenPurchase={() => setIsPurchaseOpen(true)} />
        ) : (
          <HomePage onToggleTheme={toggleTheme} onOpenPurchase={() => setIsPurchaseOpen(true)} theme={theme} />
        )}
      </Suspense>
      <PurchaseModal isOpen={isPurchaseOpen} onClose={() => setIsPurchaseOpen(false)} />
    </>
  );
}
