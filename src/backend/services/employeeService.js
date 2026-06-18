import { Employee } from "../models/Employee.js";

export const createEmployeeService = async ({
  name,
  email,
  role,
  password,
}) => {
  // Check if employee already exists
  const existingEmployee = await Employee.findOne({
    email,
  });

  if (existingEmployee) {
    throw new Error("Employee with this email already exists");
  }

  // Create new employee with provided password
  const employee = await Employee.create({
    name,
    email,
    role,
    password, // hashed automatically by schema
  });

  return {
    employee,
  };
};
