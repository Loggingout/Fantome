import { useEffect, useState } from "react";
import api from "../../utils/api";
import PageContainer, { SectionHeader, DashCard } from "../../components/layout/PageContainer";
import PayrollHistoryTable from "../../components/tables/PayrollHistoryTable";

interface PayrollRecord {
  period: string;
  monthKey: string;
  daysWorked: number;
  totalHours: number;
  gross: number;
  net: number;
  rate: number;
}

export default function MyPayoutPage() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/attendance/my-payroll")
      .then((res) => {
        setPayroll(res.data.payroll ?? []);
        setHourlyRate(res.data.hourlyRate ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const current = payroll[0] ?? null;

  const summaryCards = [
    {
      label: "Hourly Rate",
      value: hourlyRate > 0 ? `$${hourlyRate}/hr` : "Not set",
      sub: "Set by admin",
      color: "text-white",
    },
    {
      label: "This Month — Hours",
      value: current ? `${current.totalHours.toFixed(2)}h` : "—",
      sub: current?.period ?? "No records yet",
      color: "text-white",
    },
    {
      label: "This Month — Gross",
      value: current ? `$${current.gross.toFixed(2)}` : "—",
      sub: `${current?.daysWorked ?? 0} day${(current?.daysWorked ?? 0) !== 1 ? "s" : ""} worked`,
      color: "text-emerald-400",
    },
    {
      label: "This Month — Net (est.)",
      value: current ? `$${current.net.toFixed(2)}` : "—",
      sub: "After ~15% tax est.",
      color: "text-white",
    },
  ];

  return (
    <PageContainer>
      <SectionHeader title="My Payout" />

      {/* Summary cards */}
      {loading ? (
        <div className="py-12 text-center text-neutral-500 text-sm">Loading payout info…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {summaryCards.map((card) => (
              <DashCard key={card.label} className="p-5">
                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-2">
                  {card.label}
                </p>
                <p className={`text-2xl font-bold leading-none ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-neutral-600 text-xs mt-2">{card.sub}</p>
              </DashCard>
            ))}
          </div>

          {/* Rate info banner */}
          {hourlyRate === 0 && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-amber-900/20 border border-amber-800/40 text-amber-400 text-sm">
              Your hourly rate hasn't been set yet. Contact an admin to have it configured.
            </div>
          )}

          {/* Full payroll history */}
          <PayrollHistoryTable />
        </>
      )}
    </PageContainer>
  );
}
