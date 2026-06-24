import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    jobTitle: {
      type: String,
      enum: [
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
      ],
      default: null,
    },
    hireDate: {
      type: Date,
      default: null,
    },
    // IANA timezone identifier (e.g. "America/Denver" for MDT).
    // Used for date-grouping in admin payroll reports and shift reminders.
    // Defaults to "America/Denver" (MDT) since all current employees are in that zone.
    timezone: {
      type: String,
      default: "America/Denver",
    },
  },
  { timestamps: true }
);

// Hash password before saving - only if modified
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(
      this.password,
      salt
    );
  } catch (err) {
    throw err;
  }
});

// Method to compare passwords
employeeSchema.methods.matchPassword = async function (
  enteredPassword
) {
  return await bcrypt.compare(
    enteredPassword,
    this.password
  );
};

export const Employee = mongoose.model(
  "Employee",
  employeeSchema
);
