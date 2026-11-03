import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "JobListing", required: true },
    jobTitle: { type: String, required: true },
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, default: "", trim: true, maxlength: 40 },
    resumeUrl: { type: String, default: "", trim: true, maxlength: 500 },
    coverLetter: { type: String, required: true, trim: true, maxlength: 10000 },
    status: {
      type: String,
      enum: ["new", "reviewing", "interview", "accepted", "rejected"],
      default: "new",
    },
    notes: { type: String, default: "", maxlength: 5000 },
  },
  { timestamps: true }
);

export const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);
