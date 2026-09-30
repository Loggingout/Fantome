// backend/scripts/createEmployee.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import { Employee } from "../models/Employee.js"; // matches your export

dotenv.config();

// If you have a DB connection helper, use it:
import connectDB from "../config/db.js";

async function createEmployee() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const password = "password123"; // temporary login password

    const employee = await Employee.create({
      name: "Test Employee",
      email: "employee@test.com",
      password, // your schema will hash this automatically
      role: "employee",
      isActive: true,
    });

    console.log("\n=== EMPLOYEE CREATED SUCCESSFULLY ===");
    console.log("Name:", employee.name);
    console.log("Email:", employee.email);
    console.log("Password:", password);
    console.log("=====================================\n");

    process.exit(0);
  } catch (err) {
    console.error("Error creating employee:", err);
    process.exit(1);
  }
}

createEmployee();
