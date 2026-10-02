import "./config/env.js";

import express from "express";

import authRoutes from "./routes/authRoute.js";
import adminEmployeeRoutes from "./routes/adminEmployeeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import shiftRoutes from "./routes/shiftRoutes.js";
import overtimeShiftRoutes from "./routes/overtimeShiftRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import leaveBalanceRoutes from "./routes/leaveBalanceRoutes.js";
import statusRoutes from "./routes/statusRoutes.js";
import adminStatusRoutes from "./routes/adminStatusRoutes.js";

import { startShiftReminderJob } from "./services/shiftReminderService.js";
import { startBlogPublisher } from "./services/blogPublisherService.js";
import { seedStatusPlatforms } from "./controllers/statusController.js";
import { initializeBlogNewsletter } from "./controllers/newsletterController.js";

import { connectDB } from "./config/db.js";

import {
  corsMiddleware,
  allowedOrigins,
} from "./config/cors.js";

import { requestLogger } from "./middleware/logger.js";

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: "2mb" }));
app.use(requestLogger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/employees", adminEmployeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/overtime-shifts", overtimeShiftRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/leave-balance", leaveBalanceRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/admin/status", adminStatusRoutes);

// Health Route
app.get("/", (req, res) => {
  res.json({
    message: "Fantome Technologies API Server",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      adminEmployees: "/api/admin/employees", // optional
      status: "/api/status",
    },
  });
});

const PORT = process.env.PORT || 5000;

// Start server only after DB is confirmed connected, then seed
async function startServer() {
  await connectDB();

  await seedStatusPlatforms();
  await initializeBlogNewsletter();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Listening on 0.0.0.0:${PORT}`);
    console.log("✓ CORS enabled for origins:", allowedOrigins);
    startShiftReminderJob();
    startBlogPublisher();
  });
}

startServer();
