import express from "express";
import { rateLimit } from "express-rate-limit";
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
} from "../controllers/newsletterController.js";

const router = express.Router();
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/subscribe", submitLimiter, subscribeToNewsletter);
router.get("/unsubscribe/:token", unsubscribeFromNewsletter);
export default router;
