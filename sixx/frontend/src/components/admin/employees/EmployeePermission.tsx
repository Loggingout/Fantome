import { useEffect, useState } from "react";
import api from "../../../utils/api";
import RoleBadge from "../../status/RoleBadge";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function EmployeePermission() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/employees")
      .then((res) => setEmployees(res.data.employees ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id: string, role: string) => {
    setUpdating(id);
    try {
      const res = await api.patch(`/admin/employees/${id}/role`, { role });
      setEmployees((prev) =>
        prev.map((e) => (e._id === id ? { ...e, role: res.data.employee.role } : e))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-xl font-serif text-white mb-2">Employee Permissions</h2>
      <p className="text-neutral-500 text-sm mb-5">Change employee roles to grant or restrict access.</p>

      {loading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : (
        <div className="flex flex-col gap-3">
          {employees.map((emp) => (
            <div
              key={emp._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-800 border border-neutral-700 rounded-xl p-4"
            >
              <div>
                <p className="text-white font-medium">{emp.name}</p>
                <p className="text-neutral-500 text-xs">{emp.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <RoleBadge role={emp.role} />
                <select
                  value={emp.role}
                  onChange={(e) => handleRoleChange(emp._id, e.target.value)}
                  disabled={updating === emp._id}
                  className="bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none disabled:opacity-50"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
                {updating === emp._id && (
                  <span className="text-neutral-500 text-xs">Saving…</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}