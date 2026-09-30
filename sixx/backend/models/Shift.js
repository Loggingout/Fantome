import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    role: { type: String, required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true }, // "17:00"
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Shift = mongoose.model("Shift", shiftSchema);
