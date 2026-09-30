import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: String, // "YYYY-MM-DD" — one record per employee per day
      required: true,
    },
    clockIn: { type: Date, default: null },
    clockOut: { type: Date, default: null },
    lunchStart: { type: Date, default: null },
    lunchEnd: { type: Date, default: null },
    status: {
      type: String,
      enum: ["clocked-in", "on-break", "clocked-out"],
      default: "clocked-in",
    },
  },
  { timestamps: true }
);

// One record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
