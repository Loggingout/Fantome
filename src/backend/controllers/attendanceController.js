import { Attendance } from "../models/Attendance.js";

// Helper: get today's date string "YYYY-MM-DD"
const todayStr = () => new Date().toISOString().split("T")[0];

// GET /api/attendance/today
export const getToday = async (req, res) => {
  try {
    const record = await Attendance.findOne({
      employee: req.user._id,
      date: todayStr(),
    });

    return res.status(200).json({ success: true, attendance: record || null });
  } catch (err) {
    console.error("getToday Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/attendance/clock-in
export const clockIn = async (req, res) => {
  try {
    const existing = await Attendance.findOne({
      employee: req.user._id,
      date: todayStr(),
    });

    if (existing?.clockIn) {
      return res
        .status(400)
        .json({ success: false, message: "Already clocked in today" });
    }

    const record = existing
      ? existing
      : new Attendance({ employee: req.user._id, date: todayStr() });

    record.clockIn = new Date();
    record.status = "clocked-in";
    await record.save();

    return res.status(200).json({ success: true, attendance: record });
  } catch (err) {
    console.error("clockIn Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/attendance/clock-out
export const clockOut = async (req, res) => {
  try {
    const record = await Attendance.findOne({
      employee: req.user._id,
      date: todayStr(),
    });

    if (!record?.clockIn) {
      return res
        .status(400)
        .json({ success: false, message: "Not clocked in" });
    }

    if (record.clockOut) {
      return res
        .status(400)
        .json({ success: false, message: "Already clocked out" });
    }

    record.clockOut = new Date();
    record.status = "clocked-out";
    await record.save();

    return res.status(200).json({ success: true, attendance: record });
  } catch (err) {
    console.error("clockOut Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/attendance/lunch-start
export const lunchStart = async (req, res) => {
  try {
    const record = await Attendance.findOne({
      employee: req.user._id,
      date: todayStr(),
    });

    if (!record?.clockIn) {
      return res
        .status(400)
        .json({ success: false, message: "Not clocked in" });
    }

    if (record.lunchStart) {
      return res
        .status(400)
        .json({ success: false, message: "Lunch break already started" });
    }

    record.lunchStart = new Date();
    record.status = "on-break";
    await record.save();

    return res.status(200).json({ success: true, attendance: record });
  } catch (err) {
    console.error("lunchStart Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/attendance/lunch-end
export const lunchEnd = async (req, res) => {
  try {
    const record = await Attendance.findOne({
      employee: req.user._id,
      date: todayStr(),
    });

    if (!record?.lunchStart) {
      return res
        .status(400)
        .json({ success: false, message: "Lunch break not started" });
    }

    if (record.lunchEnd) {
      return res
        .status(400)
        .json({ success: false, message: "Lunch break already ended" });
    }

    record.lunchEnd = new Date();
    record.status = "clocked-in";
    await record.save();

    return res.status(200).json({ success: true, attendance: record });
  } catch (err) {
    console.error("lunchEnd Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/attendance/admin/summary  — admin view of all records
export const getAdminSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const records = await Attendance.find(query)
      .populate("employee", "name email hourlyRate")
      .sort({ date: -1, createdAt: -1 });

    const summary = records.map((r) => {
      let hoursWorked = 0;
      if (r.clockIn && r.clockOut) {
        let ms = r.clockOut.getTime() - r.clockIn.getTime();
        if (r.lunchStart && r.lunchEnd) {
          ms -= r.lunchEnd.getTime() - r.lunchStart.getTime();
        }
        hoursWorked = Math.max(0, ms / 3_600_000);
      }
      const rate = r.employee?.hourlyRate ?? 0;
      return {
        _id: r._id,
        employee: r.employee,
        date: r.date,
        clockIn: r.clockIn,
        clockOut: r.clockOut,
        lunchStart: r.lunchStart,
        lunchEnd: r.lunchEnd,
        status: r.status,
        hoursWorked: Math.round(hoursWorked * 100) / 100,
        payout: Math.round(hoursWorked * rate * 100) / 100,
      };
    });

    return res.status(200).json({ success: true, summary });
  } catch (err) {
    console.error("getAdminSummary Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
