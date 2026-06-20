import cron from "node-cron";
import { ScheduledNotification } from "../models/ScheduledNotification.js";
import { Notification } from "../models/Notification.js";

export function startShiftReminderJob() {
  // Run every minute — find all undelivered reminders that are now due
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const due = await ScheduledNotification.find({
        delivered: false,
        scheduledFor: { $lte: now },
      });

      if (due.length === 0) return;

      // Deliver each as a real Notification, then mark as sent
      const notificationDocs = due.map((sn) => ({
        employee: sn.employee,
        type: "general",
        message: sn.message,
      }));

      await Notification.insertMany(notificationDocs);

      await ScheduledNotification.updateMany(
        { _id: { $in: due.map((sn) => sn._id) } },
        { $set: { delivered: true } }
      );

      console.log(`✓ Shift reminders delivered: ${due.length}`);
    } catch (err) {
      console.error("shiftReminderJob Error:", err.message);
    }
  });

  console.log("✓ Shift reminder cron job started");
}
