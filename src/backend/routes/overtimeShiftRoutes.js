import express from "express";
import {
  createOvertimeShift,
  getAllOvertimeShifts,
  updateOvertimeShiftStatus,
  deleteOvertimeShift,
  getMyOvertimeShifts,
} from "../controllers/overtimeShiftController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Employee routes
router.get("/mine", getMyOvertimeShifts);

// Admin routes
router.post("/", adminOnly, createOvertimeShift);
router.get("/", adminOnly, getAllOvertimeShifts);
router.patch("/:id/status", adminOnly, updateOvertimeShiftStatus);
router.delete("/:id", adminOnly, deleteOvertimeShift);

export default router;
