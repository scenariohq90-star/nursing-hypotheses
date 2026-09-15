const VISIT_MARKER = "nursing-hypotheses.analytics-visit.v1";
let lastPage = "";

function analyticsAllowed() {
  return navigator.globalPrivacyControl !== true && navigator.doNotTrack !== "1";
}

export function recordAnonymousEvent(event, dimension, language, score) {
  if (typeof window === "undefined" || !analyticsAllowed()) return;
  const payload = { event, dimension, language: language === "ar" ? "ar" : "en" };
  if (Number.isFinite(score)) payload.score = Math.max(0, Math.min(100, Math.round(score)));
  try {
    void fetch("/api/anonymous-analytics", {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  } catch { /* Learning remains available if anonymous analytics are unavailable. */ }
}

export function recordAnonymousPage(page, language) {
  if (typeof window === "undefined" || !analyticsAllowed() || page === "owner-dashboard") return;
  try {
    if (!window.sessionStorage.getItem(VISIT_MARKER)) {
      window.sessionStorage.setItem(VISIT_MARKER, "1");
      recordAnonymousEvent("visit", "all", language);
    }
  } catch { /* Page counts remain useful without session storage. */ }
  if (lastPage !== page) {
    lastPage = page;
    recordAnonymousEvent("page", page, language);
  }
}
