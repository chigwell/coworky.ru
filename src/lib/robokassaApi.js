const DEFAULT_API_BASE_URL = "https://api.coworky.ru";

export const ROBOKASSA_API_BASE_URL = (
  import.meta.env.VITE_COWORKY_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

export class PaymentApiError extends Error {
  constructor(message, { status = 0, retryAfterSeconds = null, body = null } = {}) {
    super(message);
    this.name = "PaymentApiError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
    this.body = body;
  }
}

function retryAfterFromResponse(response, body) {
  const headerValue = response.headers.get("Retry-After");
  const parsedHeader = Number.parseInt(headerValue || "", 10);
  if (Number.isFinite(parsedHeader) && parsedHeader > 0) return parsedHeader;

  const parsedBody = Number.parseInt(body?.retry_after_seconds || "", 10);
  return Number.isFinite(parsedBody) && parsedBody > 0 ? parsedBody : null;
}

async function readJson(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_error) {
    return null;
  }
}

function errorMessageForStatus(status, detail) {
  if (status === 400) return detail || "Проверьте email и сумму оплаты.";
  if (status === 429) return detail || "Слишком много попыток. Подождите немного и повторите оплату.";
  if (status === 502 || status === 503) return detail || "Платежный сервис временно недоступен.";
  if (status >= 500) return "Сервис оплаты временно недоступен.";
  return detail || "Не удалось выполнить запрос оплаты.";
}

export async function createRobokassaInvoice({ email, amountRub }) {
  const response = await fetch(`${ROBOKASSA_API_BASE_URL}/payments/robokassa/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount_rub: amountRub,
    }),
  });
  const body = await readJson(response);

  if (!response.ok) {
    throw new PaymentApiError(errorMessageForStatus(response.status, body?.detail), {
      status: response.status,
      retryAfterSeconds: retryAfterFromResponse(response, body),
      body,
    });
  }

  return body;
}

export async function confirmRobokassaInvoice(invoiceId, email) {
  const response = await fetch(
    `${ROBOKASSA_API_BASE_URL}/payments/robokassa/invoices/${encodeURIComponent(invoiceId)}/confirm`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  );
  const body = await readJson(response);

  if (response.status === 200 || response.status === 202 || response.status === 409) {
    return {
      statusCode: response.status,
      body,
      retryAfterSeconds: retryAfterFromResponse(response, body),
    };
  }

  if (!response.ok) {
    throw new PaymentApiError(errorMessageForStatus(response.status, body?.detail), {
      status: response.status,
      retryAfterSeconds: retryAfterFromResponse(response, body),
      body,
    });
  }

  return {
    statusCode: response.status,
    body,
    retryAfterSeconds: retryAfterFromResponse(response, body),
  };
}
