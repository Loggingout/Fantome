import jwt from "jsonwebtoken";
import { Employee } from "../models/Employee.js";
import JWT_SECRET from "../config/jwt.js";
import { authServices } from "../services/authService.js";

const REFRESH_AFTER_SECONDS = 24 * 60 * 60;

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    let decoded;
    try {
      token = req.headers.authorization.split(" ")[1];
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Not authorized" });
    }

    try {
      req.user = await Employee.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Block terminated employees even if their token is still valid
      if (!req.user.isActive) {
        return res.status(401).json({ message: "Your account has been deactivated. Please contact your administrator." });
      }

      // Sliding session: active users get a fresh token so they stay signed in.
      if (Date.now() / 1000 - decoded.iat > REFRESH_AFTER_SECONDS) {
        res.setHeader("X-Refreshed-Token", authServices.generateToken(decoded.id));
      }

      next();
    } catch (err) {
      console.error("Auth Error:", err);
      return res.status(500).json({ message: "Unable to verify your session right now." });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Admin access only" });
};
