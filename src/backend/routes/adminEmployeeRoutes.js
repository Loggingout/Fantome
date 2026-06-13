import express from "express";
import { createEmployee } from "../controllers/adminEmployeeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin creates employees
router.post("/", protect, adminOnly, createEmployee);

export default router;
