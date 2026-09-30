import { useEffect, useState } from "react";
import api from "../../../utils/api";

export default function EmployeeAnalytics() {
  const [total, setTotal] = useState(0);
  const [admins, setAdmins] = useState(0);
  const [newHires, setNewHires] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/dashboard/stats"),
      api.get("/admin/employees"),
    ])
      .then(([statsRes, empRes]) => {
        setTotal(statsRes.data.stats?.totalEmployees ?? 0);
        setNewHires(statsRes.data.stats?.newHires ?? 0);
        const emps = empRes.data.employees ?? [];
        setAdmins(emps.filter((e: any) => e.role === "admin").length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Employees", value: total, color: "text-white" },
    { label: "Admins", value: admins, color: "text-amber-400" },
    { label: "New This Month", value: newHires, color: "text-emerald-400" },
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-xl font-serif text-white mb-4">Employee Analytics</h2>

      {loading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
              <p className="text-neutral-400 text-sm mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
