import { Attendance } from "../models/Attendance.js";
import { Employee } from "../models/Employee.js";
import { Notification } from "../models/Notification.js";

// Helper: get today's date string "YYYY-MM-DD"
const todayStr = () => new Date().toISOString().split("T")[0];

// Helper: find any open (not-yet-clocked-out) session for an employee
// Used by clock-out, lunch-start, lunch-end to handle cross-day sessions
async function findOpenSession(employeeId) {
  return Attendance.findOne({
    employee: employeeId,
    clockIn: { $exists: true, $ne: null },
    clockOut: null,
  }).sort({ clockIn: -1 });
}

// GET /api/attendance/today
export const getToday = async (req, res) => {
  try {
    // Check today's record first
    let record = await Attendance.findOne({
      employee: req.user._id,
      date: todayStr(),
    });

    // If no today record, check for an open (not clocked-out) session from a prior day
    if (!record) {
      record = await Attendance.findOne({
        employee: req.user._id,
        clockIn: { $exists: true, $ne: null },
        clockOut: null,
      }).sort({ clockIn: -1 });
    }

    return res.status(200).json({ success: true, attendance: record || null });
  } catch (err) {
    console.error("getToday Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/attendance/clock-in
export const clockIn = async (req, res) => {
  try {
    // Block if any open session exists (today or cross-day)
    const openSession = await findOpenSession(req.user._id);
    if (openSession) {
      return res
        .status(400)
        .json({ success: false, message: "Already clocked in" });
    }

    const record = new Attendance({
      employee: req.user._id,
      date: todayStr(),
      clockIn: new Date(),
      status: "clocked-in",
    });
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
    const record = await findOpenSession(req.user._id);

    if (!record) {
      return res
        .status(400)
        .json({ success: false, message: "Not clocked in" });
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
    // Use open-session fallback so cross-day shifts work correctly
    const record = await findOpenSession(req.user._id);

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
    // Use open-session fallback so cross-day shifts work correctly
    const record = await findOpenSession(req.user._id);

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

    const summary = records
      .filter((r) => r.employee != null)
      .map((r) => {
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

// GET /api/attendance/my-attendance  — employee's own records (last 30 days)
export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ employee: req.user._id })
      .sort({ date: -1 })
      .limit(30);

    const emp = await Employee.findById(req.user._id).select("hourlyRate");
    const rate = emp?.hourlyRate ?? 0;

    const summary = records.map((r) => {
      let hoursWorked = 0;
      if (r.clockIn && r.clockOut) {
        let ms = r.clockOut.getTime() - r.clockIn.getTime();
        if (r.lunchStart && r.lunchEnd)
          ms -= r.lunchEnd.getTime() - r.lunchStart.getTime();
        hoursWorked = Math.max(0, ms / 3_600_000);
      }
      return {
        _id: r._id,
        date: r.date,
        clockIn: r.clockIn,
        clockOut: r.clockOut,
        status: r.status,
        hoursWorked: Math.round(hoursWorked * 100) / 100,
        payout: Math.round(hoursWorked * rate * 100) / 100,
      };
    });

    return res.status(200).json({ success: true, records: summary, hourlyRate: rate });
  } catch (err) {
    console.error("getMyAttendance Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/attendance/my-payroll  — employee pay history grouped by month
export const getMyPayroll = async (req, res) => {
  try {
    const records = await Attendance.find({ employee: req.user._id }).sort({ date: -1 });
    const emp = await Employee.findById(req.user._id).select("hourlyRate");
    const rate = emp?.hourlyRate ?? 0;

    // Group by YYYY-MM
    const grouped = {};
    for (const r of records) {
      const key = r.date.substring(0, 7);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    }

    const payroll = Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, recs]) => {
        let totalHours = 0;
        for (const r of recs) {
          if (r.clockIn && r.clockOut) {
            let ms = r.clockOut.getTime() - r.clockIn.getTime();
            if (r.lunchStart && r.lunchEnd)
              ms -= r.lunchEnd.getTime() - r.lunchStart.getTime();
            totalHours += Math.max(0, ms / 3_600_000);
          }
        }
        totalHours = Math.round(totalHours * 100) / 100;
        const gross = Math.round(totalHours * rate * 100) / 100;
        const net = Math.round(gross * 0.85 * 100) / 100;
        const [y, m] = key.split("-");
        const label = new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        return { period: label, monthKey: key, daysWorked: recs.length, totalHours, gross, net, rate };
      });

    return res.status(200).json({ success: true, payroll, hourlyRate: rate });
  } catch (err) {
    console.error("getMyPayroll Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/attendance/admin/payroll  — all employees' payroll totals (admin)
export const getAdminPayrollSummary = async (req, res) => {
  try {
    const records = await Attendance.find({})
      .populate("employee", "name email hourlyRate")
      .sort({ date: -1 });

    const empMap = new Map();
    for (const r of records) {
      if (!r.employee) continue;
      const id = r.employee._id.toString();
      if (!empMap.has(id)) empMap.set(id, { employee: r.employee, records: [] });
      empMap.get(id).records.push(r);
    }

    const summary = Array.from(empMap.values()).map(({ employee, records: recs }) => {
      let totalHours = 0;
      const rate = employee.hourlyRate ?? 0;
      for (const r of recs) {
        if (r.clockIn && r.clockOut) {
          let ms = r.clockOut.getTime() - r.clockIn.getTime();
          if (r.lunchStart && r.lunchEnd) ms -= r.lunchEnd.getTime() - r.lunchStart.getTime();
          totalHours += Math.max(0, ms / 3_600_000);
        }
      }
      const gross = Math.round(totalHours * rate * 100) / 100;
      return {
        employee,
        daysWorked: recs.length,
        totalHours: Math.round(totalHours * 100) / 100,
        gross,
        net: Math.round(gross * 0.85 * 100) / 100,
        rate,
      };
    });

    return res.status(200).json({ success: true, summary });
  } catch (err) {
    console.error("getAdminPayrollSummary Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/attendance/admin/employee/:id/payroll  — one employee's detailed payroll (admin)
export const getEmployeePayrollDetail = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id).select("name email hourlyRate role");
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });

    const records = await Attendance.find({ employee: req.params.id }).sort({ date: -1 });
    const rate = emp.hourlyRate ?? 0;

    const grouped = {};
    for (const r of records) {
      const key = r.date.substring(0, 7);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    }

    const payroll = Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, recs]) => {
        let totalHours = 0;
        const details = recs.map((r) => {
          let h = 0;
          if (r.clockIn && r.clockOut) {
            let ms = r.clockOut.getTime() - r.clockIn.getTime();
            if (r.lunchStart && r.lunchEnd) ms -= r.lunchEnd.getTime() - r.lunchStart.getTime();
            h = Math.max(0, ms / 3_600_000);
          }
          totalHours += h;
          return { date: r.date, clockIn: r.clockIn, clockOut: r.clockOut, status: r.status, hours: Math.round(h * 100) / 100 };
        });
        const gross = Math.round(totalHours * rate * 100) / 100;
        const [y, m] = key.split("-");
        return {
          monthKey: key,
          label: new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleString("default", { month: "long", year: "numeric" }),
          totalHours: Math.round(totalHours * 100) / 100,
          gross,
          net: Math.round(gross * 0.85 * 100) / 100,
          daysWorked: recs.length,
          details,
        };
      });

    return res.status(200).json({ success: true, employee: emp, payroll, hourlyRate: rate });
  } catch (err) {
    console.error("getEmployeePayrollDetail Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/attendance/:id/correct  — admin corrects a record's clock times
export const correctAttendance = async (req, res) => {
  try {
    const { clockIn, clockOut, lunchStart, lunchEnd, reason } = req.body;

    const record = await Attendance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    // Combine record.date with an "HH:MM" string to get a UTC Date
    const makeUTC = (timeStr) => {
      if (timeStr === null || timeStr === undefined || timeStr === "") return null;
      return new Date(`${record.date}T${timeStr}:00.000Z`);
    };

    const updates = {};
    if (clockIn !== undefined)    updates.clockIn    = makeUTC(clockIn);
    if (clockOut !== undefined)   updates.clockOut   = makeUTC(clockOut);
    if (lunchStart !== undefined) updates.lunchStart = makeUTC(lunchStart);
    if (lunchEnd !== undefined)   updates.lunchEnd   = makeUTC(lunchEnd);

    // Derive status from corrected clockOut
    const effectiveClockOut = updates.clockOut !== undefined ? updates.clockOut : record.clockOut;
    if (effectiveClockOut) updates.status = "clocked-out";

    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).populate("employee", "name email hourlyRate");

    // Notify the employee
    const reasonText = reason?.trim() ? ` Reason: ${reason.trim()}.` : "";
    await Notification.create({
      employee: record.employee,
      type: "general",
      message: `An admin has corrected your attendance record for ${record.date}.${reasonText}`,
    });

    // Recalculate derived fields for the response
    let hoursWorked = 0;
    if (updated.clockIn && updated.clockOut) {
      let ms = updated.clockOut.getTime() - updated.clockIn.getTime();
      if (updated.lunchStart && updated.lunchEnd) {
        ms -= updated.lunchEnd.getTime() - updated.lunchStart.getTime();
      }
      hoursWorked = Math.max(0, ms / 3_600_000);
    }
    const rate = updated.employee?.hourlyRate ?? 0;

    return res.status(200).json({
      success: true,
      record: {
        _id: updated._id,
        employee: updated.employee,
        date: updated.date,
        clockIn: updated.clockIn,
        clockOut: updated.clockOut,
        lunchStart: updated.lunchStart,
        lunchEnd: updated.lunchEnd,
        status: updated.status,
        hoursWorked: Math.round(hoursWorked * 100) / 100,
        payout: Math.round(hoursWorked * rate * 100) / 100,
      },
    });
  } catch (err) {
    console.error("correctAttendance Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
