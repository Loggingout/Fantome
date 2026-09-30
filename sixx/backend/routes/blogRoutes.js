import express from "express";
import {
  getPublishedPosts,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/blogController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPublishedPosts);
router.get("/all", protect, adminOnly, getAllPosts);
router.post("/", protect, adminOnly, createPost);
router.patch("/:id", protect, adminOnly, updatePost);
router.delete("/:id", protect, adminOnly, deletePost);

export default router;
