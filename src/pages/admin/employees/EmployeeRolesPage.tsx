import { useEffect, useState } from "react";
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
}

export default function EmployeeRolesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, { text: string; ok: boolean }>>({});

  useEffect(() => {
    api
      .get("/admin/employees")
      .then((res) => setEmployees(res.data.employees))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    setUpdating(id);
    setFeedback((prev) => ({ ...prev, [id]: { text: "", ok: true } }));
    try {
      const res = await api.patch(`/admin/employees/${id}/role`, { role: newRole });
      setEmployees((prev) =>
        prev.map((e) => (e._id === id ? { ...e, role: res.data.employee.role } : e))
      );
      setFeedback((prev) => ({
        ...prev,
        [id]: { text: "Role updated — employee notified.", ok: true },
      }));
    } catch (err: any) {
      setFeedback((prev) => ({
        ...prev,
        [id]: {
          text: err.response?.data?.message || "Failed to update role",
          ok: false,
        },
      }));
    } finally {
      setUpdating(null);
    }
  };

  return (
    <PageContainer>
      <SectionHeader title="Employee Roles" />

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
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Current Role</th>
                  <th className="pb-3 pr-6 text-neutral-500 font-medium">Change Role</th>
                  <th className="pb-3 text-neutral-500 font-medium">Status</th>
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
                    <td className="py-3 pr-6">
                      <select
                        value={emp.role}
                        onChange={(e) => handleRoleChange(emp._id, e.target.value)}
                        disabled={updating === emp._id}
                        className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-white text-sm disabled:opacity-50 cursor-pointer"
                      >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3">
                      {updating === emp._id && (
                        <span className="text-neutral-500 text-xs">Saving…</span>
                      )}
                      {feedback[emp._id]?.text && updating !== emp._id && (
                        <span
                          className={`text-xs ${
                            feedback[emp._id].ok ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {feedback[emp._id].text}
                        </span>
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
