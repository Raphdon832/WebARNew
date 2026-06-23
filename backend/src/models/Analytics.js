import crypto from "crypto";
import { db, FieldValue } from "../lib/firebase.js";
import { findProjectById } from "./Project.js";

export const ANALYTICS_EVENT_NAMES = [
  "viewer_opened",
  "launch_clicked",
  "camera_permission_granted",
  "camera_permission_denied",
  "ar_session_started",
  "marker_found",
  "marker_lost",
  "content_loaded",
  "video_started",
  "video_completed",
  "cta_shown",
  "cta_clicked",
  "viewer_error"
];

const ANALYTICS_EVENT_SET = new Set(ANALYTICS_EVENT_NAMES);
const analyticsEventsCollection = db.collection("analyticsEvents");
const dailyRollupsCollection = db.collection("analyticsDailyRollups");
const uniqueViewersCollection = db.collection("analyticsUniqueViewers");

const EVENT_TOTAL_KEYS = {
  viewer_opened: "views",
  launch_clicked: "launches",
  camera_permission_granted: "cameraGranted",
  camera_permission_denied: "cameraDenied",
  ar_session_started: "arSessions",
  marker_found: "markerFounds",
  marker_lost: "markerLosts",
  content_loaded: "contentLoads",
  video_started: "videoStarts",
  video_completed: "videoCompletions",
  cta_shown: "ctaImpressions",
  cta_clicked: "ctaClicks",
  viewer_error: "errors"
};

const DEFAULT_TOTALS = {
  views: 0,
  uniqueViewers: 0,
  launches: 0,
  cameraGranted: 0,
  cameraDenied: 0,
  arSessions: 0,
  markerFounds: 0,
  markerLosts: 0,
  contentLoads: 0,
  videoStarts: 0,
  videoCompletions: 0,
  ctaImpressions: 0,
  ctaClicks: 0,
  errors: 0
};

const FUNNEL_STEPS = [
  ["viewer_opened", "Viewed"],
  ["launch_clicked", "Launched"],
  ["camera_permission_granted", "Camera allowed"],
  ["ar_session_started", "AR started"],
  ["marker_found", "Marker found"],
  ["content_loaded", "Content loaded"],
  ["video_completed", "Video completed"],
  ["cta_clicked", "CTA clicked"]
];

const createHttpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const sanitizeString = (value, fallback = "", maxLength = 160) => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLength);
};

const sanitizeId = (value) => {
  const normalized = sanitizeString(value, "", 160);
  return normalized && !normalized.includes("/") ? normalized : "";
};

const sanitizeFieldKey = (value, fallback = "unknown") => {
  const normalized = sanitizeString(value, fallback, 80)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return normalized || fallback;
};

const setNestedValue = (target, path, value) => {
  const parts = path.split(".");
  let cursor = target;

  parts.slice(0, -1).forEach((part) => {
    cursor[part] = cursor[part] || {};
    cursor = cursor[part];
  });

  cursor[parts[parts.length - 1]] = value;
};

const readCounterMap = (data = {}, path) => {
  const nested = path.split(".").reduce((cursor, key) => cursor?.[key], data);
  const values = nested && typeof nested === "object" && !Array.isArray(nested) ? { ...nested } : {};
  const prefix = `${path}.`;

  Object.entries(data).forEach(([key, value]) => {
    if (!key.startsWith(prefix)) return;
    values[key.slice(prefix.length)] = value;
  });

  return values;
};

const readLabelMap = (data = {}, path) => {
  const values = readCounterMap(data, path);
  return Object.entries(values).reduce((result, [key, value]) => {
    if (typeof value === "string") result[key] = value;
    return result;
  }, {});
};

const sanitizeMetadata = (metadata) => {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return {};

  return Object.entries(metadata)
    .slice(0, 16)
    .reduce((result, [key, value]) => {
      const safeKey = sanitizeFieldKey(key, "");
      if (!safeKey) return result;

      if (typeof value === "string") {
        result[safeKey] = sanitizeString(value, "", 320);
      } else if (typeof value === "number" && Number.isFinite(value)) {
        result[safeKey] = value;
      } else if (typeof value === "boolean") {
        result[safeKey] = value;
      }

      return result;
    }, {});
};

