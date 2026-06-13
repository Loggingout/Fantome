import express from "express";
import { authController } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

// Public routes
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected routes
router.get(
  "/me",
  protect,
  authController.getCurrentEmployee
);

export default router;
