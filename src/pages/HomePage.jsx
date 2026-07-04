import { useEffect } from "react";
import { Header } from "../components/Header.jsx";
import { PricingSection } from "../components/PricingSection.jsx";
import { RawHtml } from "../components/RawHtml.jsx";
import { applyHomeMetadata } from "../lib/metadata.js";
import { homeAfterPricingHtml, homeBeforePricingHtml, homeFooterHtml } from "./homeContent.js";
import "../styles/home.css";

function HomeStaticIntro() {
  return <RawHtml html={homeBeforePricingHtml} />;
}

function HomeStaticOutro() {
  return <RawHtml html={homeAfterPricingHtml} />;
}

function HomeFooter() {
  return <RawHtml html={homeFooterHtml} />;
}

export default function HomePage({ onToggleTheme, onOpenPurchase, theme }) {
  useEffect(() => {
    applyHomeMetadata();
  }, []);

  return (
    <div className="page-shell">
      <Header onToggleTheme={onToggleTheme} onOpenPurchase={onOpenPurchase} />
      <main id="top">
        <HomeStaticIntro />
        <PricingSection theme={theme} />
        <HomeStaticOutro />
      </main>
      <HomeFooter />
    </div>
  );
}
