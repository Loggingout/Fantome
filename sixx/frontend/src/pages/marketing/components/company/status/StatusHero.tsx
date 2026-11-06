import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function StatusHero() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950 px-4 py-5 text-white sm:rounded-t-[28px] sm:px-10 sm:py-7">
      <motion.div
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 sm:gap-5"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label="Fantome Technologies homepage"
        >
          <img
            src="/new-logo.png"
            alt="Fantome Technologies"
            className="h-9 w-auto object-contain sm:h-10"
          />

          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-wide text-white">
              Fantome Technologies
            </p>

            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Ecosystem Status
            </p>
          </div>
        </Link>

        <Link
          to="/newsletter"
          className="
            inline-flex
            shrink-0
            items-center
            gap-2
            rounded-lg
            border
            border-neutral-700
            bg-neutral-900
            px-3
            py-2.5
            text-xs
            font-semibold
            text-neutral-300
            transition-all
            duration-300
            hover:border-neutral-600
            hover:bg-neutral-800
            hover:text-white
            sm:px-4
          "
        >
          Get Updates
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    </header>
  );
}