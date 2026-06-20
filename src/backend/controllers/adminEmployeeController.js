import { createEmployeeSchema } from "../validations/employeeValidation.js";
import { createEmployeeService } from "../services/employeeService.js";
import { Employee } from "../models/Employee.js";
import { Notification } from "../models/Notification.js";
import { Activity } from "../models/Activity.js";

// GET /api/admin/employees/payout-schedule  — bi-weekly payout dates per employee
export const getPayoutSchedule = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true })
      .select("name email jobTitle hourlyRate createdAt")
      .sort({ createdAt: -1 });

    const now = Date.now();
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const CYCLE_DAYS = 14;

    const schedule = employees.map((emp) => {
      const hireDate = new Date(emp.createdAt).getTime();
      const daysSinceHire = Math.floor((now - hireDate) / MS_PER_DAY);
      const cyclesCompleted = Math.floor(daysSinceHire / CYCLE_DAYS);
      const nextPayoutMs = hireDate + (cyclesCompleted + 1) * CYCLE_DAYS * MS_PER_DAY;
      const daysUntilPayout = Math.ceil((nextPayoutMs - now) / MS_PER_DAY);

      return {
        _id: emp._id,
        name: emp.name,
        email: emp.email,
        jobTitle: emp.jobTitle || null,
        hourlyRate: emp.hourlyRate,
        hireDate: emp.createdAt,
        nextPayoutDate: new Date(nextPayoutMs),
        daysUntilPayout,
        cycleNumber: cyclesCompleted + 1,
      };
    });

    // Sort by soonest payout first
    schedule.sort((a, b) => a.daysUntilPayout - b.daysUntilPayout);

    return res.status(200).json({ success: true, schedule });
  } catch (err) {
    console.error("getPayoutSchedule Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/admin/employees  — list all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true }).select(
      "name email role jobTitle"
    );
    return res.status(200).json({ success: true, employees });
  } catch (err) {
    console.error("getAllEmployees Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

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

    const jobTitleLabel = result.employee.jobTitle || null;
    await Activity.create({
      type: "hire",
      message: jobTitleLabel
        ? `${result.employee.name} has been hired as ${jobTitleLabel}.`
        : `${result.employee.name} has been hired.`,
    });

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

// PATCH /api/admin/employees/:id/role  — update employee role and notify
export const updateEmployeeRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "employee"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role. Must be admin or employee." });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("name email role");

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    await Notification.create({
      employee: employee._id,
      type: "role-change",
      message: `Your role has been updated to ${role} by an administrator.`,
    });

    await Activity.create({
      type: "role-change",
      message: `${employee.name}'s access was updated to ${role}.`,
    });

    return res.status(200).json({ success: true, employee });
  } catch (err) {
    console.error("updateEmployeeRole Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const JOB_TITLES = [
  "Ceo",
  "Software Developer/Engineer",
  "Marketing",
  "Systems Admin",
  "Sales",
  "HR",
  "Customer Service",
  "Information Technology",
  "Legal & Compliance",
  "Operations",
  "Finance & Accounting",
  "Intern",
];

// DELETE /api/admin/employees/:id  — deactivate (soft-delete) employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select("name email role");

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    await Activity.create({
      type: "employee-deleted",
      message: `${employee.name} (${employee.email}) was removed from the system.`,
    });

    return res.status(200).json({ success: true, message: "Employee removed" });
  } catch (err) {
    console.error("deleteEmployee Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/admin/employees/:id/job-title  — update employee job title
export const updateJobTitle = async (req, res) => {
  try {
    const { jobTitle } = req.body;

    if (!JOB_TITLES.includes(jobTitle)) {
      return res.status(400).json({ success: false, message: "Invalid job title." });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { jobTitle },
      { new: true }
    ).select("name email role jobTitle");

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    await Activity.create({
      type: "job-title-update",
      message: `${employee.name}'s job title was updated to ${jobTitle}.`,
    });

    return res.status(200).json({ success: true, employee });
  } catch (err) {
    console.error("updateJobTitle Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/admin/employees/:id/rate  — update employee hourly rate
export const updateHourlyRate = async (req, res) => {
  try {
    const { hourlyRate } = req.body;

    if (typeof hourlyRate !== "number" || hourlyRate < 0) {
      return res.status(400).json({ success: false, message: "Invalid hourly rate" });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { hourlyRate },
      { new: true }
    ).select("name email role jobTitle hourlyRate");

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    return res.status(200).json({ success: true, employee });
  } catch (err) {
    console.error("updateHourlyRate Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
