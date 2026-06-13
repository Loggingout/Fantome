import { createEmployeeSchema } from "../validations/employeeValidation.js";
import { createEmployeeService } from "../services/employeeService.js";

export const createEmployee = async (req, res) => {
  try {
    const { error, value } = createEmployeeSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { employee, tempPassword } = await createEmployeeService(value);

    return res.status(201).json({
      message: "Employee created successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
      tempPassword,
    });
  } catch (err) {
    console.error("Create Employee Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
