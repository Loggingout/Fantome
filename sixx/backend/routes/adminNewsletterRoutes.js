import express from "express";
import { getNewsletterAnalytics } from "../controllers/newsletterAnalyticsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/analytics", getNewsletterAnalytics);

export default router;
