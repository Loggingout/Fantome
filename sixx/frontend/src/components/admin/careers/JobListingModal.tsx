import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type {
  JobEmploymentType,
  JobListingPayload,
  JobListingRecord,
  JobWorkplaceType,
} from "../../../types/careers";

interface JobListingModalProps {
  isOpen: boolean;
  job: JobListingRecord | null;
  onClose: () => void;
  onSubmit: (payload: JobListingPayload) => void | Promise<void>;
  isSaving?: boolean;
}

const EMPLOYMENT_TYPES: JobEmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
];

const WORKPLACE_TYPES: JobWorkplaceType[] = ["Remote", "Hybrid", "On-site"];

const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-neutral-600 disabled:opacity-50";

const labelClass = "mb-2 block text-sm font-medium text-neutral-300";

const emptyForm = {
  title: "",
  role: "",
  description: "",
  employmentType: "Full-time" as JobEmploymentType,
  workplaceType: "Remote" as JobWorkplaceType,
  location: "",
  schedule: "",
  payRate: "",
  roleLength: "",
  requirements: "",
  company: "",
  department: "",
  education: "",
  roleDetails: "",
  skillsAndQualifications: "",
  preferredQualifications: "",
  keyCompetencies: "",
  whatYouWillGain: "",
  status: "open" as "open" | "closed",
};

const toLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const LIST_FIELDS = [
  ["requirements", "Job requirements"],
  ["skillsAndQualifications", "Skills and qualifications"],
  ["preferredQualifications", "Preferred qualifications"],
  ["keyCompetencies", "Key competencies"],
  ["whatYouWillGain", "What will be gained"],
] as const;

export default function JobListingModal({
  isOpen,
  job,
  onClose,
  onSubmit,
  isSaving = false,
}: JobListingModalProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) return;

    setForm(
      job
        ? {
            ...job,
            requirements: (job.requirements ?? []).join("\n"),
            skillsAndQualifications: (job.skillsAndQualifications ?? []).join("\n"),
            preferredQualifications: (job.preferredQualifications ?? []).join("\n"),
            keyCompetencies: (job.keyCompetencies ?? []).join("\n"),
            whatYouWillGain: (job.whatYouWillGain ?? []).join("\n"),
            company: job.company ?? "",
            department: job.department ?? "",
            education: job.education ?? "",
            roleDetails: job.roleDetails ?? "",
          }
        : emptyForm,
    );
  }, [isOpen, job]);

  if (!isOpen) return null;

  const set =
    (key: keyof typeof form) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      title: form.title.trim(),
      role: form.role.trim(),
      description: form.description.trim(),
      employmentType: form.employmentType,
      workplaceType: form.workplaceType,
      location: form.location.trim(),
      schedule: form.schedule.trim(),
      payRate: form.payRate.trim(),
      roleLength: form.roleLength.trim(),
      requirements: toLines(form.requirements),
      skillsAndQualifications: toLines(form.skillsAndQualifications),
      preferredQualifications: toLines(form.preferredQualifications),
      keyCompetencies: toLines(form.keyCompetencies),
      whatYouWillGain: toLines(form.whatYouWillGain),
      company: form.company.trim(),
      department: form.department.trim(),
      education: form.education.trim(),
      roleDetails: form.roleDetails.trim(),
      status: form.status,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-listing-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 px-6 py-5">
          <h2 id="job-listing-title" className="text-xl font-semibold text-white">
            {job ? "Edit Job Listing" : "New Job Listing"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-800 hover:text-white disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="job-title">Job title</label>
              <input id="job-title" required maxLength={140} value={form.title} onChange={set("title")} disabled={isSaving} className={inputClass} placeholder="Frontend Developer" />
            </div>

            <div>
              <label className={labelClass} htmlFor="job-role">Role / department</label>
              <input id="job-role" required maxLength={100} value={form.role} onChange={set("role")} disabled={isSaving} className={inputClass} placeholder="Engineering" />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="job-description">Description</label>
            <textarea id="job-description" required maxLength={10000} rows={5} value={form.description} onChange={set("description")} disabled={isSaving} className={`${inputClass} resize-none`} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="job-type">Employment type</label>
              <select id="job-type" value={form.employmentType} onChange={set("employmentType")} disabled={isSaving} className={inputClass}>
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="job-workplace">Workplace</label>
              <select id="job-workplace" value={form.workplaceType} onChange={set("workplaceType")} disabled={isSaving} className={inputClass}>
                {WORKPLACE_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="job-schedule">Schedule</label>
              <input id="job-schedule" required maxLength={200} value={form.schedule} onChange={set("schedule")} disabled={isSaving} className={inputClass} placeholder="Mon-Fri, 9am-5pm EST" />
            </div>

            <div>
              <label className={labelClass} htmlFor="job-location">Location</label>
              <input id="job-location" maxLength={140} value={form.location} onChange={set("location")} disabled={isSaving} className={inputClass} placeholder="Atlanta, GA" />
            </div>

            <div>
              <label className={labelClass} htmlFor="job-pay">
                Pay rate{form.employmentType === "Internship" ? " (optional)" : ""}
              </label>
              <input id="job-pay" required={form.employmentType !== "Internship"} maxLength={100} value={form.payRate} onChange={set("payRate")} disabled={isSaving} className={inputClass} placeholder={form.employmentType === "Internship" ? "Unpaid" : "$25/hr"} />
            </div>

            <div>
              <label className={labelClass} htmlFor="job-length">Length of role</label>
              <input id="job-length" required maxLength={100} value={form.roleLength} onChange={set("roleLength")} disabled={isSaving} className={inputClass} placeholder="6 months, Permanent" />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="job-details">Role details</label>
            <textarea id="job-details" maxLength={10000} rows={4} value={form.roleDetails} onChange={set("roleDetails")} disabled={isSaving} className={`${inputClass} resize-none`} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="job-company">Company</label>
              <input id="job-company" maxLength={140} value={form.company} onChange={set("company")} disabled={isSaving} className={inputClass} placeholder="Fantome Technologies" />
            </div>

            <div>
              <label className={labelClass} htmlFor="job-department">Department</label>
              <input id="job-department" maxLength={140} value={form.department} onChange={set("department")} disabled={isSaving} className={inputClass} placeholder="Product Engineering" />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="job-education">Education</label>
            <input id="job-education" maxLength={500} value={form.education} onChange={set("education")} disabled={isSaving} className={inputClass} placeholder="Bachelor's degree in Computer Science or equivalent experience" />
          </div>

          {LIST_FIELDS.map(([key, label]) => (
            <div key={key}>
              <label className={labelClass} htmlFor={`job-${key}`}>{label} (one per line)</label>
              <textarea id={`job-${key}`} rows={4} value={form[key]} onChange={set(key)} disabled={isSaving} className={`${inputClass} resize-none`} />
            </div>
          ))}

          <div>
            <label className={labelClass} htmlFor="job-status">Listing status</label>
            <select id="job-status" value={form.status} onChange={set("status")} disabled={isSaving} className={inputClass}>
              <option value="open">Open (visible on careers page)</option>
              <option value="closed">Closed (hidden)</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-xl border border-neutral-800 px-4 py-2.5 text-sm text-neutral-300 hover:text-white disabled:opacity-50">
              Cancel
            </button>

            <button type="submit" disabled={isSaving} className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50">
              {isSaving ? "Saving..." : job ? "Save Changes" : "Create Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
