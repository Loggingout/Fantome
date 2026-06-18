import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  submitLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,
  updateLeaveStatus,
} from "../controllers/leaveController.js";

const router = express.Router();

// Employee
router.post("/", protect, submitLeaveRequest);
router.get("/mine", protect, getMyLeaveRequests);

// Admin
router.get("/all", protect, adminOnly, getAllLeaveRequests);
router.patch("/:id/status", protect, adminOnly, updateLeaveStatus);

export default router;