const parseClientTimestamp = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
};

const getUtcDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const normalizeIp = (value = "") =>
  String(value)
    .split(",")[0]
    .trim()
    .replace(/^::ffff:/, "");

const getRequestIp = (req) =>
  normalizeIp(
    req.get("x-forwarded-for") ||
      req.ip ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      ""
  );

const getHashSalt = () =>
  process.env.ANALYTICS_HASH_SALT ||
  process.env.JWT_SECRET ||
  "identifyng-local-analytics-salt";

const createFingerprintHash = (req, event) => {
  const fingerprintParts = [
    getRequestIp(req),
    req.get("user-agent") || "",
    req.get("accept-language") || "",
    event.timezone,
    event.screenBucket
  ];

  return crypto
    .createHmac("sha256", getHashSalt())
    .update(fingerprintParts.join("|"))
    .digest("hex");
};

const normalizeEventPayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    throw createHttpError(400, "Analytics event payload is required");
  }

  const eventName = sanitizeString(payload.eventName, "", 80);
  if (!ANALYTICS_EVENT_SET.has(eventName)) {
    throw createHttpError(400, "Unsupported analytics event");
  }

  const projectId = sanitizeId(payload.projectId);
  if (!projectId) {
    throw createHttpError(400, "Project id is required");
  }

  return {
    eventName,
    projectId,
    slug: sanitizeString(payload.slug, "", 160),
    sessionId: sanitizeString(payload.sessionId, "", 160),
    clientTimestamp: parseClientTimestamp(payload.timestamp),
    timezone: sanitizeString(payload.timezone, "unknown", 80),
    screenBucket: sanitizeString(payload.screenBucket, "unknown", 80),
    deviceType: sanitizeString(payload.deviceType, "unknown", 80),
    browser: sanitizeString(payload.browser, "unknown", 80),
    os: sanitizeString(payload.os, "unknown", 80),
    arEngine: sanitizeString(payload.arEngine, "unknown", 80),
    contentType: sanitizeString(payload.contentType, "unknown", 80),
    metadata: sanitizeMetadata(payload.metadata)
  };
};

const createRecentError = (event) => ({
  occurredAt: event.clientTimestamp || new Date().toISOString(),
  message: sanitizeString(event.metadata.message, "Viewer error", 240),
  code: sanitizeString(event.metadata.code, event.eventName, 80),
  deviceType: event.deviceType,
  browser: event.browser,
  os: event.os,
  arEngine: event.arEngine,
  contentType: event.contentType
});

const mergeTotals = (target, source = {}) => {
  Object.keys(DEFAULT_TOTALS).forEach((key) => {
    target[key] = (target[key] || 0) + Number(source[key] || 0);
  });
  return target;
};

const dateKeyToUtcDate = (dateKey) => {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const parseDateRange = ({ from, to }) => {
  const today = new Date();
  const defaultTo = getUtcDateKey(today);
  const defaultFromDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  defaultFromDate.setUTCDate(defaultFromDate.getUTCDate() - 29);
  const fromKey = from || getUtcDateKey(defaultFromDate);
  const toKey = to || defaultTo;
  const fromDate = dateKeyToUtcDate(fromKey);
  const toDate = dateKeyToUtcDate(toKey);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fromKey) || !/^\d{4}-\d{2}-\d{2}$/.test(toKey)) {
    throw createHttpError(400, "Dates must use YYYY-MM-DD format");
  }

  if (!fromDate || !toDate || fromDate > toDate) {
    throw createHttpError(400, "Invalid analytics date range");
  }

  const days = Math.floor((toDate - fromDate) / 86400000) + 1;
  if (days > 120) {
    throw createHttpError(400, "Analytics date range cannot exceed 120 days");
  }

  return { fromKey, toKey, fromDate, days };
};

const buildDateKeys = ({ fromDate, days }) =>
  Array.from({ length: days }, (_item, index) => {
    const date = new Date(fromDate);
    date.setUTCDate(date.getUTCDate() + index);
    return getUtcDateKey(date);
  });

