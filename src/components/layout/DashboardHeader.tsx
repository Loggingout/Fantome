import { Bell, Search } from "lucide-react";
import { useState } from "react";
import NotificationModal from "../modal/NotificationModal"; // adjust path

export default function DashboardHeader({
  pageTitle = "Dashboard",
  pageLabel = "Overview",
}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <header
        className="
          w-full bg-neutral-950 border-b border-neutral-800
          px-4 sm:px-6 lg:px-8 py-4
          flex items-center justify-between gap-4
        "
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        {/* Left */}
        <div className="flex flex-col min-w-0">
          <span className="text-neutral-600 text-xs tracking-widest uppercase mb-0.5 hidden sm:block">
            {pageLabel}
          </span>
          <h1 className="text-white text-lg sm:text-xl font-bold leading-tight truncate">
            {pageTitle}{" "}
            <span className="text-neutral-500 font-normal italic text-base hidden sm:inline">
              — {dateString}
            </span>
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search */}
          <div
            className={`
              hidden sm:flex items-center gap-2
              px-3 py-2 rounded-xl
              bg-neutral-900 border
              transition-all duration-200
              ${searchFocused ? "border-neutral-600 w-52" : "border-neutral-800 w-36"}
            `}
          >
            <Search className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="
                bg-transparent text-white text-xs w-full
                placeholder:text-neutral-600
                focus:outline-none
              "
            />
          </div>

          {/* Mobile search */}
          <button className="
            sm:hidden p-2 rounded-xl
            bg-neutral-900 border border-neutral-800
            text-neutral-500 hover:text-white hover:border-neutral-600
            transition-all duration-200
          ">
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(true)}
            className="
              relative p-2 rounded-xl
              bg-neutral-900 border border-neutral-800
              text-neutral-500 hover:text-white hover:border-neutral-600
              transition-all duration-200
            "
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-neutral-800" />

          {/* Avatar */}
          <div className="
            w-8 h-8 rounded-full
            bg-neutral-800 border border-neutral-700
            flex items-center justify-center shrink-0
          ">
            <span className="text-white text-xs font-bold">FT</span>
          </div>
        </div>
      </header>

      {/* Notification Modal */}
      {showNotifications && (
        <NotificationModal
          onClose={() => setShowNotifications(false)}
          onRead={() => {}}
        />
      )}
    </>
  );
}
