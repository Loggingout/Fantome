import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type { JobListingRecord } from "../../../../../types/careers";
import { applyToJob } from "../../../../../services/careersService";

interface JobApplicationModalProps {
  job: JobListingRecord | null;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-neutral-600 disabled:opacity-50";

export default function JobApplicationModal({ job, onClose }: JobApplicationModalProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resumeUrl: "",
    coverLetter: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [job]);

  if (!job) return null;

  const set = (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const message = await applyToJob(job.id, {
        ...form,
        phone: form.phone || undefined,
        resumeUrl: form.resumeUrl || undefined,
      });
      setSuccess(message);
      setForm({ firstName: "", lastName: "", email: "", phone: "", resumeUrl: "", coverLetter: "" });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit your application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500">Apply</p>
            <h2 id="apply-title" className="mt-2 text-xl font-semibold text-white">
              {job.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="space-y-5 p-6">
            <p role="status" className="text-sm text-emerald-300">{success}</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white hover:bg-neutral-700"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <input required maxLength={80} value={form.firstName} onChange={set("firstName")} placeholder="First name" className={inputClass} disabled={isSubmitting} />
              <input required maxLength={80} value={form.lastName} onChange={set("lastName")} placeholder="Last name" className={inputClass} disabled={isSubmitting} />
            </div>

            <input required type="email" maxLength={254} value={form.email} onChange={set("email")} placeholder="Email" autoComplete="email" className={inputClass} disabled={isSubmitting} />
            <input type="tel" maxLength={40} value={form.phone} onChange={set("phone")} placeholder="Phone (optional)" className={inputClass} disabled={isSubmitting} />
            <input type="url" maxLength={500} value={form.resumeUrl} onChange={set("resumeUrl")} placeholder="Resume or portfolio link (optional)" className={inputClass} disabled={isSubmitting} />
            <textarea required maxLength={10000} rows={6} value={form.coverLetter} onChange={set("coverLetter")} placeholder="Why are you a good fit for this role?" className={`${inputClass} resize-none`} disabled={isSubmitting} />

            {error && (
              <p role="alert" className="text-sm text-red-300">{error}</p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border border-neutral-800 px-4 py-2.5 text-sm text-neutral-300 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
