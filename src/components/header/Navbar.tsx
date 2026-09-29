import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AboutUsButton from "../buttons/AboutUsButton";
import EcosystemButton from "../buttons/EcosystemButton";
import PlatformButton from "../buttons/PlatformButton";
import LoginButton from "../buttons/LoginButton";

import Logo from "/new-logo.png";

interface NavbarProps {
  
}

export default function Navbar({
  
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="relative z-20 px-4 sm:px-6 py-4 max-w-7xl mx-auto">
      <div
        className="
          flex items-center justify-between
          px-4 sm:px-6 py-3
          rounded-2xl
          bg-white/10
          backdrop-blur-md
          border border-white/20
          shadow-[0_4px_24px_rgba(0,0,0,0.18)]
        "
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center cursor-pointer shrink-0"
          aria-label="Go to homepage"
        >
          <img
            src={Logo}
            alt="Fantome Technologies Logo"
            className="h-10 w-auto rounded-xl"
          />
        </button>

        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <AboutUsButton onClick={() => navigate("/about")} />

          <EcosystemButton onClick={() => navigate("/ecosystem")} />

          <PlatformButton onClick={() => navigate("/platforms")} />
        </div>

        <div className="hidden md:flex items-center min-w-[120px] justify-end">
          <LoginButton onClick={() => navigate("/login")} />
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg hover:bg-black/10 transition"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      <div
        className={`
          md:hidden transition-all duration-300 ease-out overflow-hidden
          ${
            menuOpen ? "max-h-screen opacity-100 mt-2" : "max-h-0 opacity-0"
          }
        `}
      >
        <div
          className="
            flex flex-col gap-3
            bg-white/10 backdrop-blur-md
            border border-white/20
            shadow-[0_4px_24px_rgba(0,0,0,0.18)]
            rounded-2xl px-6 py-5 mt-1
          "
        >
          <AboutUsButton
            onClick={() => {
              setMenuOpen(false);
              navigate("/about");
            }}
          />

          <EcosystemButton
            onClick={() => {
              setMenuOpen(false);
              navigate("/ecosystem");
            }}
          />

          <PlatformButton
            onClick={() => {
              setMenuOpen(false);
              navigate("/platforms");
            }}
          />

          <LoginButton
            onClick={() => {
              setMenuOpen(false);
              navigate("/login");
            }}
          />
        </div>
      </div>
    </nav>
  );
}
