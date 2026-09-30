import { useEffect, useState } from "react";
import api from "../../utils/api";

interface Employee {
  _id: string;
  name: string;
  role: string;
}

export default function EmployeeCard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/employees")
      .then((res) => setEmployees(res.data.employees.slice(0, 5)))
      .catch((err) => console.error("EmployeeCard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <div
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-3 shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <p className="text-neutral-500 text-xs tracking-widest uppercase">
        Employees
      </p>

      {loading ? (
        <p className="text-neutral-500 text-sm">Loading...</p>
      ) : employees.length === 0 ? (
        <p className="text-neutral-500 text-sm">No employees found.</p>
      ) : (
        <div className="mt-2 space-y-3">
          {employees.map((emp) => (
            <div key={emp._id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-700 border border-neutral-600 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">{initials(emp.name)}</span>
              </div>
              <div>
                <p className="text-sm text-white font-medium">{emp.name}</p>
                <p className="text-xs text-neutral-500">{emp.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
