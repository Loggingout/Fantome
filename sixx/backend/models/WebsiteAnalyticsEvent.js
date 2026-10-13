import mongoose from "mongoose";

const websiteAnalyticsEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ["visit", "duration", "platform_link_click"],
      required: true,
    },
    sessionId: { type: String, required: true, index: true, minlength: 12, maxlength: 64 },
    page: { type: String, required: true, maxlength: 120 },
    durationMs: { type: Number, default: null, min: 0, max: 8 * 60 * 60 * 1000 },
    platformId: { type: String, default: "", maxlength: 120 },
    url: { type: String, default: "", maxlength: 400 },
  },
  { timestamps: true }
);

websiteAnalyticsEventSchema.index({ createdAt: -1 });
websiteAnalyticsEventSchema.index({ eventType: 1, createdAt: -1 });
websiteAnalyticsEventSchema.index({ sessionId: 1, createdAt: -1 });

export const WebsiteAnalyticsEvent = mongoose.model(
  "WebsiteAnalyticsEvent",
  websiteAnalyticsEventSchema
);
