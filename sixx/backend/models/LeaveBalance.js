import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
    },
    ptoHours: { type: Number, default: 10 },
    uptoHours: { type: Number, default: 40 },
    ptoUsed: { type: Number, default: 0 },
    uptoUsed: { type: Number, default: 0 },
    lastAccrualDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const LeaveBalance = mongoose.model("LeaveBalance", leaveBalanceSchema);
