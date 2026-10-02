import express from "express";
import { rateLimit } from "express-rate-limit";
import { submitContactMessage } from "../controllers/contactController.js";

const router = express.Router();
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 6,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", submitLimiter, submitContactMessage);

export default router;
