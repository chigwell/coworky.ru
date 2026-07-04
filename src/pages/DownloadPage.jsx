import { useEffect } from "react";
import { Header } from "../components/Header.jsx";
import { RawHtml } from "../components/RawHtml.jsx";
import { applyDownloadMetadata } from "../lib/metadata.js";
import { downloadFooterHtml, downloadHeroHtml, downloadStepsHtml } from "./downloadContent.js";
import "../styles/download.css";

function DownloadHero() {
  return <RawHtml html={downloadHeroHtml} />;
}

function InstallSteps() {
  return <RawHtml html={downloadStepsHtml} />;
}

function DownloadFooter() {
  return <RawHtml html={downloadFooterHtml} />;
}

export default function DownloadPage({ onToggleTheme, onOpenPurchase }) {
  useEffect(() => {
    applyDownloadMetadata();
  }, []);

  return (
    <>
      <Header type="download" onToggleTheme={onToggleTheme} onOpenPurchase={onOpenPurchase} />
      <main className="container">
        <DownloadHero />
        <InstallSteps />
      </main>
      <DownloadFooter />
    </>
  );
}
