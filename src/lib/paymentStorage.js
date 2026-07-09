const STORAGE_KEY = "coworky-robokassa-pending-invoices";
const MAX_STORED_INVOICES = 8;

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function safeParse(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

export function getStoredInvoices() {
  if (!canUseStorage()) return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

function writeStoredInvoices(invoices) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices.slice(0, MAX_STORED_INVOICES)));
}

export function extractQueryValue(search, name) {
  const params = new URLSearchParams(search || "");
  const expected = name.toLowerCase();

  for (const [key, value] of params.entries()) {
    if (key.toLowerCase() === expected) return value;
  }

  return "";
}

export function extractInvIdFromUrl(value) {
  if (!value) return "";

  try {
    const parsed = new URL(value, window.location.origin);
    return extractQueryValue(parsed.search, "InvId");
  } catch (_error) {
    const match = String(value).match(/[?&]InvId=([^&#]+)/i);
    return match ? decodeURIComponent(match[1]) : "";
  }
}

export function storePendingInvoice(invoice) {
  const robokassaInvId = invoice.robokassa_inv_id || extractInvIdFromUrl(invoice.payment_url);
  const entry = {
    invoice_id: invoice.invoice_id,
    robokassa_inv_id: robokassaInvId,
    amount_rub: invoice.amount_rub,
    email: invoice.email,
    payment_url: invoice.payment_url,
    status: invoice.status,
    expires_at: invoice.expires_at,
    created_at: new Date().toISOString(),
  };
  const existing = getStoredInvoices().filter((item) => item.invoice_id !== entry.invoice_id);
  writeStoredInvoices([entry, ...existing]);
  return entry;
}

export function removeStoredInvoice(invoiceId) {
  if (!invoiceId) return;
  writeStoredInvoices(getStoredInvoices().filter((item) => item.invoice_id !== invoiceId));
}

export function findStoredInvoice({ invoiceId = "", robokassaInvId = "" } = {}) {
  const invoices = getStoredInvoices();

  if (invoiceId) {
    const byPublicId = invoices.find((item) => item.invoice_id === invoiceId);
    if (byPublicId) return byPublicId;
  }

  if (robokassaInvId) {
    const byRobokassaId = invoices.find((item) => String(item.robokassa_inv_id || "") === String(robokassaInvId));
    if (byRobokassaId) return byRobokassaId;
  }

  return invoices[0] || null;
}

export function getLatestStoredInvoice() {
  return findStoredInvoice();
}
