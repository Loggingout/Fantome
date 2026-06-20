import express from "express";
import {
  getMyBalance,
  getAllBalances,
  adjustBalance,
} from "../controllers/leaveBalanceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/mine", protect, getMyBalance);
router.get("/all", protect, adminOnly, getAllBalances);
router.patch("/:employeeId/adjust", protect, adminOnly, adjustBalance);

export default router;
