import express from "express";
import {
  getProjectAnalyticsSummary,
  recordAnalyticsEvent
} from "../models/Analytics.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

const parseAnalyticsBody = (body) => {
  if (typeof body !== "string") return body;
  try {
    return JSON.parse(body);
  } catch (_err) {
    return null;
  }
};

router.post("/events", express.text({ type: "text/plain" }), async (req, res) => {
  try {
    const payload = parseAnalyticsBody(req.body);
    const result = await recordAnalyticsEvent({ req, payload });
    res.status(202).json(result);
  } catch (err) {
    console.error("Analytics event error", err);
    res.status(err.status || 500).json({ message: err.status ? err.message : "Server error" });
  }
});

router.get("/projects/:projectId/summary", authRequired, async (req, res) => {
  try {
    const summary = await getProjectAnalyticsSummary({
      projectId: req.params.projectId,
      owner: req.userId,
      from: req.query.from,
      to: req.query.to
    });
    res.json(summary);
  } catch (err) {
    console.error("Analytics summary error", err);
    res.status(err.status || 500).json({ message: err.status ? err.message : "Server error" });
  }
});

export default router;
