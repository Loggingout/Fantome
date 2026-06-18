import { AnimatePresence } from "motion/react";
import { Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/scroll/ScrollToTop";

// Marketing Pages
import LandingPage from "./pages/marketing/LandingPage";
import AboutUsPage from "./pages/marketing/AboutUsPage";
import ServicePage from "./pages/marketing/ServicesPage";
import RequestQuotePage from "./pages/marketing/RequestQuotePage";
import FourOFourPage from "./pages/errors/FourOFourPage";
import TestimonialPage from "./pages/marketing/TestimonialPage";
import BlogPage from "./pages/blog/BlogPage";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleGuard from "./components/auth/RoleGuard";

// Admin Layout
import DashboardLayout from "./components/layout/DashboardLayout";

// Employee Layout
import EmployeeLayout from "./components/layout/EmployeeLayout";

// Employee Pages
import EmployeeDashboardPage from "./pages/employee/DashboardPage";
import EmployeeProfilePage from "./pages/employee/EmployeeProfilePage";
import EmployeeSchedulePage from "./pages/employee/SchedulePage";
import EmployeeTimeClockPage from "./pages/employee/TimeClockPage";
import EmployeeTimeOffPage from "./pages/employee/TimeOffRequestPage";
import EmployeeSickLeavePage from "./pages/employee/SickLeavePage";
import EmployeePayHistoryPage from "./pages/employee/PayHistoryPage";

// Admin Modules
import DashboardPage from "./pages/admin/dashboard/DashboardPage";
import AnalyticsPage from "./pages/admin/analytics/AnalyticsPage";
import EmployeeManagementPage from "./pages/admin/employees/EmployeeManagementPage";
import EmployeeTasksPage from "./pages/admin/employees/EmployeeTasksPage";
import UpcomingShiftsPage from "./pages/admin/employees/UpcomingShiftsPage";
import BlogManagementPage from "./pages/admin/blog/BlogManagementPage";
import PermissionsPage from "./pages/admin/permissions/PermissionsPage";
import CompanySettingsPage from "./pages/admin/settings/CompanySettingsPage";
import AdminProfilePage from "./pages/admin/settings/AdminProfilePage";
import LeaveRequestPage from "./pages/admin/leave/LeaveRequestPage";
import SettingsIndex from "./pages/admin/settings/index";
import SettingsProfile from "./pages/admin/settings/AdminProfilePage";
import SettingsCompany from "./pages/admin/settings/CompanySettingsPage";
import SettingsCreateEmployee from "./pages/admin/settings/CreateEmployeePage";
import SettingsDeleteEmployee from "./pages/admin/settings/DeleteEmployeePage";
import SettingsManageRoles from "./pages/admin/settings/ManageRolesPage";
import SettingsSystem from "./pages/admin/settings/SystemsPreferencesPage";

function App() {
  return (
    <AnimatePresence>
      <ScrollToTop />

      <Routes>
        {/* Marketing Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/request-quote" element={<RequestQuotePage />} />
        <Route path="/FourOFour" element={<FourOFourPage />} />
        <Route path="/testimonials" element={<TestimonialPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ============================
            ADMIN ROUTES (Protected)
           ============================ */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["admin"]}>
                <DashboardLayout />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="employees" element={<EmployeeManagementPage />} />
          <Route path="employees/tasks" element={<EmployeeTasksPage />} />
          <Route path="employees/shifts" element={<UpcomingShiftsPage />} />
          <Route path="blog" element={<BlogManagementPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="settings" element={<CompanySettingsPage />} />
          <Route path="settings/profile" element={<AdminProfilePage />} />
          <Route path="leave" element={<LeaveRequestPage />} />
          <Route path="settings" element={<SettingsIndex />} />
          <Route path="settings/profile" element={<SettingsProfile />} />
          <Route path="settings/company" element={<SettingsCompany />} />
          <Route path="settings/create-employee" element={<SettingsCreateEmployee />} />
          <Route path="settings/delete-employee" element={<SettingsDeleteEmployee />} />
          <Route path="settings/manage-roles" element={<SettingsManageRoles />} />
          <Route path="settings/system" element={<SettingsSystem />} />
        </Route>

        {/* ============================
            EMPLOYEE ROUTES (Protected)
           ============================ */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["employee", "admin"]}>
                <EmployeeLayout />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeDashboardPage />} />
          <Route path="profile" element={<EmployeeProfilePage />} />
          <Route path="schedule" element={<EmployeeSchedulePage />} />
          <Route path="time-clock" element={<EmployeeTimeClockPage />} />
          <Route path="time-off" element={<EmployeeTimeOffPage />} />
          <Route path="sick-leave" element={<EmployeeSickLeavePage />} />
          <Route path="pay-history" element={<EmployeePayHistoryPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<FourOFourPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
