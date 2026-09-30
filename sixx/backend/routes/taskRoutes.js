import express from "express";
import {
  createTask,
  getAllTasks,
  deleteTask,
  getMyTasks,
  getUnreadCount,
  updateTaskStatus,
} from "../controllers/taskController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Employee routes
router.get("/mine", getMyTasks);
router.get("/unread-count", getUnreadCount);
router.patch("/:id/status", updateTaskStatus);

// Admin routes
router.post("/", adminOnly, createTask);
router.get("/", adminOnly, getAllTasks);
router.delete("/:id", adminOnly, deleteTask);

export default router;
