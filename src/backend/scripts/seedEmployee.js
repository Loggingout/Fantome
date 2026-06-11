/**
 * Seed Script: Creates a test employee in MongoDB
 * Usage: node scripts/seedEmployee.js
 */

import "../config/env.js";
import { connectDB } from "../config/db.js";
import { Employee } from "../models/Employee.js";

const seedEmployee = async () => {
  try {
    await connectDB();
    console.log("✓ Connected to MongoDB");

    // Clear existing test employee
    await Employee.deleteOne({
      email: "test@fantome.com",
    });
    console.log(
      "✓ Cleared existing test employee"
    );

    // Create test employee
    const testEmployee = new Employee({
      name: "Test Admin",
      email: "test@fantome.com",
      password: "password123",
      role: "admin",
      isActive: true,
    });

    const savedEmployee =
      await testEmployee.save();
    console.log("✓ Test employee created:");
    console.log({
      id: savedEmployee._id,
      name: savedEmployee.name,
      email: savedEmployee.email,
      role: savedEmployee.role,
    });

    console.log("\n📝 Login credentials:");
    console.log("Email: test@fantome.com");
    console.log("Password: password123");

    process.exit(0);
  } catch (error) {
    console.error(
      "✗ Error seeding employee:",
      error.message
    );
    process.exit(1);
  }
};

seedEmployee();
