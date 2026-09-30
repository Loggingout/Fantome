import mongoose from "mongoose";

const overtimeShiftSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    role: { type: String, required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    startTime: { type: String, required: true }, // "HH:MM"
    endTime: { type: String, required: true },   // "HH:MM"
    // Overtime multiplier: 1.5 = time-and-a-half, 2 = double time
    otMultiplier: {
      type: Number,
      enum: [1.5, 2.0],
      default: 1.5,
    },
    reason: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const OvertimeShift = mongoose.model("OvertimeShift", overtimeShiftSchema);
