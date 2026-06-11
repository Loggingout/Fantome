import { Outlet } from "react-router-dom";
import AdminSidebar from "../layout/AdminSidebar";
import DashboardHeader from "../layout/DashboardHeader";
import PageContainer from "../layout/PageContainer";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-neutral-900">
      <AdminSidebar />

      <div className="flex flex-col flex-1">
        <DashboardHeader />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}
