export default function EmployeeList() {
  const employees = [
    { id: 1, name: "John Doe", role: "Employee", status: "Active" },
    { id: 2, name: "Sarah Lee", role: "Admin", status: "Active" },
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 overflow-x-auto">
      <h2 className="text-xl font-serif text-white mb-4">Employee List</h2>

      <table className="w-full text-left text-white min-w-[600px]">
        <thead>
          <tr className="text-neutral-400 text-sm border-b border-neutral-700">
            <th className="py-2">Name</th>
            <th className="py-2">Role</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b border-neutral-800">
              <td className="py-3">{emp.name}</td>
              <td className="py-3">{emp.role}</td>
              <td className="py-3">{emp.status}</td>
              <td className="py-3">
                <button className="bg-neutral-800 border border-neutral-700 px-3 py-1 rounded-lg hover:bg-neutral-700 transition">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
