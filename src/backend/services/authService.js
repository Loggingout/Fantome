import jwt from "jsonwebtoken";
import { Employee } from "../models/Employee.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRE = "7d";

export const authServices = {
  // Generate JWT Token
  generateToken: (employeeId) => {
    return jwt.sign(
      { id: employeeId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );
  },

  // Verify JWT Token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  // Login service
  loginEmployee: async (email, password) => {
    try {
      // Find employee by email
      const employee = await Employee.findOne({
        email: email.toLowerCase(),
      });

      if (!employee) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Check if employee is active
      if (!employee.isActive) {
        return {
          success: false,
          message: "Your account has been deactivated",
        };
      }

      // Verify password
      const isPasswordValid =
        await employee.matchPassword(password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Generate token
      const token = authServices.generateToken(
        employee._id
      );

      return {
        success: true,
        token,
        employee: {
          id: employee._id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },

  // Get employee by ID
  getEmployeeById: async (employeeId) => {
    try {
      const employee = await Employee.findById(
        employeeId
      ).select("-password");

      if (!employee) {
        return {
          success: false,
          message: "Employee not found",
        };
      }

      return {
        success: true,
        employee,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  },
};
