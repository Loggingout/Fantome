import mongoose from "mongoose";

const newsletterStateSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  startedAt: { type: Date, required: true },
});

export const NewsletterState = mongoose.model("NewsletterState", newsletterStateSchema);
