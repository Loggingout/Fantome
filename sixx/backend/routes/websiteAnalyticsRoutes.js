import express from "express";
import { rateLimit } from "express-rate-limit";
import {
  getWebsiteAnalyticsSummary,
  recordWebsiteAnalyticsEvent,
} from "../controllers/websiteAnalyticsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
const eventLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 240,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/events", eventLimiter, recordWebsiteAnalyticsEvent);
router.get("/summary", protect, adminOnly, getWebsiteAnalyticsSummary);

export default router;
