import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Star,
  Wrench,
  ChevronDown,
  ChevronUp,
  UserCircle,
} from "lucide-react";
import { useUser } from "../context/UserContext";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { label: string; path: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    label: "Analytics",
    icon: FileText,
    children: [
      { label: "Attendance & Payroll", path: "/admin/analytics" },
      { label: "Task Performance", path: "/admin/analytics/tasks" },
    ],
  },
  {
    label: "Employees",
    icon: Users,
    children: [
      { label: "All Employees", path: "/admin/employees" },
      { label: "Add Employee", path: "/admin/employees/add" },
      { label: "Employee Roles", path: "/admin/employees/roles" },
      { label: "Employee Tasks", path: "/admin/employees/tasks" },
      { label: "Upcoming Shifts", path: "/admin/employees/shifts" },
    ],
  },
  {
    label: "Leave",
    icon: UserCircle,
    children: [
      { label: "Leave Dashboard", path: "/admin/leave" },
      { label: "Requests", path: "/admin/leave/requests" },
      { label: "Policies", path: "/admin/leave/policies" },
    ],
  },
  {
    label: "Blog Posts",
    icon: FileText,
    path: "/admin/blog",
  },
  {
    label: "Testimonials",
    icon: Star,
    path: "/admin/testimonials",
  },
  {
    label: "Services",
    icon: Wrench,
    children: [
      { label: "All Services", path: "/admin/services" },
      { label: "Pricing", path: "/admin/services/pricing" },
    ],
  },
  {
    label: "Clients",
    icon: Users,
    path: "/admin/clients",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    path: "/admin/messages",
  },
];


const BOTTOM_ITEMS: NavItem[] = [
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Admin Profile", path: "/admin/settings/profile" },
      { label: "Company Settings", path: "/admin/settings/company" },
      { label: "Create Employee", path: "/admin/settings/create-employee" },
      { label: "Delete Employee", path: "/admin/settings/delete-employee" },
      { label: "Manage Roles", path: "/admin/settings/manage-roles" },
      { label: "System Preferences", path: "/admin/settings/system" },
    ],
  },
  { label: "My Profile", icon: UserCircle, path: "/admin/profile" },
];


export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUser();

  const isActive = (path?: string) =>
    path ? location.pathname === path : false;

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const NavRow = ({
    item,
    depth = 0,
  }: {
    item: NavItem;
    depth?: number;
  }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    const isOpen = openGroups.includes(item.label);
    const hasChildren = !!item.children?.length;

    return (
      <>
        <button
          onClick={() => {
            if (hasChildren) toggleGroup(item.label);
            else if (item.path) navigate(item.path);
          }}
          title={collapsed ? item.label : undefined}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm font-medium transition-all duration-200 group relative
            ${depth > 0 ? "pl-8" : ""}
            ${
              active
                ? "bg-neutral-800 text-white border border-neutral-700"
                : "text-neutral-400 hover:bg-neutral-800/60 hover:text-white"
            }
          `}
        >
          {/* Active left bar */}
          {active && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-red-500" />
          )}

          <Icon className={`shrink-0 ${collapsed ? "w-5 h-5" : "w-4 h-4"}`} />

          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {hasChildren && (
                isOpen
                  ? <ChevronUp className="w-3.5 h-3.5 text-neutral-600" />
                  : <ChevronDown className="w-3.5 h-3.5 text-neutral-600" />
              )}
            </>
          )}

          {/* Tooltip when collapsed */}
          {collapsed && (
            <span className="
              absolute left-full ml-3 px-2.5 py-1 rounded-lg
              bg-neutral-800 border border-neutral-700
              text-white text-xs whitespace-nowrap
              opacity-0 group-hover:opacity-100 pointer-events-none
              transition-opacity duration-150 z-50
            ">
              {item.label}
            </span>
          )}
        </button>

        {/* Children */}
        {hasChildren && isOpen && !collapsed && (
          <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-neutral-800 pl-3">
            {item.children!.map((child) => (
              <button
                key={child.path}
                onClick={() => navigate(child.path)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-xs font-medium
                  transition-all duration-150
                  ${
                    location.pathname === child.path
                      ? "text-white"
                      : "text-neutral-500 hover:text-neutral-300"
                  }
                `}
              >
                {child.label}
              </button>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <aside
      className={`
        flex flex-col h-screen sticky top-0
        bg-neutral-950 border-r border-neutral-800
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-[220px]"}
      `}
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* ── Top: Logo + Toggle ── */}
      <div className={`flex items-center px-4 py-5 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <span className="text-white text-sm font-bold tracking-widest uppercase">
            Fantome
          </span>
        )}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <ChevronLeft className="w-4 h-4" />
          }
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-neutral-800 mb-3" />

      {/* ── Main Nav ── */}
      <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => (
          <NavRow key={item.label} item={item} />
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-neutral-800 mt-3" />

      {/* ── Bottom Nav ── */}
      <div className="flex flex-col gap-1 px-3 py-3">
        {BOTTOM_ITEMS.map((item) => (
          <NavRow key={item.label} item={item} />
        ))}

        {/* Sign Out */}
        <button
          onClick={async () => { await logout(); navigate("/login"); }}
          title={collapsed ? "Sign Out" : undefined}
          className="
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm font-medium text-neutral-500
            hover:bg-neutral-800/60 hover:text-red-400
            transition-all duration-200 group relative mt-1
          "
        >
          <LogOut className={`shrink-0 ${collapsed ? "w-5 h-5" : "w-4 h-4"}`} />
          {!collapsed && <span>Sign Out</span>}
          {collapsed && (
            <span className="
              absolute left-full ml-3 px-2.5 py-1 rounded-lg
              bg-neutral-800 border border-neutral-700
              text-white text-xs whitespace-nowrap
              opacity-0 group-hover:opacity-100 pointer-events-none
              transition-opacity duration-150 z-50
            ">
              Sign Out
            </span>
          )}
        </button>
      </div>

      {/* ── User Profile ── */}
      <div className="mx-4 h-px bg-neutral-800" />
      <div className={`flex items-center gap-3 px-4 py-4 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-full bg-neutral-700 border border-neutral-600 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">FT</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white text-xs font-semibold truncate">Admin</p>
            <p className="text-neutral-500 text-xs truncate">Fantome Technologies</p>
          </div>
        )}
      </div>
    </aside>
  );
}