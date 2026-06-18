import { Notification } from "../models/Notification.js";

// GET /api/notifications/mine
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ employee: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      employee: req.user._id,
      isRead: false,
    });

    return res.status(200).json({ success: true, notifications, unreadCount });
  } catch (err) {
    console.error("getMyNotifications Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/notifications/read-all
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { employee: req.user._id, isRead: false },
      { isRead: true }
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("markAllRead Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
