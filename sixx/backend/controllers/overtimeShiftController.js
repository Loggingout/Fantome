import { OvertimeShift } from "../models/OvertimeShift.js";
import { Notification } from "../models/Notification.js";

// Format a date string "YYYY-MM-DD" for display without timezone shifting
function formatDateLabel(dateStr) {
  const [y, m, d] = dateStr.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// ── ADMIN ──────────────────────────────────────────

// POST /api/overtime-shifts  — admin creates an OT shift
export const createOvertimeShift = async (req, res) => {
  try {
    const { employee, role, date, startTime, endTime, otMultiplier, reason, notes } =
      req.body;

    if (!employee || !role || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "employee, role, date, startTime, and endTime are required",
      });
    }

    const shift = await OvertimeShift.create({
      employee,
      role,
      date,
      startTime,
      endTime,
      otMultiplier: otMultiplier ?? 1.5,
      reason: reason || "",
      notes: notes || "",
      status: "pending",
    });

    // Notify the employee about the new OT shift
    const multiplierLabel = (otMultiplier ?? 1.5) === 2 ? "double time (2×)" : "time-and-a-half (1.5×)";
    await Notification.create({
      employee,
      type: "overtime-shift",
      message: `You have been scheduled for an overtime shift on ${formatDateLabel(date)} from ${startTime} to ${endTime} at ${multiplierLabel}.${reason ? ` Reason: ${reason}.` : ""}`,
    });

    return res.status(201).json({ success: true, shift });
  } catch (err) {
    console.error("createOvertimeShift Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/overtime-shifts  — admin gets all OT shifts
export const getAllOvertimeShifts = async (req, res) => {
  try {
    const shifts = await OvertimeShift.find()
      .populate("employee", "name email role")
      .sort({ date: -1, startTime: 1 });

    return res.status(200).json({ success: true, shifts });
  } catch (err) {
    console.error("getAllOvertimeShifts Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/overtime-shifts/:id/status  — admin approves or rejects an OT shift
export const updateOvertimeShiftStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const shift = await OvertimeShift.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("employee", "name email role");

    if (!shift) {
      return res.status(404).json({ success: false, message: "OT shift not found" });
    }

    return res.status(200).json({ success: true, shift });
  } catch (err) {
    console.error("updateOvertimeShiftStatus Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/overtime-shifts/:id  — admin deletes an OT shift
export const deleteOvertimeShift = async (req, res) => {
  try {
    const shift = await OvertimeShift.findByIdAndDelete(req.params.id);

    if (!shift) {
      return res.status(404).json({ success: false, message: "OT shift not found" });
    }

    return res.status(200).json({ success: true, message: "OT shift deleted" });
  } catch (err) {
    console.error("deleteOvertimeShift Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/overtime-shifts/mine  — employee gets their own OT shifts
export const getMyOvertimeShifts = async (req, res) => {
  try {
    const shifts = await OvertimeShift.find({ employee: req.user._id }).sort({
      date: -1,
    });

    return res.status(200).json({ success: true, shifts });
  } catch (err) {
    console.error("getMyOvertimeShifts Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
