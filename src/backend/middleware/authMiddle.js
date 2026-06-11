import { authServices } from "../services/authService.js";

export const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
      });
    }

    // Extract token (format: "Bearer token")
    const token = authHeader.startsWith(
      "Bearer "
    )
      ? authHeader.slice(7)
      : authHeader;

    // Verify token
    const decoded =
      authServices.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Attach employee info to request
    req.employee = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    });
  }
};

// Optional: Role-based middleware
export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.employee) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!roles.includes(req.employee.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};
