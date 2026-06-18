import "./config/env.js";

import express from "express";

import bookingRoutes from "./routes/bookingRoutes.js";
import requestQuoteRoutes from "./routes/requestQuote.js";
import authRoutes from "./routes/authRoute.js";
import adminEmployeeRoutes from "./routes/adminEmployeeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import shiftRoutes from "./routes/shiftRoutes.js";

import { connectDB } from "./config/db.js";

import {
  corsMiddleware,
  allowedOrigins,
} from "./config/cors.js";

import { requestLogger } from "./middleware/logger.js";

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/request-quote", requestQuoteRoutes);
app.use("/api/admin/employees", adminEmployeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/shifts", shiftRoutes);

// Health Route
app.get("/", (req, res) => {
  res.json({
    message: "Fantome Technologies API Server",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      bookings: "/api/bookings",
      requestQuote: "/api/request-quote",
      adminEmployees: "/api/admin/employees", // optional
    },
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Listening on 0.0.0.0:${PORT}`);
  console.log("✓ CORS enabled for origins:", allowedOrigins);
});
