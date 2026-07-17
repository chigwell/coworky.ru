export const MODELS_API_URL = "https://api.llm7.io/v1/models";
export const MOEX_USD_RUB_URL =
  "https://iss.moex.com/iss/engines/currency/markets/selt/boards/CETS/securities/USD000UTSTOM.json?iss.meta=off&iss.only=marketdata";
export const CACHE_TTL_MS = 3 * 60 * 1000;
export const PRICE_MARKUP = 1.1;
export const FALLBACK_USD_RUB = 78.32;

export const FALLBACK_MODELS = [
  {
    id: "gpt-5.5",
    tier: "pro",
    pricing: { input: 1, output: 6, currency: "USD", unit: "1M tokens", minimum_request_price_usd: 0.0001 },
    context_window: { tokens: 1050000 },
    modalities: { input: ["text", "image"], output: ["text"] },
    stream: true,
    json_mode: true,
    reasoning: true,
    tools_calling: true,
  },
  {
    id: "gpt-5.4-mini",
    tier: "pro",
    pricing: { input: 0.16, output: 0.9, currency: "USD", unit: "1M tokens" },
    context_window: { tokens: 400000 },
    modalities: { input: ["text", "image"], output: ["text"] },
    stream: true,
    json_mode: true,
    reasoning: true,
    tools_calling: true,
  },
  {
    id: "claude-sonnet-5",
    tier: "pro",
    pricing: { input: 0.4, output: 2, currency: "USD", unit: "1M tokens" },
    context_window: { tokens: 1000000 },
    modalities: { input: ["text"], output: ["text"] },
    stream: true,
    reasoning: true,
    tools_calling: true,
  },
  {
    id: "deepseek-v4-flash",
    tier: "pro",
    pricing: { input: 0.07, output: 0.14, currency: "USD", unit: "1M tokens" },
    context_window: { tokens: 1000000 },
    modalities: { input: ["text"], output: ["text"] },
    stream: true,
    reasoning: true,
    tools_calling: true,
  },
  {
    id: "glm-5.2",
    tier: "pro",
    pricing: { input: 0.33, output: 1.12, currency: "USD", unit: "1M tokens" },
    context_window: { tokens: 1000000 },
    modalities: { input: ["text"], output: ["text"] },
    stream: true,
    json_mode: true,
    tools_calling: true,
  },
  {
    id: "minimax-m2.7",
    tier: "pro",
    pricing: { input: 0.04, output: 0.07, currency: "USD", unit: "1M tokens" },
    context_window: { tokens: 180000 },
    modalities: { input: ["text"], output: ["text"] },
    json_mode: true,
    reasoning: true,
    tools_calling: true,
  },
];

export const PROVIDER_DETAILS = [
  { test: (id) => id.startsWith("gpt-"), provider: "OpenAI", lightLogo: "https://llm7.io/openai.svg", darkLogo: "https://llm7.io/openai.svg" },
  { test: (id) => id.startsWith("claude-"), provider: "Anthropic", lightLogo: "https://llm7.io/claude.svg", darkLogo: "https://llm7.io/claude.svg" },
  { test: (id) => id.startsWith("gemini-"), provider: "Google", lightLogo: "https://llm7.io/gemini.svg", darkLogo: "https://llm7.io/gemini.svg" },
  { test: (id) => id.startsWith("codestral-") || id.startsWith("devstral-") || id.startsWith("mistral-"), provider: "Mistral AI", lightLogo: "https://llm7.io/mistral-ai-logo.svg", darkLogo: "https://llm7.io/mistral-ai-logo.svg" },
  { test: (id) => id.startsWith("deepseek-"), provider: "DeepSeek", lightLogo: "https://llm7.io/deepseek-color.svg", darkLogo: "https://llm7.io/deepseek-color.svg" },
  { test: (id) => id.startsWith("glm-"), provider: "Z.ai", lightLogo: "https://llm7.io/z-ai-logo.svg", darkLogo: "https://llm7.io/z-ai-logo.svg" },
  { test: (id) => id.startsWith("grok-"), provider: "xAI", lightLogo: "https://llm7.io/grok-ai-icon-light.svg", darkLogo: "https://llm7.io/grok-icon-dark.svg" },
  { test: (id) => id.startsWith("kimi-"), provider: "Moonshot AI", lightLogo: "https://llm7.io/k-only-light.svg", darkLogo: "https://llm7.io/k-only-dark.svg" },
  { test: (id) => id.startsWith("minimax-"), provider: "MiniMax", lightLogo: "https://llm7.io/minimax.png", darkLogo: "https://llm7.io/minimax.png" },
  { test: (id) => id.startsWith("qwen"), provider: "Qwen", lightLogo: "https://llm7.io/qwen.svg", darkLogo: "https://llm7.io/qwen.svg" },
  { test: (id) => id.startsWith("llama"), provider: "Meta", lightLogo: "https://llm7.io/meta.svg", darkLogo: "https://llm7.io/meta.svg" },
];

