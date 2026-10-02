import express from "express";
import {
  getPublishedPosts,
  getPublishedPostById,
  getAllPosts,
  getScheduledPosts,
  createPost,
  updatePost,
  deletePost,
  uploadBlogImage,
  getBlogImage,
} from "../controllers/blogController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const supportedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!supportedTypes.includes(file.mimetype)) {
      return callback(new Error("Only JPEG, PNG, WebP, and GIF images are supported."));
    }
    callback(null, true);
  },
});

const handleImageUpload = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Images must be 5 MB or smaller.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Image upload failed.",
    });
  });
};

router.get("/images/:id", getBlogImage);
router.post("/images", protect, adminOnly, handleImageUpload, uploadBlogImage);
router.get("/", getPublishedPosts);
router.get("/all", protect, adminOnly, getAllPosts);
router.get("/scheduled", protect, adminOnly, getScheduledPosts);
router.post("/", protect, adminOnly, createPost);
router.patch("/:id", protect, adminOnly, updatePost);
router.delete("/:id", protect, adminOnly, deletePost);
router.get("/:id", getPublishedPostById);

export default router;
