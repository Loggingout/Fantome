import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    type: {
      type: String,
      enum: ["sick", "time-off"],
      required: true,
    },
    startDate: { type: String, required: true },
    endDate:   { type: String, required: true },
    reason:    { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);
