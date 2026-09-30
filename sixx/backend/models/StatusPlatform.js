import mongoose from "mongoose";

const statusPlatformSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["operational", "degraded", "maintenance", "outage", "unknown"],
      default: "unknown",
    },
    message: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const StatusPlatform = mongoose.model(
  "StatusPlatform",
  statusPlatformSchema
);
