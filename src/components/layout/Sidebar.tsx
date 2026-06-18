import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Clock,
  HeartPulse,
  FilePlus2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useUser } from "../context/UserContext";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: Home, path: "/employee" },
  { label: "Schedule", icon: Calendar, path: "/employee/schedule" },
  { label: "Sick Leave", icon: HeartPulse, path: "/employee/sick-leave" },
  { label: "Time Clock", icon: Clock, path: "/employee/time-clock" },
  { label: "Time Off Request", icon: FilePlus2, path: "/employee/time-off" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUser();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`
        h-screen sticky top-0 flex flex-col
        bg-neutral-950 border-r border-neutral-800
        transition-all duration-300
        ${collapsed ? "w-[70px]" : "w-[220px]"}
      `}
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Header */}
      <div
        className={`
          flex items-center px-4 py-5
          ${collapsed ? "justify-center" : "justify-between"}
        `}
      >
        {!collapsed && (
          <span className="text-white text-sm font-bold tracking-widest uppercase">
            Employee
          </span>
        )}

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="mx-4 h-px bg-neutral-800 mb-3" />

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-200 group relative
                ${
                  active
                    ? "bg-neutral-800 text-white border border-neutral-700"
                    : "text-neutral-400 hover:bg-neutral-800/60 hover:text-white"
                }
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-red-500" />
              )}

              <Icon className={`shrink-0 ${collapsed ? "w-5 h-5" : "w-4 h-4"}`} />

              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}

              {collapsed && (
                <span
                  className="
                    absolute left-full ml-3 px-2.5 py-1 rounded-lg
                    bg-neutral-800 border border-neutral-700
                    text-white text-xs whitespace-nowrap
                    opacity-0 group-hover:opacity-100 pointer-events-none
                    transition-opacity duration-150 z-50
                  "
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="mt-auto mx-4 h-px bg-neutral-800" />
      <div className="flex flex-col gap-1 px-3 py-3">
        <button
          onClick={async () => { await logout(); navigate("/login"); }}
          title={collapsed ? "Sign Out" : undefined}
          className="
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm font-medium text-neutral-500
            hover:bg-neutral-800/60 hover:text-red-400
            transition-all duration-200 group relative
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
      <div className="mx-4 h-px bg-neutral-800" />
      <div
        className={`
          flex items-center gap-3 px-4 py-4
          ${collapsed ? "justify-center" : ""}
        `}
      >
        <div className="w-8 h-8 rounded-full bg-neutral-700 border border-neutral-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">EMP</span>
        </div>

        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white text-xs font-semibold truncate">Employee</p>
            <p className="text-neutral-500 text-xs truncate">Fantome Technologies</p>
          </div>
        )}
      </div>
    </aside>
  );
}