const rate = (numerator, denominator) => {
  if (!denominator) return 0;
  return Number((numerator / denominator).toFixed(4));
};

const collectBreakdown = (breakdownTotals, labelTotals, source = {}, labels = {}) => {
  Object.entries(source).forEach(([key, count]) => {
    breakdownTotals[key] = (breakdownTotals[key] || 0) + Number(count || 0);
    if (labels[key]) labelTotals[key] = labels[key];
  });
};

const formatBreakdown = (counts = {}, labels = {}) =>
  Object.entries(counts)
    .map(([key, count]) => ({
      key,
      label: labels[key] || key.replace(/_/g, " "),
      count
    }))
    .sort((a, b) => b.count - a.count);

const readRollupTotals = (rollup = {}) => {
  const totals = { ...DEFAULT_TOTALS };
  const values = readCounterMap(rollup, "totals");

  Object.keys(DEFAULT_TOTALS).forEach((key) => {
    totals[key] = Number(values[key] || 0);
  });

  return totals;
};

const serializeRollupDay = (date, rollup = {}) => {
  const totals = readRollupTotals(rollup);
  return {
    date,
    ...totals,
    eventCounts: readCounterMap(rollup, "eventCounts")
  };
};

export const recordAnalyticsEvent = async ({ req, payload }) => {
  const event = normalizeEventPayload(payload);
  const project = await findProjectById(event.projectId);

  if (!project || (event.slug && project.slug !== event.slug)) {
    throw createHttpError(404, "Project not found");
  }

  const now = new Date();
  const dateKey = getUtcDateKey(now);
  const fingerprintHash = createFingerprintHash(req, event);
  const eventRef = analyticsEventsCollection.doc();
  const rollupRef = dailyRollupsCollection.doc(`${event.projectId}_${dateKey}`);
  const uniqueRef = uniqueViewersCollection.doc(`${event.projectId}_${dateKey}_${fingerprintHash}`);
  const totalKey = EVENT_TOTAL_KEYS[event.eventName];
  const rawEvent = {
    ...event,
    owner: project.owner,
    slug: project.slug,
    fingerprintHash,
    dateKey,
    createdAt: FieldValue.serverTimestamp()
  };

  await db.runTransaction(async (transaction) => {
    const rollupSnap = await transaction.get(rollupRef);
    const uniqueSnap =
      event.eventName === "viewer_opened" ? await transaction.get(uniqueRef) : null;
    const rollupData = rollupSnap.exists ? rollupSnap.data() : {};
    const updates = {
      projectId: event.projectId,
      owner: project.owner,
      slug: project.slug,
      dateKey,
      updatedAt: FieldValue.serverTimestamp()
    };
    setNestedValue(updates, `eventCounts.${event.eventName}`, FieldValue.increment(1));

    if (!rollupSnap.exists) {
      updates.createdAt = FieldValue.serverTimestamp();
    }

    if (totalKey) {
      setNestedValue(updates, `totals.${totalKey}`, FieldValue.increment(1));
    }

    if (event.eventName === "viewer_opened") {
      ["deviceType", "browser", "os", "arEngine", "contentType"].forEach((key) => {
        const label = event[key] || "unknown";
        const fieldKey = sanitizeFieldKey(label);
        setNestedValue(updates, `breakdowns.${key}.${fieldKey}`, FieldValue.increment(1));
        setNestedValue(updates, `breakdownLabels.${key}.${fieldKey}`, label);
      });

      if (!uniqueSnap?.exists) {
        transaction.set(uniqueRef, {
          projectId: event.projectId,
          owner: project.owner,
          dateKey,
          fingerprintHash,
          createdAt: FieldValue.serverTimestamp()
        });
        setNestedValue(updates, "totals.uniqueViewers", FieldValue.increment(1));
      }
    }

    if (event.eventName === "viewer_error") {
      updates.recentErrors = [
        createRecentError(event),
        ...(Array.isArray(rollupData.recentErrors) ? rollupData.recentErrors : [])
      ].slice(0, 12);
    }

    transaction.set(eventRef, rawEvent);
    transaction.set(rollupRef, updates, { merge: true });
  });

  return { ok: true };
};

