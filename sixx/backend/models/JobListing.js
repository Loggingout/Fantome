import mongoose from "mongoose";

const jobListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    role: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 10000 },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Temporary"],
      required: true,
    },
    workplaceType: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      default: "Remote",
    },
    location: { type: String, default: "", trim: true, maxlength: 140 },
    schedule: { type: String, required: true, trim: true, maxlength: 200 },
    payRate: { type: String, default: "", trim: true, maxlength: 100 },
    roleLength: { type: String, required: true, trim: true, maxlength: 100 },
    requirements: { type: [String], default: [] },
    company: { type: String, default: "", trim: true, maxlength: 140 },
    department: { type: String, default: "", trim: true, maxlength: 140 },
    education: { type: String, default: "", trim: true, maxlength: 500 },
    roleDetails: { type: String, default: "", trim: true, maxlength: 10000 },
    skillsAndQualifications: { type: [String], default: [] },
    preferredQualifications: { type: [String], default: [] },
    keyCompetencies: { type: [String], default: [] },
    whatYouWillGain: { type: [String], default: [] },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true }
);

export const JobListing = mongoose.model("JobListing", jobListingSchema);
