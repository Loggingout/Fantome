import { validateLogin } from "../validations/authValidation.js";
import { authServices } from "../services/authService.js";

export const authController = {
  // Login endpoint
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      const validation = validateLogin(
        email,
        password
      );

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        });
      }

      // Call login service
      const result =
        await authServices.loginEmployee(
          email,
          password
        );

      if (!result.success) {
        return res.status(401).json({
          success: false,
          message: result.message,
        });
      }

      // Set token in HTTP-only cookie (optional)
      // res.cookie('authToken', result.token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production',
      //   sameSite: 'strict',
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: result.token,
        employee: result.employee,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  // Get current employee profile
  getCurrentEmployee: async (req, res) => {
    try {
      const employeeId = req.employee.id;

      const result =
        await authServices.getEmployeeById(
          employeeId
        );

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        employee: result.employee,
      });
    } catch (error) {
      console.error(
        "Get current employee error:",
        error
      );
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  // Logout (frontend handles token removal)
  logout: (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  },
};
