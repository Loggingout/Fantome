import express from "express";
import {
  createEmployee,
  getAllEmployees,
  updateEmployeeRole,
  updateHourlyRate,
  updateJobTitle,
  deleteEmployee,
  getPayoutSchedule,
  updateHireDate,
} from "../controllers/adminEmployeeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllEmployees);
router.get("/payout-schedule", protect, adminOnly, getPayoutSchedule);
router.post("/", protect, adminOnly, createEmployee);
router.patch("/:id/role", protect, adminOnly, updateEmployeeRole);
router.patch("/:id/rate", protect, adminOnly, updateHourlyRate);
router.patch("/:id/job-title", protect, adminOnly, updateJobTitle);
router.patch("/:id/hire-date", protect, adminOnly, updateHireDate);
router.delete("/:id", protect, adminOnly, deleteEmployee);

export default router;
