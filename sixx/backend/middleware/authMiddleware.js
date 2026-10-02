import jwt from "jsonwebtoken";
import { Employee } from "../models/Employee.js";
import JWT_SECRET from "../config/jwt.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await Employee.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Block terminated employees even if their token is still valid
      if (!req.user.isActive) {
        return res.status(401).json({ message: "Your account has been deactivated. Please contact your administrator." });
      }

      next();
    } catch (err) {
      console.error("Auth Error:", err);
      return res.status(401).json({ message: "Not authorized" });
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
