export type JobEmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Temporary";

export type JobWorkplaceType = "Remote" | "Hybrid" | "On-site";

export interface JobListingRecord {
  id: string;
  title: string;
  role: string;
  description: string;
  employmentType: JobEmploymentType;
  workplaceType: JobWorkplaceType;
  location: string;
  schedule: string;
  payRate: string;
  roleLength: string;
  requirements: string[];
  company: string;
  department: string;
  education: string;
  roleDetails: string;
  skillsAndQualifications: string[];
  preferredQualifications: string[];
  keyCompetencies: string[];
  whatYouWillGain: string[];
  status: "open" | "closed";
  createdAt?: string;
  updatedAt?: string;
}

export type JobListingPayload = Omit<
  JobListingRecord,
  "id" | "createdAt" | "updatedAt"
>;

export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "interview"
  | "accepted"
  | "rejected";

export interface JobApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter: string;
  status: ApplicationStatus;
  notes: string;
  createdAt?: string;
}

export interface JobApplicationPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  coverLetter: string;
}
