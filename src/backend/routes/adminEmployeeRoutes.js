import express from "express";
import { createEmployee, getAllEmployees } from "../controllers/adminEmployeeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllEmployees);
router.post("/", protect, adminOnly, createEmployee);

export default router;
