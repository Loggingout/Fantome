import mongoose from "mongoose";

const scheduledNotificationSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    // Reference back to the shift so we can cancel if the shift is deleted
    shift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true,
    },
    message: { type: String, required: true },
    scheduledFor: { type: Date, required: true },
    delivered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for efficient polling: find undelivered, due notifications quickly
scheduledNotificationSchema.index({ delivered: 1, scheduledFor: 1 });

export const ScheduledNotification = mongoose.model(
  "ScheduledNotification",
  scheduledNotificationSchema
);
