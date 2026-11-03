import mongoose from "mongoose";

const STATUS_VALUES = ["operational", "degraded", "maintenance", "outage", "being_developed", "unknown"];

const incidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["investigating", "identified", "monitoring", "resolved"],
      default: "investigating",
    },
    startedAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const historySchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    status: { type: String, enum: STATUS_VALUES, required: true },
  },
  { _id: false }
);

const statusPlatformSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["operational", "degraded", "maintenance", "outage", "being_developed", "unknown"],
      default: "unknown",
    },
    message: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
    incidents: { type: [incidentSchema], default: [] },
    history: { type: [historySchema], default: [] },
  },
  { timestamps: true }
);

export const StatusPlatform = mongoose.model(
  "StatusPlatform",
  statusPlatformSchema
);
