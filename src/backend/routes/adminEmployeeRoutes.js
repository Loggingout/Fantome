import express from "express";
import {
  createEmployee,
  getAllEmployees,
  updateEmployeeRole,
  updateHourlyRate,
  updateJobTitle,
} from "../controllers/adminEmployeeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllEmployees);
router.post("/", protect, adminOnly, createEmployee);
router.patch("/:id/role", protect, adminOnly, updateEmployeeRole);
router.patch("/:id/rate", protect, adminOnly, updateHourlyRate);
router.patch("/:id/job-title", protect, adminOnly, updateJobTitle);

export default router;
