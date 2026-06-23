import API, { API_BASE_URL } from "./auth";

const analyticsEventsUrl = `${API_BASE_URL}/analytics/events`;

export const fetchProjectAnalyticsSummary = (projectId, params = {}) =>
  API.get(`/analytics/projects/${projectId}/summary`, { params }).then((res) => res.data);

export const sendAnalyticsEvent = (payload, options = {}) => {
  const body = JSON.stringify(payload);

  if (
    options.beacon &&
    typeof navigator !== "undefined" &&
    navigator.sendBeacon &&
    typeof Blob !== "undefined"
  ) {
    const blob = new Blob([body], { type: "text/plain" });
    if (navigator.sendBeacon(analyticsEventsUrl, blob)) {
      return Promise.resolve({ queued: true });
    }
  }

  if (typeof fetch === "undefined") {
    return Promise.resolve({ skipped: true });
  }

  return fetch(analyticsEventsUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: options.keepalive !== false
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Analytics event failed with ${res.status}`);
    }
    return res.json().catch(() => ({ ok: true }));
  });
};
