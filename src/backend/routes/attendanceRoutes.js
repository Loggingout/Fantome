import express from "express";
import {
  getToday,
  clockIn,
  clockOut,
  lunchStart,
  lunchEnd,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All attendance routes require a logged-in employee
router.use(protect);

router.get("/today", getToday);
router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut);
router.post("/lunch-start", lunchStart);
router.post("/lunch-end", lunchEnd);

export default router;
