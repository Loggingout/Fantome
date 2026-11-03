import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Banknote,
  Briefcase,
  Building2,
  CalendarClock,
  Clock3,
  Hourglass,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { JobListingRecord } from "../../../../../types/careers";
import { getOpenJobs } from "../../../../../services/careersService";
import JobApplicationModal from "./JobApplicationModal";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

export default function JoinTheTeamCTA() {
  const [jobs, setJobs] = useState<JobListingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [applyingTo, setApplyingTo] = useState<JobListingRecord | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getOpenJobs()
      .then((records) => isCurrent && setJobs(records))
      .catch(() => isCurrent && setLoadError(true))
      .finally(() => isCurrent && setIsLoading(false));

    return () => {
      isCurrent = false;
    };
  }, []);

  const hasOpenPositions = jobs.length > 0;

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 pb-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
      >
        {/* Section Heading */}
        <div className="mb-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs tracking-[0.2em] uppercase text-neutral-500">
                Careers at Fantome
              </span>

              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
                Open Positions
              </h2>

              <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-neutral-400">
                Explore opportunities to contribute to the platforms,
                technology, and ecosystem we're building at Fantome
                Technologies.
              </p>
            </div>

            <div
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-neutral-800
                bg-neutral-900
                px-4
                py-2
                text-xs
                text-neutral-400
              "
            >
              <Briefcase className="h-3.5 w-3.5" />

              {jobs.length}{" "}
              {jobs.length === 1 ? "Open Position" : "Open Positions"}
            </div>
          </div>
        </div>

        {/* Job Listings */}
        {hasOpenPositions ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, index) => (
              <motion.article
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.07,
                  ease: "easeOut",
                }}
                className="
                  group
                  flex
                  flex-col
                  rounded-2xl
                  border
                  border-neutral-800
                  bg-neutral-900/70
                  p-6
                  transition-all
                  duration-300
                  hover:border-neutral-700
                  hover:bg-neutral-900
                "
              >
                {/* Department */}
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="
                      rounded-full
                      border
                      border-neutral-800
                      bg-neutral-950
                      px-3
                      py-1.5
                      text-[11px]
                      font-medium
                      tracking-wide
                      text-neutral-400
                    "
                  >
                    {[job.department || job.role, job.company]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>

                  <Briefcase className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-neutral-400" />
                </div>

                {/* Job Title */}
                <h3 className="mt-6 text-xl font-semibold leading-snug text-white">
                  {job.title}
                </h3>

                {/* Description */}
                <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-neutral-400">
                  {job.description}
                </p>

                {job.roleDetails && (
                  <div className="mt-5">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-500">
                      Role Details
                    </p>

                    <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-neutral-400">
                      {job.roleDetails}
                    </p>
                  </div>
                )}

                {job.education && (
                  <div className="mt-5">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-500">
                      Education
                    </p>

                    <p className="mt-2 text-xs text-neutral-400">{job.education}</p>
                  </div>
                )}

                {[
                  ["Requirements", job.requirements],
                  ["Skills & Qualifications", job.skillsAndQualifications],
                  ["Preferred Qualifications", job.preferredQualifications],
                  ["Key Competencies", job.keyCompetencies],
                  ["What You Will Gain", job.whatYouWillGain],
                ].map(
                  ([label, items]) =>
                    items && items.length > 0 && (
                      <div key={label as string} className="mt-5">
                        <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-500">
                          {label as string}
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-neutral-400">
                          {(items as string[]).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ),
                )}

                {/* Job Details */}
                <div className="mt-6 space-y-3 border-t border-neutral-800 pt-5">
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <Clock3 className="h-4 w-4 shrink-0 text-neutral-500" />
                    <span>{job.employmentType}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <Building2 className="h-4 w-4 shrink-0 text-neutral-500" />
                    <span>{job.workplaceType}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <MapPin className="h-4 w-4 shrink-0 text-neutral-500" />
                    <span>{job.location || "Location flexible"}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <CalendarClock className="h-4 w-4 shrink-0 text-neutral-500" />
                    <span>{job.schedule}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <Banknote className="h-4 w-4 shrink-0 text-neutral-500" />
                    <span>{job.payRate || "Unpaid"}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <Hourglass className="h-4 w-4 shrink-0 text-neutral-500" />
                    <span>{job.roleLength}</span>
                  </div>
                </div>

                {/* Application */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setApplyingTo(job)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-neutral-300"
                  >
                    Apply Now
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            className="
              rounded-3xl
              border
              border-neutral-800
              bg-neutral-900/60
              px-6
              py-16
              text-center
              sm:px-12
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-neutral-800
                bg-neutral-950
              "
            >
              <Briefcase className="h-6 w-6 text-neutral-500" />
            </div>

            <h3 className="mt-6 text-xl font-semibold text-white">
              {isLoading ? "Loading Positions..." : "No Open Positions Right Now"}
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
              {loadError
                ? "Open positions are temporarily unavailable. Please try again shortly."
                : "We don't currently have any advertised openings. As Fantome Technologies and its ecosystem grow, new opportunities will appear here. Check back for future positions."}
            </p>

            <Link
              to="/contact"
              className="
                mt-7
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-neutral-700
                bg-neutral-800
                px-5
                py-3
                text-sm
                font-medium
                text-white
                transition-all
                duration-300
                hover:border-neutral-600
                hover:bg-neutral-700
              "
            >
              Contact Us
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </motion.div>

      <JobApplicationModal
        job={applyingTo}
        onClose={() => setApplyingTo(null)}
      />
    </section>
  );
}