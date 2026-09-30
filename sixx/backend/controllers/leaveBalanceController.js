import { LeaveBalance } from "../models/LeaveBalance.js";
import { Employee } from "../models/Employee.js";

const MS_90_DAYS = 90 * 24 * 60 * 60 * 1000;
const ACCRUAL_HOURS = 10;

// Internal: get-or-create a balance record, then apply any pending accruals
export async function ensureBalance(employeeId) {
  let balance = await LeaveBalance.findOne({ employee: employeeId });
  if (!balance) {
    balance = await LeaveBalance.create({ employee: employeeId });
  }
  return applyAccrual(balance);
}

// Internal: apply all elapsed 90-day accrual periods and save
async function applyAccrual(balance) {
  const now = Date.now();
  const periodsElapsed = Math.floor(
    (now - new Date(balance.lastAccrualDate).getTime()) / MS_90_DAYS
  );
  if (periodsElapsed > 0) {
    balance.ptoHours += periodsElapsed * ACCRUAL_HOURS;
    balance.uptoHours += periodsElapsed * ACCRUAL_HOURS;
    balance.lastAccrualDate = new Date(
      new Date(balance.lastAccrualDate).getTime() + periodsElapsed * MS_90_DAYS
    );
    await balance.save();
  }
  return balance;
}

// GET /api/leave-balance/mine  — employee views their own balance
export const getMyBalance = async (req, res) => {
  try {
    const balance = await ensureBalance(req.user._id);
    const nextAccrualDate = new Date(
      new Date(balance.lastAccrualDate).getTime() + MS_90_DAYS
    );
    return res.status(200).json({
      success: true,
      balance: {
        ptoHours: balance.ptoHours,
        uptoHours: balance.uptoHours,
        ptoUsed: balance.ptoUsed,
        uptoUsed: balance.uptoUsed,
        lastAccrualDate: balance.lastAccrualDate,
        nextAccrualDate,
      },
    });
  } catch (err) {
    console.error("getMyBalance Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/leave-balance/all  — admin views all employee balances
export const getAllBalances = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true }).select(
      "name email jobTitle"
    );

    const balances = await Promise.all(
      employees.map(async (emp) => {
        const balance = await ensureBalance(emp._id);
        const nextAccrualDate = new Date(
          new Date(balance.lastAccrualDate).getTime() + MS_90_DAYS
        );
        return {
          employee: { _id: emp._id, name: emp.name, email: emp.email, jobTitle: emp.jobTitle },
          ptoHours: balance.ptoHours,
          uptoHours: balance.uptoHours,
          ptoUsed: balance.ptoUsed,
          uptoUsed: balance.uptoUsed,
          lastAccrualDate: balance.lastAccrualDate,
          nextAccrualDate,
        };
      })
    );

    return res.status(200).json({ success: true, balances });
  } catch (err) {
    console.error("getAllBalances Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/leave-balance/:employeeId/adjust  — admin manually adjusts hours
export const adjustBalance = async (req, res) => {
  try {
    const { ptoHours, uptoHours } = req.body;
    const balance = await ensureBalance(req.params.employeeId);

    if (typeof ptoHours === "number") balance.ptoHours = Math.max(0, ptoHours);
    if (typeof uptoHours === "number") balance.uptoHours = Math.max(0, uptoHours);

    await balance.save();

    return res.status(200).json({ success: true, balance });
  } catch (err) {
    console.error("adjustBalance Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
