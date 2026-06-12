import { Outlet } from "react-router-dom";
import AdminSidebar from "../layout/AdminSidebar";
import DashboardHeader from "../layout/DashboardHeader";
import PageContainer from "../layout/PageContainer";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-neutral-900 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 max-h-screen overflow-y-auto">
        <DashboardHeader />

        {/* Scrollable content wrapper */}
        <div className="flex-1 overflow-y-auto">
          <PageContainer>
            <Outlet />
          </PageContainer>
        </div>
      </div>
    </div>
  );
}
