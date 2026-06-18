import express from "express";
import {
  getToday,
  clockIn,
  clockOut,
  lunchStart,
  lunchEnd,
  getAdminSummary,
} from "../controllers/attendanceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All attendance routes require a logged-in user
router.use(protect);

// Admin-only
router.get("/admin/summary", adminOnly, getAdminSummary);

// Employee routes
router.get("/today", getToday);
router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut);
router.post("/lunch-start", lunchStart);
router.post("/lunch-end", lunchEnd);

export default router;
