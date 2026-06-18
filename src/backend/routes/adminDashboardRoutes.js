import express from "express";
import {
  getDashboardStats,
  getActivity,
  getAnalytics,
} from "../controllers/adminDashboardController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/activity", getActivity);
router.get("/analytics", getAnalytics);

export default router;
