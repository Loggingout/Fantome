import { useEffect, useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import api from "../../../utils/api";
import PageContainer, {
  SectionHeader,
  DashCard,
} from "../../../components/layout/PageContainer";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  jobTitle?: string;
  hireDate?: string | null;
  hourlyRate?: number;
}

function fmtDate(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toInputDate(iso?: string | null) {
  if (!iso) return "";
  return new Date(iso).toISOString().split("T")[0];
}

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Hire date editing state
  const [editingHireId, setEditingHireId] = useState<string | null>(null);
  const [hireDateInput, setHireDateInput] = useState("");
  const [savingHire, setSavingHire] = useState<string | null>(null);
  const [hireFeedback, setHireFeedback] = useState<Record<string, string>>({});

  // Pay rate editing state
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [rateInput, setRateInput] = useState("");
  const [savingRate, setSavingRate] = useState<string | null>(null);
  const [rateFeedback, setRateFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    api
      .get("/admin/employees")
      .then((res) => setEmployees(res.data.employees))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await api.delete(`/admin/employees/${id}`);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
      setConfirmId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const startEditHire = (emp: Employee) => {
    setEditingHireId(emp._id);
    setHireDateInput(toInputDate(emp.hireDate));
  };

  const cancelEditHire = () => {
    setEditingHireId(null);
    setHireDateInput("");
  };

  const startEditRate = (emp: Employee) => {
    setEditingRateId(emp._id);
    setRateInput(emp.hourlyRate != null ? String(emp.hourlyRate) : "");
  };

  const cancelEditRate = () => {
    setEditingRateId(null);
    setRateInput("");
  };

  const saveRate = async (id: string) => {
    const val = parseFloat(rateInput);
    if (isNaN(val) || val < 0) return;
    setSavingRate(id);
    try {
      await api.patch(`/admin/employees/${id}/rate`, { hourlyRate: val });
      setEmployees((prev) =>
        prev.map((e) => (e._id === id ? { ...e, hourlyRate: val } : e))
      );
      setRateFeedback((prev) => ({ ...prev, [id]: "Saved" }));
      setEditingRateId(null);
      setTimeout(() => setRateFeedback((prev) => ({ ...prev, [id]: "" })), 2500);
    } catch (err: any) {
      setRateFeedback((prev) => ({
        ...prev,
        [id]: err.response?.data?.message || "Failed",
      }));
    } finally {
      setSavingRate(null);
    }
  };

  const saveHireDate = async (id: string) => {
    if (!hireDateInput) return;
    setSavingHire(id);
    try {
      const res = await api.patch(`/admin/employees/${id}/hire-date`, {
        hireDate: hireDateInput,
      });
      setEmployees((prev) =>
        prev.map((e) =>
          e._id === id ? { ...e, hireDate: res.data.employee.hireDate } : e
        )
      );
      setHireFeedback((prev) => ({ ...prev, [id]: "Saved" }));
      setEditingHireId(null);
      setTimeout(() => setHireFeedback((prev) => ({ ...prev, [id]: "" })), 2500);
    } catch (err: any) {
      setHireFeedback((prev) => ({
        ...prev,
        [id]: err.response?.data?.message || "Failed to save",
      }));
    } finally {
      setSavingHire(null);
    }
  };

  return (
    <PageContainer>
      <SectionHeader title="All Employees" />

      <DashCard className="p-6">
        {loading ? (
          <p className="text-neutral-400 text-sm">Loading employees...</p>
        ) : employees.length === 0 ? (
          <p className="text-neutral-400 text-sm">No employees found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Name</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Email</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Access</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Job Title</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Hire Date</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Pay Rate</th>
                  <th className="pb-3 text-neutral-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td className="py-3 pr-6 text-white font-medium">{emp.name}</td>
                    <td className="py-3 pr-6 text-neutral-400">{emp.email}</td>
                    <td className="py-3 pr-6">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          emp.role === "admin"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-neutral-700 text-neutral-300"
                        }`}
                      >
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-3 pr-6 text-neutral-400">
                      {emp.jobTitle ?? <span className="text-neutral-600">—</span>}
                    </td>

                    {/* Hire Date — inline editable */}
                    <td className="py-3 pr-6 min-w-[180px]">
                      {editingHireId === emp._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={hireDateInput}
                            onChange={(e) => setHireDateInput(e.target.value)}
                            className="bg-neutral-800 border border-neutral-600 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-neutral-400"
                          />
                          <button
                            onClick={() => saveHireDate(emp._id)}
                            disabled={savingHire === emp._id || !hireDateInput}
                            className="p-1 text-emerald-400 hover:text-emerald-300 disabled:opacity-40 transition"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditHire}
                            className="p-1 text-neutral-500 hover:text-white transition"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <span className="text-neutral-400">
                            {fmtDate(emp.hireDate) ?? (
                              <span className="text-neutral-600 italic">Not set</span>
                            )}
                          </span>
                          <button
                            onClick={() => startEditHire(emp)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-white transition"
                            title="Edit hire date"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {hireFeedback[emp._id] && (
                            <span className="text-emerald-400 text-xs">
                              {hireFeedback[emp._id]}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Pay Rate — inline editable */}
                    <td className="py-3 pr-6 min-w-[160px]">
                      {editingRateId === emp._id ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500 text-xs">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={rateInput}
                            onChange={(e) => setRateInput(e.target.value)}
                            className="w-20 bg-neutral-800 border border-neutral-600 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-neutral-400"
                          />
                          <span className="text-neutral-600 text-xs">/hr</span>
                          <button
                            onClick={() => saveRate(emp._id)}
                            disabled={savingRate === emp._id || rateInput === ""}
                            className="p-1 text-emerald-400 hover:text-emerald-300 disabled:opacity-40 transition"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditRate}
                            className="p-1 text-neutral-500 hover:text-white transition"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <span className="text-neutral-400">
                            {emp.hourlyRate != null && emp.hourlyRate > 0
                              ? `$${emp.hourlyRate.toFixed(2)}/hr`
                              : <span className="text-neutral-600 italic">Not set</span>
                            }
                          </span>
                          <button
                            onClick={() => startEditRate(emp)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-white transition"
                            title="Edit pay rate"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {rateFeedback[emp._id] && (
                            <span className="text-emerald-400 text-xs">
                              {rateFeedback[emp._id]}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-3">
                      {confirmId === emp._id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400">Remove employee?</span>
                          <button
                            onClick={() => handleDelete(emp._id)}
                            disabled={deleting === emp._id}
                            className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition disabled:opacity-50"
                          >
                            {deleting === emp._id ? "Removing…" : "Confirm"}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="px-3 py-1 text-xs bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(emp._id)}
                          className="px-3 py-1 text-xs bg-neutral-800 text-neutral-400 rounded-lg hover:bg-red-500/20 hover:text-red-400 border border-neutral-700 transition"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashCard>
    </PageContainer>
  );
}

