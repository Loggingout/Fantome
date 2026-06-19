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
  jobTitle?: string;
}

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

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

