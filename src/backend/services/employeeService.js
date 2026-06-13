import { Employee } from "../models/Employee.js";

export const createEmployeeService = async ({ name, email, role }) => {
  // Auto-generate a password
  const tempPassword = Math.random().toString(36).slice(-8);

  const employee = await Employee.create({
    name,
    email,
    role,
    password: tempPassword, // hashed automatically by schema
  });

  return {
    employee,
    tempPassword,
  };
};
