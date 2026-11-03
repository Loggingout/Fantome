import express from "express";
import {
  createPlatform,
  getAdminStatuses,
  updatePlatformStatus,
} from "../controllers/statusController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/", getAdminStatuses);
router.post("/", createPlatform);
router.patch("/:id", updatePlatformStatus);

export default router;
