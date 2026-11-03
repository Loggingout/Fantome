import mongoose from "mongoose";
import { JobListing } from "../models/JobListing.js";
import { JobApplication } from "../models/JobApplication.js";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"];
const WORKPLACE_TYPES = ["Remote", "Hybrid", "On-site"];
const APPLICATION_STATUSES = ["new", "reviewing", "interview", "accepted", "rejected"];

const text = (value) => String(value ?? "").trim();

const toJobRecord = (job) => ({
  id: job._id.toString(),
  title: job.title,
  role: job.role,
  description: job.description,
  employmentType: job.employmentType,
  workplaceType: job.workplaceType,
  location: job.location,
  schedule: job.schedule,
  payRate: job.payRate,
  roleLength: job.roleLength,
  requirements: job.requirements,
  company: job.company,
  department: job.department,
  education: job.education,
  roleDetails: job.roleDetails,
  skillsAndQualifications: job.skillsAndQualifications,
  preferredQualifications: job.preferredQualifications,
  keyCompetencies: job.keyCompetencies,
  whatYouWillGain: job.whatYouWillGain,
  status: job.status,
  createdAt: job.createdAt?.toISOString(),
  updatedAt: job.updatedAt?.toISOString(),
});

const toApplicationRecord = (application) => ({
  id: application._id.toString(),
  jobId: application.job.toString(),
  jobTitle: application.jobTitle,
  firstName: application.firstName,
  lastName: application.lastName,
  email: application.email,
  phone: application.phone,
  resumeUrl: application.resumeUrl,
  coverLetter: application.coverLetter,
  status: application.status,
  notes: application.notes,
  createdAt: application.createdAt?.toISOString(),
});

function parseJobBody(body = {}) {
  const toList = (value) =>
    Array.isArray(value) ? value.map(text).filter(Boolean) : [];

  const requirements = toList(body.requirements);
  const lists = {
    skillsAndQualifications: toList(body.skillsAndQualifications),
    preferredQualifications: toList(body.preferredQualifications),
    keyCompetencies: toList(body.keyCompetencies),
    whatYouWillGain: toList(body.whatYouWillGain),
  };

  const values = {
    title: text(body.title),
    role: text(body.role),
    description: text(body.description),
    employmentType: text(body.employmentType),
    workplaceType: text(body.workplaceType) || "Remote",
    location: text(body.location),
    schedule: text(body.schedule),
    payRate: text(body.payRate),
    roleLength: text(body.roleLength),
    requirements,
    ...lists,
    company: text(body.company),
    department: text(body.department),
    education: text(body.education),
    roleDetails: text(body.roleDetails),
    status: body.status === "closed" ? "closed" : "open",
  };

  const limits = [
    ["title", values.title, 140],
    ["role", values.role, 100],
    ["description", values.description, 10000],
    ["schedule", values.schedule, 200],
    ["pay rate", values.payRate, 100],
    ["length of role", values.roleLength, 100],
  ];

  for (const [label, value, max] of limits) {
    const optional = label === "pay rate" && values.employmentType === "Internship";
    if (!value && !optional) return { error: `The ${label} is required.` };
    if (value.length > max) return { error: `The ${label} must be ${max} characters or fewer.` };
  }

  if (!EMPLOYMENT_TYPES.includes(values.employmentType)) {
    return { error: "Choose a valid employment type." };
  }
  if (!WORKPLACE_TYPES.includes(values.workplaceType)) {
    return { error: "Choose a valid workplace type." };
  }
  if (values.location.length > 140) {
    return { error: "The location must be 140 characters or fewer." };
  }
  if (requirements.length > 30 || requirements.some((item) => item.length > 300)) {
    return { error: "Use at most 30 requirements of 300 characters or fewer." };
  }

  const optionalText = [
    ["company", values.company, 140],
    ["department", values.department, 140],
    ["education", values.education, 500],
    ["role details", values.roleDetails, 10000],
  ];
  for (const [label, value, max] of optionalText) {
    if (value.length > max) return { error: `The ${label} must be ${max} characters or fewer.` };
  }

  for (const [label, items] of Object.entries(lists)) {
    if (items.length > 30 || items.some((item) => item.length > 300)) {
      return { error: `Use at most 30 entries of 300 characters or fewer for ${label}.` };
    }
  }

  return { values };
}

const isValidId = (id) => mongoose.isValidObjectId(id);

