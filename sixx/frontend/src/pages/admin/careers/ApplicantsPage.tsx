import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import type {
  ApplicationStatus,
  JobApplicationRecord,
} from "../../../types/careers";
import {
  deleteApplication,
  getApplications,
  updateApplication,
} from "../../../services/careersService";

const STATUS_OPTIONS: Array<{ value: ApplicationStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "interview", label: "Interview" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<JobApplicationRecord[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setApplications(await getApplications());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to retrieve applicants.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const replace = (updated: JobApplicationRecord) =>
    setApplications((current) =>
      current.map((application) => (application.id === updated.id ? updated : application)),
    );

  const handleUpdate = async (
    id: string,
    payload: { status?: ApplicationStatus; notes?: string },
  ) => {
    try {
      setError(null);
      replace(await updateApplication(id, payload));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update applicant.");
    }
  };

  const handleDelete = async (application: JobApplicationRecord) => {
    if (!window.confirm(`Delete the application from ${application.firstName} ${application.lastName}?`)) return;

    try {
      setError(null);
      await deleteApplication(application.id);
      setApplications((current) => current.filter((item) => item.id !== application.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete applicant.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-neutral-500">Careers</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Applicants</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">
          Applications submitted through the Join the Team page.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-900/50 bg-red-950/20 px-5 py-4">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
        {isLoading ? (
          <p className="px-6 py-10 text-sm text-neutral-500">Loading applicants...</p>
        ) : applications.length === 0 ? (
          <p className="px-6 py-10 text-sm text-neutral-500">No applications received yet.</p>
        ) : (
          <div className="divide-y divide-neutral-800">
            {applications.map((application) => {
              const isOpen = openId === application.id;

              return (
                <div key={application.id} className="px-6 py-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-white">
                        {application.firstName} {application.lastName}
                      </p>

                      <p className="mt-1 text-sm text-neutral-500">
                        {application.jobTitle} · {application.email}
                      </p>

                      <p className="mt-1 text-xs text-neutral-600">
                        Applied {formatDate(application.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={application.status}
                        onChange={(event) =>
                          void handleUpdate(application.id, {
                            status: event.target.value as ApplicationStatus,
                          })
                        }
                        aria-label="Application status"
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
                      >
                        {STATUS_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : application.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 hover:text-white"
                      >
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        Details
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(application)}
                        aria-label="Delete application"
                        className="rounded-xl border border-red-900/40 bg-neutral-950 p-2.5 text-red-300 hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-5 space-y-4 rounded-xl border border-neutral-800 bg-neutral-950 p-5">
                      <div className="grid gap-3 text-sm text-neutral-400 sm:grid-cols-2">
                        <p>
                          Email:{" "}
                          <a href={`mailto:${application.email}`} className="text-white hover:underline">
                            {application.email}
                          </a>
                        </p>

                        <p>Phone: {application.phone || "Not provided"}</p>

                        <p className="sm:col-span-2">
                          Resume / portfolio:{" "}
                          {application.resumeUrl ? (
                            <a
                              href={application.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all text-white hover:underline"
                            >
                              {application.resumeUrl}
                            </a>
                          ) : (
                            "Not provided"
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-neutral-500">Cover letter</p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-300">
                          {application.coverLetter}
                        </p>
                      </div>

                      <div>
                        <label htmlFor={`notes-${application.id}`} className="text-xs uppercase tracking-widest text-neutral-500">
                          Internal notes
                        </label>

                        <textarea
                          id={`notes-${application.id}`}
                          rows={3}
                          maxLength={5000}
                          value={notesDraft[application.id] ?? application.notes}
                          onChange={(event) =>
                            setNotesDraft((current) => ({
                              ...current,
                              [application.id]: event.target.value,
                            }))
                          }
                          className="mt-2 w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-neutral-600"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            void handleUpdate(application.id, {
                              notes: notesDraft[application.id] ?? application.notes,
                            })
                          }
                          className="mt-2 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-700"
                        >
                          Save notes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
