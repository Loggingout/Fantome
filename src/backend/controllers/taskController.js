import { Task } from "../models/Task.js";
import { Notification } from "../models/Notification.js";

// ── ADMIN ──────────────────────────────────────────

// POST /api/tasks  — admin creates and assigns a task
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    if (!title || !assignedTo) {
      return res
        .status(400)
        .json({ success: false, message: "Title and assignedTo are required" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      priority,
      dueDate: dueDate || null,
    });

    const populated = await task.populate([
      { path: "assignedTo", select: "name email role" },
      { path: "assignedBy", select: "name" },
    ]);

    // Notify the assigned employee
    await Notification.create({
      employee: assignedTo,
      type: "task-assigned",
      message: `You have been assigned a new task: "${title}"`,
    });

    return res.status(201).json({ success: true, task: populated });
  } catch (err) {
    console.error("createTask Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/tasks  — admin gets all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email role")
      .populate("assignedBy", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error("getAllTasks Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/tasks/:id  — admin deletes a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Task deleted" });
  } catch (err) {
    console.error("deleteTask Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── EMPLOYEE ───────────────────────────────────────

// GET /api/tasks/mine  — employee gets their own tasks
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("assignedBy", "name")
      .sort({ createdAt: -1 });

    // Mark unread tasks as read now that employee has fetched them
    await Task.updateMany(
      { assignedTo: req.user._id, isRead: false },
      { isRead: true }
    );

    return res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error("getMyTasks Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/tasks/unread-count  — unread task count for notification badge
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Task.countDocuments({
      assignedTo: req.user._id,
      isRead: false,
    });

    return res.status(200).json({ success: true, count });
  } catch (err) {
    console.error("getUnreadCount Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/tasks/:id/status  — employee updates their task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "in-progress", "completed"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user._id },
      { status },
      { new: true }
    );

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    return res.status(200).json({ success: true, task });
  } catch (err) {
    console.error("updateTaskStatus Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
