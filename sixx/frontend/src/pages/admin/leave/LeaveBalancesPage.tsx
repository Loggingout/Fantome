import { useEffect, useState } from "react";
import api from "../../../utils/api";
import PageContainer, {
  SectionHeader,
  DashCard,
} from "../../../components/layout/PageContainer";

interface BalanceRow {
  employee: { _id: string; name: string; email: string; jobTitle?: string };
  ptoHours: number;
  uptoHours: number;
  ptoUsed: number;
  uptoUsed: number;
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
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

export default function LeaveBalancesPage() {
  const [balances, setBalances] = useState<BalanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, { pto: string; upto: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    api
      .get("/leave-balance/all")
      .then((res) => setBalances(res.data.balances))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (row: BalanceRow) => {
    setEditing((prev) => ({
      ...prev,
      [row.employee._id]: {
        pto: String(row.ptoHours),
        upto: String(row.uptoHours),
      },
    }));
  };

  const cancelEdit = (id: string) => {
    setEditing((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const saveAdjust = async (id: string) => {
    const vals = editing[id];
    if (!vals) return;
    setSaving(id);
    try {
      const res = await api.patch(`/leave-balance/${id}/adjust`, {
        ptoHours: Number(vals.pto),
        uptoHours: Number(vals.upto),
      });
      setBalances((prev) =>
        prev.map((b) =>
          b.employee._id === id
            ? { ...b, ptoHours: res.data.balance.ptoHours, uptoHours: res.data.balance.uptoHours }
            : b
        )
      );
      cancelEdit(id);
      setFeedback((prev) => ({ ...prev, [id]: "Saved" }));
      setTimeout(() => setFeedback((prev) => ({ ...prev, [id]: "" })), 2500);
    } catch (err: any) {
      setFeedback((prev) => ({
        ...prev,
        [id]: err.response?.data?.message || "Failed to save",
      }));
    } finally {
      setSaving(null);
    }
  };

  return (
    <PageContainer>
      <SectionHeader title="Leave Balances" />

      <DashCard className="p-6">
        {loading ? (
          <p className="text-neutral-400 text-sm">Loading...</p>
        ) : balances.length === 0 ? (
          <p className="text-neutral-400 text-sm">No active employees.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Employee</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">PTO Available</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">UPTO Available</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Next Accrual</th>
                  <th className="pb-3 text-neutral-500 font-medium">Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {balances.map((row) => {
                  const id = row.employee._id;
                  const isEditing = !!editing[id];
                  return (
                    <tr key={id}>
                      <td className="py-3 pr-6">
                        <p className="text-white font-medium">{row.employee.name}</p>
                        <p className="text-neutral-500 text-xs">{row.employee.jobTitle ?? row.employee.email}</p>
                      </td>

                      <td className="py-3 pr-6">
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            value={editing[id].pto}
                            onChange={(e) =>
                              setEditing((prev) => ({
                                ...prev,
                                [id]: { ...prev[id], pto: e.target.value },
                              }))
                            }
                            className="w-20 bg-neutral-800 border border-neutral-600 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
                          />
                        ) : (
                          <span className="text-blue-400 font-semibold">{row.ptoHours} hrs</span>
                        )}
                        <p className="text-neutral-600 text-xs">{row.ptoUsed} used</p>
                      </td>

                      <td className="py-3 pr-6">
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            value={editing[id].upto}
                            onChange={(e) =>
                              setEditing((prev) => ({
                                ...prev,
                                [id]: { ...prev[id], upto: e.target.value },
                              }))
                            }
                            className="w-20 bg-neutral-800 border border-neutral-600 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
                          />
                        ) : (
                          <span className="text-amber-400 font-semibold">{row.uptoHours} hrs</span>
                        )}
                        <p className="text-neutral-600 text-xs">{row.uptoUsed} used</p>
                      </td>

                      <td className="py-3 pr-6">
                        <p className="text-neutral-300 text-xs">{fmt(row.nextAccrualDate)}</p>
                        <p className="text-neutral-600 text-xs">in {daysUntil(row.nextAccrualDate)}d</p>
                      </td>

                      <td className="py-3">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveAdjust(id)}
                              disabled={saving === id}
                              className="px-3 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition disabled:opacity-50"
                            >
                              {saving === id ? "Saving…" : "Save"}
                            </button>
                            <button
                              onClick={() => cancelEdit(id)}
                              className="px-3 py-1 text-xs bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEdit(row)}
                              className="px-3 py-1 text-xs bg-neutral-800 text-neutral-400 rounded-lg hover:bg-neutral-700 hover:text-white border border-neutral-700 transition"
                            >
                              Adjust
                            </button>
                            {feedback[id] && (
                              <span className="text-emerald-400 text-xs">{feedback[id]}</span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DashCard>

      <p className="text-neutral-600 text-xs mt-4 px-1">
        All employees start with 10 PTO hrs and 40 UPTO hrs. +10 of each accrues every 90 days.
        Hours are deducted automatically when a leave request is approved.
      </p>
    </PageContainer>
  );
}
