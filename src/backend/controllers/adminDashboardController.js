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
    const [recentEmployees, recentTasks, activityLogs] = await Promise.all([
      Employee.find({ isActive: true }).sort({ createdAt: -1 }).limit(3).select("name role createdAt"),
      Task.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("assignedTo", "name")
        .select("title assignedTo createdAt"),
      Activity.find().sort({ createdAt: -1 }).limit(15),
    ]);

    const activity = [
      ...recentEmployees.map((e) => ({
        id: `hire-${e._id}`,
        type: "hire",
        message: `${e.name} joined as ${e.role}`,
        timestamp: e.createdAt,
      })),
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
