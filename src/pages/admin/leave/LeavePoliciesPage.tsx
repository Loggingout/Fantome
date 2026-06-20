import { Link } from "react-router-dom";
import { BookOpen, Briefcase, HeartPulse, RefreshCw, AlertCircle } from "lucide-react";
import PageContainer, { SectionHeader, DashCard } from "../../../components/layout/PageContainer";

function PolicyCard({ icon: Icon, color, bg, title, children }: {
  icon: React.ElementType;
  color: string;
  bg: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <DashCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-xl ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <div className="flex flex-col gap-3 text-sm text-neutral-400">
        {children}
      </div>
    </DashCard>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-neutral-800/60 last:border-0">
      <span className="text-neutral-500 shrink-0">{label}</span>
      <span className="text-neutral-300 text-right">{value}</span>
    </div>
  );
}

export default function LeavePoliciesPage() {
  return (
    <PageContainer>
      <SectionHeader title="Leave Policies" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PTO Policy */}
        <PolicyCard icon={Briefcase} color="text-blue-400" bg="bg-blue-500/10" title="Paid Time Off (PTO)">
          <Row label="Starting Balance" value="10 hours (1.25 days)" />
          <Row label="Accrual Rate" value="+10 hours every 90 days" />
          <Row label="Accrual Type" value="Stacking — never expires" />
          <Row label="Eligible From" value="First day of employment" />
          <Row label="Minimum Request" value="1 working day (8 hours)" />
          <Row label="Advance Notice" value="Recommended 3+ days in advance" />
          <Row label="Approval Required" value="Yes — admin decision" />
          <p className="text-neutral-600 text-xs mt-1">
            PTO is paid leave intended for personal time, vacations, or personal matters. Requests
            are subject to workload availability and manager approval.
          </p>
        </PolicyCard>

        {/* UPTO / Sick Leave Policy */}
        <PolicyCard icon={HeartPulse} color="text-amber-400" bg="bg-amber-500/10" title="Unpaid Time Off / Sick Leave (UPTO)">
          <Row label="Starting Balance" value="40 hours (5 days)" />
          <Row label="Accrual Rate" value="+10 hours every 90 days" />
          <Row label="Accrual Type" value="Stacking — never expires" />
          <Row label="Eligible From" value="First day of employment" />
          <Row label="Minimum Request" value="1 working day (8 hours)" />
          <Row label="Advance Notice" value="Submit ASAP; same-day OK for illness" />
          <Row label="Approval Required" value="Yes — admin decision" />
          <p className="text-neutral-600 text-xs mt-1">
            UPTO covers sick days and unplanned absences. Employees are encouraged to notify
            their manager as early as possible for same-day absences.
          </p>
        </PolicyCard>

        {/* Accrual Schedule */}
        <PolicyCard icon={RefreshCw} color="text-emerald-400" bg="bg-emerald-500/10" title="Accrual Schedule">
          <Row label="Accrual Frequency" value="Every 90 calendar days" />
          <Row label="PTO Added Per Period" value="+10 hours" />
          <Row label="UPTO Added Per Period" value="+10 hours" />
          <Row label="Calculation Method" value="Lazy — calculated on-fetch" />
          <Row label="Rollover" value="All hours carry over indefinitely" />
          <Row label="Cap" value="No cap — hours stack without limit" />
          <p className="text-neutral-600 text-xs mt-1">
            Balances are automatically updated when viewed. There is no scheduled job — accrual
            periods are calculated in real-time based on the last accrual date.
          </p>
        </PolicyCard>

        {/* General Rules */}
        <PolicyCard icon={AlertCircle} color="text-neutral-400" bg="bg-neutral-800/60" title="General Rules">
          <Row label="Working Day Definition" value="Monday – Friday, 8 hours/day" />
          <Row label="Weekend Requests" value="Weekends excluded from day count" />
          <Row label="Negative Balance" value="Allowed — admin decides on request" />
          <Row label="Concurrent Requests" value="Multiple requests allowed" />
          <Row label="Cancellation" value="Contact admin before the leave start date" />
          <Row label="Documentation" value="Not required but may be requested" />
          <p className="text-neutral-600 text-xs mt-1">
            All leave decisions are at the discretion of management. Employees will receive a
            notification when their request is approved or denied.
          </p>
        </PolicyCard>
      </div>

      {/* Footer note */}
      <div className="mt-6 px-1 flex items-start gap-3">
        <BookOpen className="w-4 h-4 text-neutral-600 mt-0.5 shrink-0" />
        <p className="text-neutral-600 text-xs">
          Policies are subject to change. Employees can view their current balances on the{" "}
          <Link to="/admin/leave/balances" className="text-neutral-400 hover:text-white underline transition">
            Leave Balances
          </Link>{" "}
          page. Admins can manually adjust balances at any time.
        </p>
      </div>
    </PageContainer>
  );
}
