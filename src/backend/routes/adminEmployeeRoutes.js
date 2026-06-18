import express from "express";
import { createEmployee, getAllEmployees, updateEmployeeRole } from "../controllers/adminEmployeeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllEmployees);
router.post("/", protect, adminOnly, createEmployee);
router.patch("/:id/role", protect, adminOnly, updateEmployeeRole);

export default router;
