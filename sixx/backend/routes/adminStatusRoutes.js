import express from "express";
import {
  createPlatform,
  deletePlatformStatus,
  getAdminStatuses,
  updatePlatformStatus,
} from "../controllers/statusController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/", getAdminStatuses);
router.post("/", createPlatform);
router.patch("/:id", updatePlatformStatus);
router.delete("/:id", deletePlatformStatus);

export default router;
