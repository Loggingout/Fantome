import express from "express";
import { getBlogAnalytics, updateBlogInflation } from "../controllers/blogAnalyticsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/", getBlogAnalytics);
router.put("/:id/inflation", updateBlogInflation);

export default router;