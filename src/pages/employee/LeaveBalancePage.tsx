import { useEffect, useState } from "react";
import { Briefcase, HeartPulse, CalendarClock, RefreshCw } from "lucide-react";
import api from "../../utils/api";
import PageContainer, {
  SectionHeader,
  DashCard,
} from "../../components/layout/PageContainer";

interface Balance {
  ptoHours: number;
  uptoHours: number;
  ptoUsed: number;
  uptoUsed: number;
  lastAccrualDate: string;
  nextAccrualDate: string;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function HoursBar({ used, total, color }: { used: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  return (
    <div className="w-full bg-neutral-800 rounded-full h-2 mt-2">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function LeaveBalancePage() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/leave-balance/mine")
      .then((res) => setBalance(res.data.balance))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer>
      <SectionHeader title="Leave Balance" />

      {loading ? (
        <p className="text-neutral-400 text-sm">Loading...</p>
      ) : !balance ? (
        <p className="text-neutral-400 text-sm">Unable to load balance.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Balance cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PTO */}
            <DashCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">PTO</h3>
                  <p className="text-neutral-500 text-xs">Paid Time Off</p>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <span className="text-4xl font-bold text-white">{balance.ptoHours}</span>
                  <span className="text-neutral-500 text-sm ml-1.5">hrs available</span>
                </div>
                <span className="text-neutral-500 text-sm">{balance.ptoUsed} hrs used</span>
              </div>

              <HoursBar
                used={balance.ptoUsed}
                total={balance.ptoHours + balance.ptoUsed}
                color="bg-blue-500"
              />
              <p className="text-neutral-600 text-xs mt-2">
                ≈ {Math.floor(balance.ptoHours / 8)} full days remaining
              </p>
            </DashCard>

            {/* UPTO */}
            <DashCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/10">
                  <HeartPulse className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">UPTO</h3>
                  <p className="text-neutral-500 text-xs">Unpaid Time Off / Sick Leave</p>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <span className="text-4xl font-bold text-white">{balance.uptoHours}</span>
                  <span className="text-neutral-500 text-sm ml-1.5">hrs available</span>
                </div>
                <span className="text-neutral-500 text-sm">{balance.uptoUsed} hrs used</span>
              </div>

              <HoursBar
                used={balance.uptoUsed}
                total={balance.uptoHours + balance.uptoUsed}
                color="bg-amber-500"
              />
              <p className="text-neutral-600 text-xs mt-2">
                ≈ {Math.floor(balance.uptoHours / 8)} full days remaining
              </p>
            </DashCard>
          </div>

          {/* Accrual info */}
          <DashCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10">
                <RefreshCw className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Accrual Schedule</h3>
                <p className="text-neutral-500 text-xs">+10 PTO hrs &amp; +10 UPTO hrs every 3 months</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-neutral-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarClock className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-500 text-xs uppercase tracking-widest">Last Accrual</span>
                </div>
                <p className="text-white font-medium">{fmt(balance.lastAccrualDate)}</p>
              </div>

              <div className="bg-neutral-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarClock className="w-4 h-4 text-emerald-500" />
                  <span className="text-neutral-500 text-xs uppercase tracking-widest">Next Accrual</span>
                </div>
                <p className="text-emerald-400 font-medium">{fmt(balance.nextAccrualDate)}</p>
                <p className="text-neutral-600 text-xs mt-0.5">
                  in {daysUntil(balance.nextAccrualDate)} days
                </p>
              </div>
            </div>

            <p className="text-neutral-600 text-xs mt-4">
              Hours are automatically added every 90 days. Sick leave (UPTO) and
              paid time-off requests deduct from the respective balance when approved.
            </p>
          </DashCard>
        </div>
      )}
    </PageContainer>
  );
}
