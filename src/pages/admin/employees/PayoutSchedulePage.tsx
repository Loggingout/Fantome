import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CalendarDays, Users, Clock } from "lucide-react";
import api from "../../../utils/api";
import PageContainer, {
  SectionHeader,
  DashCard,
} from "../../../components/layout/PageContainer";

interface ScheduleEntry {
  _id: string;
  name: string;
  email: string;
  jobTitle: string | null;
  hourlyRate: number;
  hireDate: string;
  nextPayoutDate: string;
  daysUntilPayout: number;
  cycleNumber: number;
}

function urgencyClass(days: number): string {
  if (days <= 0) return "text-red-400";
  if (days <= 3) return "text-orange-400";
  if (days <= 7) return "text-amber-400";
  return "text-neutral-300";
}

function urgencyBadge(days: number): { label: string; cls: string } {
  if (days <= 0) return { label: "Due Today", cls: "bg-red-500/20 text-red-400" };
  if (days === 1) return { label: "Tomorrow", cls: "bg-orange-500/20 text-orange-400" };
  if (days <= 3) return { label: `${days}d`, cls: "bg-orange-500/20 text-orange-400" };
  if (days <= 7) return { label: `${days}d`, cls: "bg-amber-500/20 text-amber-400" };
  return { label: `${days}d`, cls: "bg-neutral-700 text-neutral-400" };
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PayoutSchedulePage() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/employees/payout-schedule")
      .then((res) => setSchedule(res.data.schedule))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const dueThisWeek = schedule.filter((e) => e.daysUntilPayout <= 7).length;
  const next = schedule[0] ?? null;

  return (
    <PageContainer>
      <button
        onClick={() => navigate("/admin/employees")}
        className="flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm transition-colors mb-4 w-fit"
      >
        <ChevronLeft className="w-4 h-4 shrink-0" />
        Back to Employees
      </button>

      <SectionHeader title="Payout Schedule" />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <DashCard className="p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-neutral-800">
            <Users className="w-5 h-5 text-neutral-400" />
          </div>
          <div>
            <p className="text-neutral-500 text-xs uppercase tracking-widest">Total Employees</p>
            <p className="text-white text-2xl font-bold">{schedule.length}</p>
          </div>
        </DashCard>

        <DashCard className="p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-neutral-500 text-xs uppercase tracking-widest">Due This Week</p>
            <p className="text-amber-400 text-2xl font-bold">{dueThisWeek}</p>
          </div>
        </DashCard>

        <DashCard className="p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10">
            <CalendarDays className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-neutral-500 text-xs uppercase tracking-widest">Next Payout</p>
            <p className="text-emerald-400 text-lg font-bold">
              {next ? fmt(next.nextPayoutDate) : "—"}
            </p>
          </div>
        </DashCard>
      </div>

      {/* Schedule table */}
      <DashCard className="p-6">
        {loading ? (
          <p className="text-neutral-400 text-sm">Loading schedule…</p>
        ) : schedule.length === 0 ? (
          <p className="text-neutral-400 text-sm">No active employees found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Name</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Job Title</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Hired</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Pay Cycle</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Next Payout</th>
                  <th className="pb-3 text-neutral-500 font-medium">Due In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {schedule.map((emp) => {
                  const badge = urgencyBadge(emp.daysUntilPayout);
                  return (
                    <tr key={emp._id}>
                      <td className="py-3 pr-6">
                        <p className="text-white font-medium">{emp.name}</p>
                        <p className="text-neutral-500 text-xs">{emp.email}</p>
                      </td>
                      <td className="py-3 pr-6 text-neutral-400">
                        {emp.jobTitle ?? <span className="text-neutral-600">—</span>}
                      </td>
                      <td className="py-3 pr-6 text-neutral-400">{fmt(emp.hireDate)}</td>
                      <td className="py-3 pr-6">
                        <span className="text-neutral-400">
                          Cycle <span className="text-white font-medium">#{emp.cycleNumber}</span>
                        </span>
                        <p className="text-neutral-600 text-xs">bi-weekly</p>
                      </td>
                      <td className={`py-3 pr-6 font-medium ${urgencyClass(emp.daysUntilPayout)}`}>
                        {fmt(emp.nextPayoutDate)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DashCard>
    </PageContainer>
  );
}
