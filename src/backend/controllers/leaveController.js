import { LeaveRequest } from "../models/LeaveRequest.js";
import { Notification } from "../models/Notification.js";
import { Employee } from "../models/Employee.js";
import { Activity } from "../models/Activity.js";

// POST /api/leave  — employee submits a request
export const submitLeaveRequest = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    if (!type || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "type, startDate and endDate are required" });
    }

    const request = await LeaveRequest.create({
      employee: req.user._id,
      type,
      startDate,
      endDate,
      reason: reason || "",
    });

    // Notify all admins
    const admins = await Employee.find({ role: "admin" }).select("_id");
    const typeLabel = type === "sick" ? "Sick Leave" : "Time Off";
    await Notification.insertMany(
      admins.map((a) => ({
        employee: a._id,
        type: "general",
        message: `${req.user.name} submitted a ${typeLabel} request (${startDate} → ${endDate}).`,
      }))
    );

    // Confirmation notification for the employee
    await Notification.create({
      employee: req.user._id,
      type: "general",
      message: `Your ${typeLabel} request (${startDate} → ${endDate}) has been submitted and is pending review.`,
    });

    return res.status(201).json({ success: true, request });
  } catch (err) {
    console.error("submitLeaveRequest Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/leave/mine  — employee views own requests
export const getMyLeaveRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ employee: req.user._id })
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, requests });
  } catch (err) {
    console.error("getMyLeaveRequests Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/leave/all  — admin views all requests
export const getAllLeaveRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find()
      .populate("employee", "name email role")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, requests });
  } catch (err) {
    console.error("getAllLeaveRequests Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/leave/:id/status  — admin approves or denies
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!["approved", "denied"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const request = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status, adminNote: adminNote || "" },
      { new: true }
    ).populate("employee", "name email");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // Notify the employee of the decision
    const typeLabel = request.type === "sick" ? "Sick Leave" : "Time Off";
    await Notification.create({
      employee: request.employee._id,
      type: "general",
      message: `Your ${typeLabel} request (${request.startDate} → ${request.endDate}) was ${status}.${adminNote ? " Note: " + adminNote : ""}`,
    });

    await Activity.create({
      type: status === "approved" ? "leave-approved" : "leave-denied",
      message: `${request.employee.name}'s ${typeLabel} request was ${status}.`,
    });

    return res.status(200).json({ success: true, request });
  } catch (err) {
    console.error("updateLeaveStatus Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
