import { useEffect, useState } from "react";
import api from "../../utils/api";
import RoleBadge from "../status/RoleBadge";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  hourlyRate: number;
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/employees")
      .then((res) => setEmployees(res.data.employees ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 overflow-x-auto">
      <h2 className="text-xl font-serif text-white mb-4">Employees</h2>

      {loading ? (
        <p className="text-neutral-500 text-sm py-6 text-center">Loading…</p>
      ) : employees.length === 0 ? (
        <p className="text-neutral-500 text-sm py-6 text-center">No employees found.</p>
      ) : (
        <table className="w-full min-w-120 text-left text-sm">
          <thead>
            <tr className="text-neutral-400 border-b border-neutral-700">
              <th className="py-2 pr-6">Name</th>
              <th className="py-2 pr-6">Email</th>
              <th className="py-2 pr-6">Role</th>
              <th className="py-2">Rate / hr</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e._id} className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors">
                <td className="py-3 pr-6 text-white font-medium">{e.name}</td>
                <td className="py-3 pr-6 text-neutral-400">{e.email}</td>
                <td className="py-3 pr-6"><RoleBadge role={e.role} /></td>
                <td className="py-3 text-neutral-300">
                  {e.hourlyRate > 0 ? `$${e.hourlyRate}/hr` : <span className="text-neutral-600 text-xs">not set</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}