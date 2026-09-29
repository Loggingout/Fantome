import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import LoginButton from "../buttons/LoginButton";
import Logo from "/new-logo.png";

interface NavbarProps {
  onBookNow?: () => void;
  onAboutUs?: () => void;
  onRequestQuote?: () => void;
  onTestimonial?: () => void;
}

interface NavbarItem {
  label: string;
  to: string;
  onSelect?: () => void;
}

const linkStyle = (active: boolean, compact = false) =>
  `inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    compact ? "w-full justify-start" : "justify-center"
  } ${
    active
      ? "bg-neutral-100 text-neutral-950"
      : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
  }`;

export default function Navbar({
  onAboutUs,
  onTestimonial,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const mainItems: NavbarItem[] = [
    { label: "About Us", to: "/about", onSelect: onAboutUs },
    { label: "Ecosystem", to: "/ecosystem" },
    { label: "Platforms", to: "/platforms" },
    { label: "The Mission", to: "/the-mission" }
  ];

  const moreItems: NavbarItem[] = [
    { label: "Donations", to: "/donations" },
    { label: "Contact", to: "/contact" },
    { label: "Growth and Impact", to: "/FourOFour" },
    { label: "Join the Team", to: "/join-the-team" },
    { label: "Making a Difference", to: "/making-a-difference" },
    { label: "Status", to: "/FourOFour" },
  ];

  const closeMenus = () => {
    setMenuOpen(false);
    setMoreOpen(false);
  };

  useEffect(() => {
    if (!menuOpen && !moreOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) closeMenus();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenus();
    };
    const handlePopState = () => closeMenus();

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [menuOpen, moreOpen]);

  const renderItem = (item: NavbarItem, compact = false) => {
    if (item.onSelect) {
      return (
        <button
          key={item.label}
          type="button"
          onClick={() => {
            closeMenus();
            item.onSelect?.();
          }}
          className={linkStyle(location.pathname === item.to, compact)}
        >
          {item.label}
        </button>
      );
    }

    return (
      <NavLink
        key={item.label}
        to={item.to}
        onClick={closeMenus}
        className={({ isActive }) => linkStyle(isActive, compact)}
      >
        {item.label}
      </NavLink>
    );
  };

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className="relative z-50 mx-auto max-w-7xl px-4 py-4 sm:px-6"
    >
      <div className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white/95 px-4 shadow-[0_8px_30px_rgba(15,23,42,0.14)] backdrop-blur-md sm:px-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex shrink-0 items-center"
          aria-label="Go to homepage"
        >
          <img
            src={Logo}
            alt="Fantome Technologies"
            className="h-10 w-auto rounded-lg"
          />
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {mainItems.map((item) => renderItem(item))}

          <div className="relative">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((open) => !open)}
              className={linkStyle(moreOpen || moreItems.some((item) => item.to === location.pathname))}
            >
              More
              <ChevronDown
                aria-hidden="true"
                className={`ml-1 h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
                {moreItems.map((item) => renderItem(item, true))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <LoginButton onClick={() => navigate("/login")} />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-neutral-800 transition-colors hover:bg-neutral-100 lg:hidden"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="mt-2 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {mainItems.map((item) => renderItem(item, true))}

            <button
              type="button"
              aria-expanded={moreOpen}
              aria-controls="mobile-more-links"
              onClick={() => setMoreOpen((open) => !open)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
            >
              More
              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>

            {moreOpen && (
              <div id="mobile-more-links" className="ml-3 border-l border-neutral-200 pl-2">
                {moreItems.map((item) => renderItem(item, true))}
              </div>
            )}

            <div className="px-2 py-2">
              <LoginButton
                onClick={() => {
                  closeMenus();
                  navigate("/login");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
