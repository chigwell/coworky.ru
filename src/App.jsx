import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { PurchaseModal } from "./components/PurchaseModal.jsx";
import "./styles/modal.css";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const DownloadPage = lazy(() => import("./pages/DownloadPage.jsx"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage.jsx"));
const TermsPage = lazy(() => import("./pages/TermsPage.jsx"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage.jsx"));
const PaymentFailPage = lazy(() => import("./pages/PaymentFailPage.jsx"));
const TopUpPage = lazy(() => import("./pages/TopUpPage.jsx"));
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
  if (pathname === "/success") return "success";
  if (pathname === "/fail") return "fail";
  if (pathname === "/top-up") return "top-up";
  return "not-found";
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [purchaseInitialPayment, setPurchaseInitialPayment] = useState(null);
  const route = useMemo(() => routeFromPath(window.location.pathname), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const openPurchase = (initialPayment = null) => {
    const paymentDefaults =
      initialPayment && typeof initialPayment === "object" && !("nativeEvent" in initialPayment) ? initialPayment : null;
    setPurchaseInitialPayment(paymentDefaults);
    setIsPurchaseOpen(true);
  };

  useEffect(() => {
    const handlePurchaseClick = (event) => {
      const trigger = event.target.closest("[data-purchase-code]");
      if (!trigger) return;
      event.preventDefault();
      openPurchase();
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
          <DownloadPage onToggleTheme={toggleTheme} onOpenPurchase={openPurchase} />
        ) : route === "privacy" ? (
          <PrivacyPage onToggleTheme={toggleTheme} onOpenPurchase={openPurchase} />
        ) : route === "terms" ? (
          <TermsPage onToggleTheme={toggleTheme} onOpenPurchase={openPurchase} />
        ) : route === "success" ? (
          <PaymentSuccessPage onToggleTheme={toggleTheme} onOpenPurchase={openPurchase} />
        ) : route === "fail" ? (
          <PaymentFailPage onToggleTheme={toggleTheme} onOpenPurchase={openPurchase} />
        ) : route === "top-up" ? (
          <TopUpPage onToggleTheme={toggleTheme} onOpenPurchase={openPurchase} />
        ) : route === "not-found" ? (
          <NotFoundPage onToggleTheme={toggleTheme} onOpenPurchase={openPurchase} />
        ) : (
          <HomePage onToggleTheme={toggleTheme} onOpenPurchase={openPurchase} theme={theme} />
        )}
      </Suspense>
      <PurchaseModal
        isOpen={isPurchaseOpen}
        onClose={() => setIsPurchaseOpen(false)}
        initialPayment={purchaseInitialPayment}
      />
    </>
  );
}
