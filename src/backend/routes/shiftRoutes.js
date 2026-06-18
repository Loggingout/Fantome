import express from "express";
import {
  createShift,
  getAllShifts,
  deleteShift,
  getMyShifts,
} from "../controllers/shiftController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Employee routes
router.get("/mine", getMyShifts);

// Admin routes
router.post("/", adminOnly, createShift);
router.get("/", adminOnly, getAllShifts);
router.delete("/:id", adminOnly, deleteShift);

export default router;
