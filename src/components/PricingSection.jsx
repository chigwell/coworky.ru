import { useEffect, useMemo, useState } from "react";
import {
  FALLBACK_MODELS,
  FALLBACK_USD_RUB,
  MOEX_USD_RUB_URL,
  MODELS_API_URL,
  PRICE_MARKUP,
  chipsForModel,
  fetchJsonWithCache,
  formatContextWindow,
  getMoexCell,
  logoForProvider,
  providerDetails,
  sortModels,
} from "../lib/pricing.js";

function formatRub(usd, usdRub) {
  const value = Number(usd);
  if (!Number.isFinite(value)) return "n/a";
  const rub = value * usdRub * PRICE_MARKUP;
  const maximumFractionDigits = rub < 10 ? 2 : rub < 100 ? 1 : 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(rub);
}

async function loadUsdRubRate() {
  try {
    const result = await fetchJsonWithCache("coworky-usd-rub", MOEX_USD_RUB_URL);
    const rate = getMoexCell(result.data.marketdata, ["LAST", "WAPRICE", "MARKETPRICE", "CLOSEPRICE", "LOPENPRICE"]);
    const columns = result.data?.marketdata?.columns || [];
    const row = result.data?.marketdata?.data?.[0] || [];
    const index = columns.indexOf("SYSTIME");
    const systime = index >= 0 ? row[index] : null;

    if (!rate) throw new Error("MOEX rate is missing");
    return {
      usdRub: rate,
      rateSource: result.source,
      rateTime: systime || new Date(result.savedAt).toLocaleString("ru-RU"),
    };
  } catch (_error) {
    return {
      usdRub: FALLBACK_USD_RUB,
      rateSource: "fallback",
      rateTime: null,
    };
  }
}

async function loadModels() {
  try {
    const result = await fetchJsonWithCache("coworky-llm-models", MODELS_API_URL);
    const models = Array.isArray(result.data?.data) ? result.data.data : [];
    if (models.length === 0) throw new Error("Models list is empty");
    return {
      models,
      modelsSource: result.source,
    };
  } catch (_error) {
    return {
      models: FALLBACK_MODELS,
      modelsSource: "fallback",
    };
  }
}

function ModelLogo({ details, theme }) {
  const [failed, setFailed] = useState(false);
  const provider = details.provider || "AI";
  const logo = logoForProvider(details, theme);

  useEffect(() => {
    setFailed(false);
  }, [logo]);

  if (!logo || failed) {
    return (
      <span className="model-fallback-logo" aria-hidden="true">
        {provider.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      className="model-logo"
      data-provider={provider}
      src={logo}
      alt={provider}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function ModelCard({ model, theme, usdRub }) {
  const details = providerDetails(model.id);
  const pricing = model.pricing || {};
  const unit = pricing.unit || "1M tokens";
  const inputPrice = formatRub(pricing.input, usdRub);
  const outputPrice = formatRub(pricing.output, usdRub);
  const minPrice = Number.isFinite(Number(pricing.minimum_request_price_usd))
    ? formatRub(pricing.minimum_request_price_usd, usdRub)
    : null;
  const chips = [formatContextWindow(model), ...chipsForModel(model)].slice(0, 5);

  return (
    <article className="model-card">
      <div className="model-head">
        <div className="model-logo-wrap">
          <ModelLogo details={details} theme={theme} />
        </div>
        {model.tier ? <span className="tier-pill">{model.tier}</span> : null}
      </div>
      <div className="model-title">
        <h3>{model.id}</h3>
        <div className="model-provider">{details.provider || "Провайдер не указан"}</div>
      </div>
      <div className="model-meta">
        {chips.map((chip) => (
          <span key={chip}>{chip}</span>
        ))}
      </div>
      <div className="price-lines">
        <div className="price-line">
          <span>Ввод</span>
          <strong>
            {inputPrice} / {unit}
          </strong>
        </div>
        <div className="price-line">
          <span>Вывод</span>
          <strong>
            {outputPrice} / {unit}
          </strong>
        </div>
        {minPrice ? (
          <div className="price-line">
            <span>Мин. запрос</span>
            <strong>{minPrice}</strong>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function PricingSection({ theme }) {
  const [showAllModels, setShowAllModels] = useState(false);
  const [state, setState] = useState({
    isLoading: true,
    models: [],
    usdRub: FALLBACK_USD_RUB,
    modelsSource: "fallback",
    rateSource: "fallback",
    rateTime: null,
    loadedAt: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function initPricing() {
      const [rateResult, modelsResult] = await Promise.all([loadUsdRubRate(), loadModels()]);
      if (!isMounted) return;
      setState({
        isLoading: false,
        ...rateResult,
        ...modelsResult,
        loadedAt: new Date(),
      });
    }

    initPricing();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedModels = useMemo(() => sortModels(state.models), [state.models]);
  const visibleModels = showAllModels ? sortedModels : sortedModels.slice(0, 6);
  const loadedAtText = state.loadedAt
    ? new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(state.loadedAt)
    : "";

  return (
    <section className="section section-band" id="pricing">
      <div className="container">
        <div className="section-label">Расчет услуг</div>
        <h2 className="section-title">Прозрачная стоимость ИИ-задач внутри сервиса.</h2>
        <p className="section-copy">
          Coworky показывает расчетные показатели по каждой модели, чтобы вы могли выбрать подходящую
          мощность под задачу. Оплата учитывается как предоплата информационно-образовательных и
          консультационных ИТ-услуг, а списание происходит только за выполненные запросы.
        </p>
        <div className="price-toolbar">
          {state.isLoading ? (
            <p className="price-status">
              Загружаем актуальный список моделей. Если данные временно недоступны, покажем сохранённые или
              демонстрационные значения.
            </p>
          ) : (
            <p className="price-status">
              Расчетные показатели актуальны на <strong>{loadedAtText}</strong>. Показано <strong>{state.models.length}</strong>{" "}
              расчетных вариантов.
            </p>
          )}
          {sortedModels.length > 6 ? (
            <button className="button button-ghost" type="button" onClick={() => setShowAllModels((value) => !value)}>
              {showAllModels ? "Свернуть список" : `Показать все варианты (${sortedModels.length})`}
            </button>
          ) : null}
        </div>
        <div className="model-grid" aria-live="polite">
          {state.isLoading ? (
            <>
              <article className="model-card skeleton" />
              <article className="model-card skeleton" />
              <article className="model-card skeleton" />
            </>
          ) : (
            visibleModels.map((model) => <ModelCard key={model.id} model={model} theme={theme} usdRub={state.usdRub} />)
          )}
        </div>
      </div>
    </section>
  );
}
