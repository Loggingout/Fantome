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
import EmployeeMyPayoutPage from "./pages/employee/MyPayoutPage";
import EmployeeNotificationsPage from "./pages/employee/NotificationsPage";
import LeaveBalancePage from "./pages/employee/LeaveBalancePage";
import MyLeaveRequestsPage from "./pages/employee/MyLeaveRequestsPage";

// Admin Modules
import DashboardPage from "./pages/admin/dashboard/DashboardPage";
import AnalyticsPage from "./pages/admin/analytics/AnalyticsPage";
import TaskAnalyticsPage from "./pages/admin/analytics/TaskAnalyticsPage";
import EmployeeManagementPage from "./pages/admin/employees/EmployeeManagementPage";
import AddEmployeePage from "./pages/admin/employees/AddEmployeePage";
import EmployeeRolesPage from "./pages/admin/employees/EmployeeRolesPage";
import EmployeeTasksPage from "./pages/admin/employees/EmployeeTasksPage";
import UpcomingShiftsPage from "./pages/admin/employees/UpcomingShiftsPage";
import PayrollHistoryPage from "./pages/admin/employees/PayrollHostoryPage";
import EmployeePayrollDetailPage from "./pages/admin/employees/EmployeePayrollDetailPage";
import PayoutSchedulePage from "./pages/admin/employees/PayoutSchedulePage";
import BlogManagementPage from "./pages/admin/blog/BlogManagementPage";
import PermissionsPage from "./pages/admin/permissions/PermissionsPage";
import CompanySettingsPage from "./pages/admin/settings/CompanySettingsPage";
import AdminProfilePage from "./pages/admin/settings/AdminProfilePage";
import LeaveDashboardPage from "./pages/admin/leave/LeaveDashboardPage";
import LeaveRequestsPage from "./pages/admin/leave/LeaveRequestsPage";
import LeavePoliciesPage from "./pages/admin/leave/LeavePoliciesPage";
import LeaveBalancesPage from "./pages/admin/leave/LeaveBalancesPage";
import SettingsIndex from "./pages/admin/settings/index";
import SettingsProfile from "./pages/admin/settings/AdminProfilePage";
import SettingsCompany from "./pages/admin/settings/CompanySettingsPage";
import SettingsCreateEmployee from "./pages/admin/settings/CreateEmployeePage";
import SettingsDeleteEmployee from "./pages/admin/settings/DeleteEmployeePage";
import SettingsManageRoles from "./pages/admin/settings/ManageRolesPage";
import SettingsSystem from "./pages/admin/settings/SystemsPreferencesPage";
import ServicesManagementPage from "./pages/admin/services/ServicesManagementPage";
import ServicesPricingPage from "./pages/admin/services/ServicesPricingPage";

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
          <Route path="analytics/tasks" element={<TaskAnalyticsPage />} />
          <Route path="employees" element={<EmployeeManagementPage />} />
          <Route path="employees/add" element={<AddEmployeePage />} />
          <Route path="employees/roles" element={<EmployeeRolesPage />} />
          <Route path="employees/tasks" element={<EmployeeTasksPage />} />
          <Route path="employees/shifts" element={<UpcomingShiftsPage />} />
          <Route path="employees/payroll" element={<PayrollHistoryPage />} />
          <Route path="employees/:employeeId/payroll" element={<EmployeePayrollDetailPage />} />
          <Route path="employees/payout-schedule" element={<PayoutSchedulePage />} />
          <Route path="blog" element={<BlogManagementPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="settings" element={<CompanySettingsPage />} />
          <Route path="settings/profile" element={<AdminProfilePage />} />
          <Route path="leave" element={<LeaveDashboardPage />} />
          <Route path="leave/requests" element={<LeaveRequestsPage />} />
          <Route path="leave/policies" element={<LeavePoliciesPage />} />
          <Route path="leave/balances" element={<LeaveBalancesPage />} />
          <Route path="settings" element={<SettingsIndex />} />
          <Route path="settings/profile" element={<SettingsProfile />} />
          <Route path="settings/company" element={<SettingsCompany />} />
          <Route path="settings/create-employee" element={<SettingsCreateEmployee />} />
          <Route path="settings/delete-employee" element={<SettingsDeleteEmployee />} />
          <Route path="settings/manage-roles" element={<SettingsManageRoles />} />
          <Route path="settings/system" element={<SettingsSystem />} />
          <Route path="services" element={<ServicesManagementPage />} />
          <Route path="services/pricing" element={<ServicesPricingPage />} />
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
          <Route path="my-payout" element={<EmployeeMyPayoutPage />} />
          <Route path="notifications" element={<EmployeeNotificationsPage />} />
          <Route path="leave-balance" element={<LeaveBalancePage />} />
          <Route path="my-requests" element={<MyLeaveRequestsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<FourOFourPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
