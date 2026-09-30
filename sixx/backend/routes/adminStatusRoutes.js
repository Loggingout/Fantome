import express from "express";
import {
  getAdminStatuses,
  updatePlatformStatus,
} from "../controllers/statusController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/", getAdminStatuses);
router.patch("/:id", updatePlatformStatus);

export default router;
