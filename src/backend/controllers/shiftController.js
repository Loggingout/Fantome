import { Shift } from "../models/Shift.js";
import { ScheduledNotification } from "../models/ScheduledNotification.js";

const REMINDERS = [
  { offsetMin: 60, label: "1 hour" },
  { offsetMin: 30, label: "30 minutes" },
  { offsetMin: 15, label: "15 minutes" },
];

// Build the shift start as a UTC Date from "YYYY-MM-DD" + "HH:MM"
function shiftStartUTC(date, startTime) {
  return new Date(`${date}T${startTime}:00.000Z`);
}

// ── ADMIN ──────────────────────────────────────────

// POST /api/shifts  — admin creates shifts (one or many dates)
export const createShift = async (req, res) => {
  try {
    const { employee, role, dates, startTime, endTime, notes } = req.body;

    if (!employee || !role || !dates?.length || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "employee, role, dates, startTime, and endTime are required",
      });
    }

    // Create one Shift document per date
    const docs = dates.map((date) => ({
      employee,
      role,
      date,
      startTime,
      endTime,
      notes: notes || "",
    }));

    const inserted = await Shift.insertMany(docs);

    // Schedule 3 reminder notifications per shift (only for future shift starts)
    const now = new Date();
    const scheduledDocs = [];

    for (const shift of inserted) {
      const shiftStart = shiftStartUTC(shift.date, shift.startTime);
      for (const { offsetMin, label } of REMINDERS) {
        const scheduledFor = new Date(shiftStart.getTime() - offsetMin * 60 * 1000);
        if (scheduledFor > now) {
          scheduledDocs.push({
            employee: shift.employee,
            shift: shift._id,
            message: `Reminder: Your shift starts in ${label} at ${shift.startTime}.`,
            scheduledFor,
          });
        }
      }
    }

    if (scheduledDocs.length > 0) {
      await ScheduledNotification.insertMany(scheduledDocs);
    }

    return res.status(201).json({ success: true, count: inserted.length });
  } catch (err) {
    console.error("createShift Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/shifts  — admin gets all shifts
export const getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find()
      .populate("employee", "name email role")
      .sort({ date: 1, startTime: 1 });

    return res.status(200).json({ success: true, shifts });
  } catch (err) {
    console.error("getAllShifts Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/shifts/:id  — admin deletes a shift
export const deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findByIdAndDelete(req.params.id);

    if (!shift) {
      return res
        .status(404)
        .json({ success: false, message: "Shift not found" });
    }

    // Cancel any undelivered reminders for this shift
    await ScheduledNotification.deleteMany({ shift: req.params.id, delivered: false });

    return res.status(200).json({ success: true, message: "Shift deleted" });
  } catch (err) {
    console.error("deleteShift Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── EMPLOYEE ───────────────────────────────────────

// GET /api/shifts/mine  — employee gets their upcoming shifts
export const getMyShifts = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const shifts = await Shift.find({
      employee: req.user._id,
      date: { $gte: today },
    }).sort({ date: 1, startTime: 1 });

    return res.status(200).json({ success: true, shifts });
  } catch (err) {
    console.error("getMyShifts Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
