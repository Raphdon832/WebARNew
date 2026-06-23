import { sendAnalyticsEvent } from "../api/analytics";

const SESSION_KEY = "identifyng.viewer.sessionId";
const ONCE_EVENTS = new Set([
  "viewer_opened",
  "launch_clicked",
  "camera_permission_granted",
  "camera_permission_denied",
  "ar_session_started",
  "content_loaded",
  "video_started",
  "cta_clicked"
]);
const THROTTLED_EVENTS = {
  marker_found: 15000,
  marker_lost: 15000,
  video_completed: 1000,
  cta_shown: 60000,
  viewer_error: 5000
};

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const getSessionId = () => {
  if (typeof window === "undefined") return createId();

  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const created = createId();
    window.sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch (_err) {
    return createId();
  }
};

const getUserAgent = () =>
  typeof navigator === "undefined" ? "" : navigator.userAgent || "";

const detectOs = (userAgent) => {
  if (/android/i.test(userAgent)) return "Android";
  if (/ipad|iphone|ipod/i.test(userAgent)) return "iOS";
  if (/mac os x/i.test(userAgent)) return "macOS";
  if (/windows/i.test(userAgent)) return "Windows";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Unknown";
};

const detectBrowser = (userAgent) => {
  if (/edg\//i.test(userAgent)) return "Edge";
  if (/samsungbrowser/i.test(userAgent)) return "Samsung Internet";
  if (/crios/i.test(userAgent)) return "Chrome iOS";
  if (/chrome|chromium|crios/i.test(userAgent)) return "Chrome";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent)) return "Safari";
  return "Unknown";
};

const detectDeviceType = (userAgent) => {
  if (/ipad|tablet/i.test(userAgent)) return "Tablet";
  if (/mobile|iphone|ipod|android/i.test(userAgent)) return "Mobile";
  return "Desktop";
};

const getTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
  } catch (_err) {
    return "unknown";
  }
};

const roundScreenDimension = (value) => {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.max(100, Math.round(value / 100) * 100);
};

const getScreenBucket = () => {
  if (typeof window === "undefined") return "unknown";
  const width = window.screen?.width || window.innerWidth || 0;
  const height = window.screen?.height || window.innerHeight || 0;
  const dpr = Math.round((window.devicePixelRatio || 1) * 10) / 10;
  return `${roundScreenDimension(width)}x${roundScreenDimension(height)}@${dpr}`;
};

const sanitizeMetadata = (metadata = {}) =>
  Object.entries(metadata)
    .slice(0, 16)
    .reduce((result, [key, value]) => {
      if (!key) return result;
      if (typeof value === "string") {
        result[key] = value.slice(0, 320);
      } else if (typeof value === "number" && Number.isFinite(value)) {
        result[key] = value;
      } else if (typeof value === "boolean") {
        result[key] = value;
      }
      return result;
    }, {});

export const createViewerAnalyticsTracker = (project) => {
  const userAgent = getUserAgent();
  const sessionId = getSessionId();
  const sentAtByKey = new Map();

  const basePayload = {
    projectId: project?.id,
    slug: project?.slug,
    sessionId,
    timezone: getTimezone(),
    screenBucket: getScreenBucket(),
    deviceType: detectDeviceType(userAgent),
    browser: detectBrowser(userAgent),
    os: detectOs(userAgent),
    arEngine: project?.config?.trackingOptions?.arEngine === "8thwall" ? "8thwall" : "mindar",
    contentType: project?.config?.contentType || "model"
  };

  const track = (eventName, metadata = {}, options = {}) => {
    if (!basePayload.projectId) return;

    const now = Date.now();
    const dedupeKey = options.dedupeKey || eventName;
    const lastSentAt = sentAtByKey.get(dedupeKey);
    const minIntervalMs =
      options.minIntervalMs ?? THROTTLED_EVENTS[eventName] ?? 0;

    if (options.once || ONCE_EVENTS.has(eventName)) {
      if (lastSentAt) return;
    } else if (lastSentAt && minIntervalMs && now - lastSentAt < minIntervalMs) {
      return;
    }

    sentAtByKey.set(dedupeKey, now);

    sendAnalyticsEvent(
      {
        ...basePayload,
        eventName,
        timestamp: new Date().toISOString(),
        metadata: sanitizeMetadata(metadata)
      },
      {
        beacon: options.beacon !== false,
        keepalive: options.keepalive !== false
      }
    ).catch(() => {
      // Analytics should never interrupt the viewer experience.
    });
  };

  return { track, sessionId };
};