export const preferredOrder = [
  "gpt-5.5",
  "gpt-5.4",
  "gpt-5.4-mini",
  "claude-sonnet-5",
  "claude-opus-4-8",
  "deepseek-v4-flash",
  "glm-5.2",
  "gemini",
  "kimi",
  "minimax",
  "codestral",
  "devstral",
];

export function readCache(key, options = {}) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (!cached || typeof cached.savedAt !== "number") return null;
    const isFresh = Date.now() - cached.savedAt <= CACHE_TTL_MS;
    if (isFresh || options.allowStale) return { ...cached, isFresh };
  } catch (_error) {
    return null;
  }
  return null;
}

export async function fetchJsonWithCache(key, url, options = {}) {
  const fresh = options.force ? null : readCache(key);
  if (fresh) return { data: fresh.data, source: "cache", savedAt: fresh.savedAt };

  try {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const savedAt = Date.now();
    localStorage.setItem(key, JSON.stringify({ data, savedAt }));
    return { data, source: "live", savedAt };
  } catch (error) {
    const stale = readCache(key, { allowStale: true });
    if (stale) return { data: stale.data, source: "stale-cache", savedAt: stale.savedAt, error };
    throw error;
  }
}

export function getMoexCell(marketData, columnNames) {
  const columns = marketData?.columns;
  const row = marketData?.data?.[0];
  if (!Array.isArray(columns) || !Array.isArray(row)) return undefined;

  for (const columnName of columnNames) {
    const index = columns.indexOf(columnName);
    const value = index >= 0 ? Number(row[index]) : NaN;
    if (Number.isFinite(value) && value > 0) return value;
  }
  return undefined;
}

export function providerDetails(modelId) {
  const id = String(modelId || "").toLowerCase();
  return PROVIDER_DETAILS.find((entry) => entry.test(id)) || { provider: "Другая модель" };
}

export function logoForProvider(details, theme) {
  return theme === "dark" && details.darkLogo ? details.darkLogo : details.lightLogo;
}

export function trimNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

export function formatContextWindow(model) {
  const tokens = Number(model?.context_window?.tokens);
  const chars = Number(model?.context_window?.chars);
  if (Number.isFinite(tokens) && tokens > 0) {
    if (tokens >= 1_000_000) return `${trimNumber(tokens / 1_000_000)}M токенов`;
    if (tokens >= 1_000) return `${Math.round(tokens / 1_000)}k токенов`;
    return `${tokens.toLocaleString("ru-RU")} токенов`;
  }
  if (Number.isFinite(chars) && chars > 0) {
    if (chars >= 1_000_000) return `${trimNumber(chars / 1_000_000)}M символов`;
    if (chars >= 1_000) return `${Math.round(chars / 1_000)}k символов`;
    return `${chars.toLocaleString("ru-RU")} символов`;
  }
  return "контекст не указан";
}

export function chipsForModel(model) {
  return [
    model.tools_calling ? "tools" : null,
    model.modalities?.input?.includes("image") ? "vision" : null,
    model.json_mode ? "json" : null,
    model.stream ? "stream" : null,
    model.reasoning ? "reasoning" : null,
  ].filter(Boolean);
}

export function modelRank(model) {
  const id = String(model.id || "").toLowerCase();
  const preferredIndex = preferredOrder.findIndex((prefix) => id.startsWith(prefix));
  if (preferredIndex >= 0) return preferredIndex;
  return 100 + id.localeCompare("", "ru");
}

export function sortModels(models) {
  return [...models].sort((a, b) => {
    const rankDiff = modelRank(a) - modelRank(b);
    if (rankDiff !== 0) return rankDiff;
    return String(a.id).localeCompare(String(b.id), "ru", { sensitivity: "base" });
  });
}
