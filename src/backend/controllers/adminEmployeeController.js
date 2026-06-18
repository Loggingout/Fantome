import { createEmployeeSchema } from "../validations/employeeValidation.js";
import { createEmployeeService } from "../services/employeeService.js";

export const createEmployee = async (req, res) => {
  try {
    const { error, value } = createEmployeeSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await createEmployeeService(value);

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: {
        id: result.employee._id,
        name: result.employee.name,
        email: result.employee.email,
        role: result.employee.role,
      },
    });
  } catch (err) {
    console.error("Create Employee Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};