export const getProjectAnalyticsSummary = async ({ projectId, owner, from, to }) => {
  const project = await findProjectById(projectId);

  if (!project || project.owner !== owner) {
    throw createHttpError(404, "Project not found");
  }

  const range = parseDateRange({ from, to });
  const dateKeys = buildDateKeys(range);
  const snapshots = await Promise.all(
    dateKeys.map((dateKey) => dailyRollupsCollection.doc(`${projectId}_${dateKey}`).get())
  );
  const totals = { ...DEFAULT_TOTALS };
  const eventCounts = {};
  const breakdowns = {
    deviceType: {},
    browser: {},
    os: {},
    arEngine: {},
    contentType: {}
  };
  const breakdownLabels = {
    deviceType: {},
    browser: {},
    os: {},
    arEngine: {},
    contentType: {}
  };
  const recentErrors = [];
  const daily = snapshots.map((snapshot, index) => {
    const data = snapshot.exists ? snapshot.data() : {};
    mergeTotals(totals, readRollupTotals(data));
    Object.entries(readCounterMap(data, "eventCounts")).forEach(([key, count]) => {
      eventCounts[key] = (eventCounts[key] || 0) + Number(count || 0);
    });

    Object.keys(breakdowns).forEach((key) => {
      collectBreakdown(
        breakdowns[key],
        breakdownLabels[key],
        readCounterMap(data, `breakdowns.${key}`),
        readLabelMap(data, `breakdownLabels.${key}`)
      );
    });

    if (Array.isArray(data.recentErrors)) {
      recentErrors.push(...data.recentErrors);
    }

    return serializeRollupDay(dateKeys[index], data);
  });

  const ctaImpressions = totals.ctaImpressions;
  const ctaClicks = totals.ctaClicks;
  const analyticsViews = totals.views;
  totals.analyticsViews = analyticsViews;
  totals.legacyViews = Number(project.viewCount || 0);
  totals.views = Math.max(totals.views, totals.legacyViews);

  return {
    project: {
      id: project.id,
      name: project.name,
      slug: project.slug,
      viewCount: project.viewCount || 0,
      contentType: project.config?.contentType || "model",
      ctaLabel: project.config?.videoOptions?.ctaLabel || "Learn More",
      ctaUrl: project.config?.videoOptions?.ctaUrl || ""
    },
    range: {
      from: range.fromKey,
      to: range.toKey,
      days: range.days
    },
    totals,
    rates: {
      launchRate: rate(totals.launches, totals.views),
      cameraSuccessRate: rate(totals.cameraGranted, totals.cameraGranted + totals.cameraDenied),
      markerFoundRate: rate(totals.markerFounds, totals.arSessions || totals.launches),
      videoCompletionRate: rate(totals.videoCompletions, totals.videoStarts),
      ctaCtr: rate(ctaClicks, ctaImpressions),
      errorRate: rate(totals.errors, totals.views)
    },
    funnel: FUNNEL_STEPS.map(([eventName, label]) => ({
      eventName,
      label,
      count: Number(eventCounts[eventName] || 0)
    })),
    cta: {
      label: project.config?.videoOptions?.ctaLabel || "Learn More",
      url: project.config?.videoOptions?.ctaUrl || "",
      impressions: ctaImpressions,
      clicks: ctaClicks,
      ctr: rate(ctaClicks, ctaImpressions)
    },
    breakdowns: {
      deviceType: formatBreakdown(breakdowns.deviceType, breakdownLabels.deviceType),
      browser: formatBreakdown(breakdowns.browser, breakdownLabels.browser),
      os: formatBreakdown(breakdowns.os, breakdownLabels.os),
      arEngine: formatBreakdown(breakdowns.arEngine, breakdownLabels.arEngine),
      contentType: formatBreakdown(breakdowns.contentType, breakdownLabels.contentType)
    },
    daily,
    recentErrors: recentErrors
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .slice(0, 12)
  };
};