export async function getOpenJobs(_req, res) {
  try {
    const jobs = await JobListing.find({ status: "open" }).sort({ createdAt: -1 });
    return res.status(200).json(jobs.map(toJobRecord));
  } catch (error) {
    console.error("getOpenJobs error:", error);
    return res.status(500).json({ message: "Unable to retrieve job listings." });
  }
}

export async function submitApplication(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ success: false, message: "This position is no longer available." });
  }

  const values = {
    firstName: text(req.body?.firstName),
    lastName: text(req.body?.lastName),
    email: text(req.body?.email).toLowerCase(),
    phone: text(req.body?.phone),
    resumeUrl: text(req.body?.resumeUrl),
    coverLetter: text(req.body?.coverLetter),
  };

  if (
    !values.firstName || values.firstName.length > 80 ||
    !values.lastName || values.lastName.length > 80 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254 ||
    values.phone.length > 40 ||
    (values.resumeUrl && !/^https?:\/\/\S+$/i.test(values.resumeUrl)) || values.resumeUrl.length > 500 ||
    !values.coverLetter || values.coverLetter.length > 10000
  ) {
    return res.status(400).json({ success: false, message: "Complete all required fields with valid values." });
  }

  try {
    const job = await JobListing.findOne({ _id: req.params.id, status: "open" });
    if (!job) {
      return res.status(404).json({ success: false, message: "This position is no longer available." });
    }

    const duplicate = await JobApplication.exists({ job: job._id, email: values.email });
    if (duplicate) {
      return res.status(409).json({ success: false, message: "You have already applied for this position." });
    }

    await JobApplication.create({ ...values, job: job._id, jobTitle: job.title });
    return res.status(201).json({ success: true, message: "Your application has been received. Thank you for applying." });
  } catch (error) {
    console.error("submitApplication error:", error);
    return res.status(500).json({ success: false, message: "Unable to submit your application right now." });
  }
}

export async function getAdminJobs(_req, res) {
  try {
    const jobs = await JobListing.find().sort({ createdAt: -1 });
    return res.status(200).json(jobs.map(toJobRecord));
  } catch (error) {
    console.error("getAdminJobs error:", error);
    return res.status(500).json({ message: "Unable to retrieve job listings." });
  }
}

export async function createJob(req, res) {
  const { values, error: validationError } = parseJobBody(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const job = await JobListing.create({
      ...values,
      createdBy: req.user.email || req.user._id.toString(),
    });
    return res.status(201).json(toJobRecord(job));
  } catch (error) {
    console.error("createJob error:", error);
    return res.status(500).json({ message: "Unable to create job listing." });
  }
}

export async function updateJob(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ message: "Job listing not found." });
  }

  const { values, error: validationError } = parseJobBody(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const job = await JobListing.findByIdAndUpdate(req.params.id, { $set: values }, { new: true });
    if (!job) return res.status(404).json({ message: "Job listing not found." });
    return res.status(200).json(toJobRecord(job));
  } catch (error) {
    console.error("updateJob error:", error);
    return res.status(500).json({ message: "Unable to update job listing." });
  }
}

export async function deleteJob(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ message: "Job listing not found." });
  }

  try {
    const job = await JobListing.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job listing not found." });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("deleteJob error:", error);
    return res.status(500).json({ message: "Unable to delete job listing." });
  }
}

export async function getApplications(_req, res) {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    return res.status(200).json(applications.map(toApplicationRecord));
  } catch (error) {
    console.error("getApplications error:", error);
    return res.status(500).json({ message: "Unable to retrieve applicants." });
  }
}

export async function updateApplication(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ message: "Application not found." });
  }

  const update = {};
  if (req.body?.status !== undefined) {
    if (!APPLICATION_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ message: "A valid application status is required." });
    }
    update.status = req.body.status;
  }
  if (req.body?.notes !== undefined) {
    const notes = String(req.body.notes);
    if (notes.length > 5000) {
      return res.status(400).json({ message: "Notes are too long." });
    }
    update.notes = notes;
  }

  try {
    const application = await JobApplication.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!application) return res.status(404).json({ message: "Application not found." });
    return res.status(200).json(toApplicationRecord(application));
  } catch (error) {
    console.error("updateApplication error:", error);
    return res.status(500).json({ message: "Unable to update application." });
  }
}

export async function deleteApplication(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ message: "Application not found." });
  }

  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found." });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("deleteApplication error:", error);
    return res.status(500).json({ message: "Unable to delete application." });
  }
}
