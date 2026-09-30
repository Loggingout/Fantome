import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import EmployeeHeader from "./EmployeeHeader";

export default function EmployeeLayout() {
  return (
    <div
      className="flex min-h-screen bg-neutral-950 text-white overflow-hidden"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 max-h-screen overflow-y-auto">
        {/* Header */}
        <EmployeeHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
