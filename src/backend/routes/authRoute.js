import express from "express";
import { authController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddle.js";

const router = express.Router();

// Public routes
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected routes
router.get(
  "/me",
  authMiddleware,
  authController.getCurrentEmployee
);

export default router;
