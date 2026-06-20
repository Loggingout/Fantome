import { Employee } from "../models/Employee.js";
import { Task } from "../models/Task.js";
import { Shift } from "../models/Shift.js";
import { Attendance } from "../models/Attendance.js";
import { Activity } from "../models/Activity.js";

// GET /api/admin/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalEmployees, newHires, pendingTasks, completedTasks] =
      await Promise.all([
        Employee.countDocuments({ isActive: true }),
        Employee.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        Task.countDocuments({ status: "pending" }),
        Task.countDocuments({ status: "completed" }),
      ]);

    return res.status(200).json({
      success: true,
      stats: { totalEmployees, newHires, pendingTasks, completedTasks },
    });
  } catch (err) {
    console.error("getDashboardStats Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/admin/dashboard/activity
export const getActivity = async (req, res) => {
  try {
    const [recentTasks, activityLogs] = await Promise.all([
      Task.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("assignedTo", "name")
        .select("title assignedTo createdAt"),
      Activity.find().sort({ createdAt: -1 }).limit(15),
    ]);

    const activity = [
      ...recentTasks.map((t) => ({
        id: `task-${t._id}`,
        type: "update",
        message: `Task "${t.title}" assigned to ${t.assignedTo?.name || "employee"}`,
        timestamp: t.createdAt,
      })),
      ...activityLogs.map((a) => ({
        id: a._id.toString(),
        type: a.type,
        message: a.message,
        timestamp: a.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return res.status(200).json({ success: true, activity });
  } catch (err) {
    console.error("getActivity Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/admin/analytics
export const getAnalytics = async (req, res) => {
  try {
    const months = [];
    const labels = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(d.toLocaleString("default", { month: "short" }));
      months.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        prefix: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      });
    }

    // For each month, count completed vs total tasks → performance %
    const data = await Promise.all(
      months.map(async ({ prefix }) => {
        const [total, completed] = await Promise.all([
          Task.countDocuments({ createdAt: { $regex: `^${prefix}` } }),
          Task.countDocuments({
            status: "completed",
            createdAt: { $regex: `^${prefix}` },
          }),
        ]);
        if (total === 0) return null;
        return Math.round((completed / total) * 100);
      })
    );

    // Fill nulls with forward/backward neighbour or 0
    const filled = data.map((v, i) => {
      if (v !== null) return v;
      const prev = data.slice(0, i).reverse().find((x) => x !== null);
      const next = data.slice(i + 1).find((x) => x !== null);
      return prev ?? next ?? 0;
    });

    const current = filled[filled.length - 1];
    const previous = filled[filled.length - 2];
    const change = current - previous;

    return res.status(200).json({
      success: true,
      labels,
      data: filled,
      current,
      change,
    });
  } catch (err) {
    console.error("getAnalytics Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/admin/dashboard/task-analytics?period=daily|weekly|monthly|yearly
export const getTaskAnalytics = async (req, res) => {
  try {
    const period = req.query.period || "monthly";
    const now = new Date();
    const labels = [];
    const ranges = [];

    if (period === "daily") {
      for (let i = 13; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(start.getDate() - i);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        labels.push(start.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
        ranges.push({ start, end });
      }
    } else if (period === "weekly") {
      const dayOfWeek = now.getDay();
      for (let i = 7; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(start.getDate() - dayOfWeek - i * 7);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        labels.push(start.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
        ranges.push({ start, end });
      }
    } else if (period === "monthly") {
      for (let i = 11; i >= 0; i--) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
        labels.push(start.toLocaleString("default", { month: "short", year: "2-digit" }));
        ranges.push({ start, end });
      }
    } else if (period === "yearly") {
      for (let i = 3; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const start = new Date(year, 0, 1, 0, 0, 0, 0);
        const end = new Date(year, 11, 31, 23, 59, 59, 999);
        labels.push(String(year));
        ranges.push({ start, end });
      }
    }

    const data = await Promise.all(
      ranges.map(async ({ start, end }) => {
        const [total, completed] = await Promise.all([
          Task.countDocuments({ createdAt: { $gte: start, $lte: end } }),
          Task.countDocuments({ status: "completed", createdAt: { $gte: start, $lte: end } }),
        ]);
        return { rate: total === 0 ? null : Math.round((completed / total) * 100), total, completed };
      })
    );

    const rates = data.map((v) => v.rate);
    const filled = rates.map((v, i) => {
      if (v !== null) return v;
      const prev = rates.slice(0, i).reverse().find((x) => x !== null);
      const next = rates.slice(i + 1).find((x) => x !== null);
      return prev ?? next ?? 0;
    });

    const rows = labels.map((label, i) => ({
      label,
      rate: filled[i],
      total: data[i].total,
      completed: data[i].completed,
    }));

    const current = filled[filled.length - 1];
    const previous = filled[filled.length - 2] ?? 0;

    return res.status(200).json({
      success: true,
      period,
      rows,
      current,
      previous,
      change: current - previous,
    });
  } catch (err) {
    console.error("getTaskAnalytics Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

