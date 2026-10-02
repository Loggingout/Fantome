import mongoose from "mongoose";

const newsletterDeliverySchema = new mongoose.Schema(
  {
    blogPost: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    subscriber: { type: mongoose.Schema.Types.ObjectId, ref: "NewsletterSubscriber", required: true },
    status: { type: String, enum: ["pending", "sent"], default: "pending" },
    attempts: { type: Number, default: 0 },
    sentAt: { type: Date, default: null },
    lastError: { type: String, default: "" },
  },
  { timestamps: true }
);

newsletterDeliverySchema.index({ blogPost: 1, subscriber: 1 }, { unique: true });

export const NewsletterDelivery = mongoose.model(
  "NewsletterDelivery",
  newsletterDeliverySchema
);
