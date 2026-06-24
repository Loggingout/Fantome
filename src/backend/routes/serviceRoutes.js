import express from "express";
import {
  getPublicServices,
  getAllServices,
  createService,
  updateService,
  updatePrice,
  deleteService,
} from "../controllers/serviceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getPublicServices);

// Admin
router.get("/admin", protect, adminOnly, getAllServices);
router.post("/admin", protect, adminOnly, createService);
router.put("/admin/:id", protect, adminOnly, updateService);
router.patch("/admin/:id/price", protect, adminOnly, updatePrice);
router.delete("/admin/:id", protect, adminOnly, deleteService);

export default router;
