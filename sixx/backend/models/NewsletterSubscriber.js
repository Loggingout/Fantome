import mongoose from "mongoose";
import { randomBytes } from "node:crypto";

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date, default: null },
    unsubscribeToken: {
      type: String,
      required: true,
      unique: true,
      default: () => randomBytes(32).toString("hex"),
    },
  },
  { timestamps: true }
);

export const NewsletterSubscriber = mongoose.model(
  "NewsletterSubscriber",
  newsletterSubscriberSchema
);
