import express from "express";
import {
  getToday,
  clockIn,
  clockOut,
  lunchStart,
  lunchEnd,
  getAdminSummary,
  getMyAttendance,
  getMyPayroll,
} from "../controllers/attendanceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Admin-only
router.get("/admin/summary", adminOnly, getAdminSummary);

// Employee routes
router.get("/today", getToday);
router.get("/my-attendance", getMyAttendance);
router.get("/my-payroll", getMyPayroll);
router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut);
router.post("/lunch-start", lunchStart);
router.post("/lunch-end", lunchEnd);

export default router;
