import Sidebar from "./Sidebar";
import EmployeeHeader from "./EmployeeHeader";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="w-full h-screen flex bg-neutral-950 text-white"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <EmployeeLayout>
          <h2 className="text-white">Employee Dashboard</h2>
        </EmployeeLayout>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
