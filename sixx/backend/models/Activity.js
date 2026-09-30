import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);
