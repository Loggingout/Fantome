import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import JobListingModal from "../../../components/admin/careers/JobListingModal";
import type { JobListingPayload, JobListingRecord } from "../../../types/careers";
import {
  createJob,
  deleteJob,
  getAdminJobs,
  updateJob,
} from "../../../services/careersService";

export default function CareersManagementPage() {
  const [jobs, setJobs] = useState<JobListingRecord[]>([]);
  const [editing, setEditing] = useState<JobListingRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    try {
      setError(null);
      setJobs(await getAdminJobs());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to retrieve job listings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (job: JobListingRecord) => {
    setEditing(job);
    setIsModalOpen(true);
  };

  const handleSubmit = async (payload: JobListingPayload) => {
    try {
      setError(null);
      setIsSaving(true);

      if (editing) {
        const updated = await updateJob(editing.id, payload);
        setJobs((current) => current.map((job) => (job.id === updated.id ? updated : job)));
      } else {
        const created = await createJob(payload);
        setJobs((current) => [created, ...current]);
      }

      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save job listing.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (job: JobListingRecord) => {
    if (!window.confirm(`Delete "${job.title}"? Existing applications are kept.`)) return;

    try {
      setError(null);
      await deleteJob(job.id);
      setJobs((current) => current.filter((item) => item.id !== job.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete job listing.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">Careers</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Job Listings</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-500">
            Open listings appear on the public Join the Team page.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-neutral-200"
        >
          <Plus className="h-4 w-4" />
          New Listing
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-900/50 bg-red-950/20 px-5 py-4">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
        {isLoading ? (
          <p className="px-6 py-10 text-sm text-neutral-500">Loading job listings...</p>
        ) : jobs.length === 0 ? (
          <p className="px-6 py-10 text-sm text-neutral-500">No job listings yet.</p>
        ) : (
          <div className="divide-y divide-neutral-800">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-medium text-white">{job.title}</p>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                        job.status === "open"
                          ? "border-emerald-900/50 bg-emerald-950/30 text-emerald-300"
                          : "border-neutral-700 bg-neutral-800 text-neutral-400"
                      }`}
                    >
                      {job.status === "open" ? "Open" : "Closed"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-neutral-500">
                    {job.role} · {job.employmentType} · {job.workplaceType} · {job.payRate || "Unpaid"} · {job.roleLength}
                  </p>

                  <p className="mt-1 text-xs text-neutral-600">{job.schedule}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(job)}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 hover:border-neutral-700 hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDelete(job)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-900/40 bg-neutral-950 px-3 py-2 text-sm text-red-300 hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <JobListingModal
        isOpen={isModalOpen}
        job={editing}
        onClose={() => {
          if (!isSaving) setIsModalOpen(false);
        }}
        onSubmit={handleSubmit}
        isSaving={isSaving}
      />
    </div>
  );
}
