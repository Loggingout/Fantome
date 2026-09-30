import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import RoleBadge from "../../status/RoleBadge";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  hourlyRate: number;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/admin/employees")
      .then((res) => setEmployees(res.data.employees ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 overflow-x-auto">
      <h2 className="text-xl font-serif text-white mb-4">Employee List</h2>

      {loading ? (
        <p className="text-neutral-500 text-sm py-4">Loading…</p>
      ) : (
        <table className="w-full text-left text-sm min-w-150">
          <thead>
            <tr className="text-neutral-400 border-b border-neutral-700">
              <th className="py-2 pr-6">Name</th>
              <th className="py-2 pr-6">Role</th>
              <th className="py-2 pr-6">Rate / hr</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors">
                <td className="py-3 pr-6">
                  <p className="text-white font-medium">{emp.name}</p>
                  <p className="text-neutral-500 text-xs">{emp.email}</p>
                </td>
                <td className="py-3 pr-6"><RoleBadge role={emp.role} /></td>
                <td className="py-3 pr-6 text-neutral-400">
                  {emp.hourlyRate > 0 ? `$${emp.hourlyRate}/hr` : <span className="text-neutral-600 text-xs">not set</span>}
                </td>
                <td className="py-3">
                  <button
                    onClick={() => navigate(`/admin/employees/${emp._id}/payroll`)}
                    className="bg-neutral-800 border border-neutral-700 px-3 py-1 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-neutral-700 transition"
                  >
                    Payroll
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
