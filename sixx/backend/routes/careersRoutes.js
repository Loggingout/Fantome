import express from "express";
import { rateLimit } from "express-rate-limit";
import { getOpenJobs, submitApplication } from "../controllers/careersController.js";

const router = express.Router();
const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/jobs", getOpenJobs);
router.post("/jobs/:id/apply", applyLimiter, submitApplication);

export default router;
