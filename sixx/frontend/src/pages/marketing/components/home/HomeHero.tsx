import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../../../components/header/Navbar";
import HeroImage from "../../../../assets/dashboard-display.png";
import { homepageHero } from "../../data/homepage.data";

const heroVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.25,
      duration: 0.8,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

export default function HomeHero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 blur-[2px]">
        <img
          src={HeroImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative z-20">
        <Navbar />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-20">
        <div className="max-w-5xl text-center">
          <motion.span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-white/20
              bg-white/10
              px-4
              py-1.5
              text-xs
              font-medium
              uppercase
              tracking-[0.2em]
              text-neutral-200
              backdrop-blur-md
            "
            variants={heroVariants}
            custom={0}
            initial="hidden"
            animate="visible"
          >
            {homepageHero.eyebrow}
          </motion.span>

          <motion.h1
            className="
              mt-6
              text-5xl
              font-bold
              leading-tight
              text-white
              sm:text-6xl
              md:text-7xl
            "
            variants={heroVariants}
            custom={1}
            initial="hidden"
            animate="visible"
          >
            Building Technology{" "}
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              for the Consumer
            </span>
          </motion.h1>

          <motion.p
            className="
              mx-auto
              mt-6
              max-w-3xl
              text-lg
              leading-relaxed
              text-gray-200
              md:text-2xl
            "
            variants={heroVariants}
            custom={2}
            initial="hidden"
            animate="visible"
          >
            {homepageHero.description}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            variants={heroVariants}
            custom={3}
            initial="hidden"
            animate="visible"
          >
            <Link
              to={homepageHero.primaryAction.href}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-white/20
                bg-white/10
                px-6
                py-3
                text-sm
                font-medium
                text-white
                shadow-[0_4px_24px_rgba(0,0,0,0.18)]
                backdrop-blur-md
                transition-all
                duration-300
                hover:bg-white/15
              "
            >
              {homepageHero.primaryAction.label}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to={homepageHero.secondaryAction.href}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-white/10
                bg-black/20
                px-6
                py-3
                text-sm
                font-medium
                text-neutral-200
                backdrop-blur-md
                transition-all
                duration-300
                hover:border-white/20
                hover:text-white
              "
            >
              {homepageHero.secondaryAction.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}