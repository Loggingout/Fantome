import { motion } from "framer-motion";
import { Users } from "lucide-react";

import MeImg from "../../../../../assets/me.jpg";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

const slideIn = {
  hidden: {
    opacity: 0,
    x: 24,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function AboutTeamSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 pb-24">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-stretch">
        <motion.div
          className="
            relative
            min-h-[22rem]
            sm:min-h-[26rem]
            lg:min-h-[30rem]
            overflow-hidden
            rounded-3xl
            border border-neutral-800
            bg-neutral-900
          "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <motion.img
            src={MeImg}
            alt="Fantome Technologies"
            className="w-full h-full object-cover brightness-90"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/10 to-transparent pointer-events-none" />

          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-950/70 px-3 py-1.5 text-xs tracking-widest uppercase text-neutral-300 backdrop-blur-sm">
              <Users className="h-3.5 w-3.5" />
              Our People
            </span>
          </div>
        </motion.div>

        <motion.div
          className="
            rounded-3xl
            border border-neutral-800
            bg-neutral-900
            p-8
            sm:p-10
            flex flex-col justify-center
          "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={slideIn}
        >
          <span className="text-xs tracking-widest uppercase text-neutral-500">
            People & Opportunity
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white leading-tight">
            Building an Ecosystem{" "}
            <span className="text-neutral-400 font-normal italic">
              for People
            </span>
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-neutral-400">
            The products we build are only one part of the Fantome Technologies
            ecosystem. The people behind those products are just as important.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            As our ecosystem grows, we want to create opportunities for people
            who want to contribute to technology, security, product
            development, and the systems that support it.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            That includes experienced professionals, seniors, college
            graduates, and people with a genuine passion for building and
            improving technology.
          </p>

          <div className="mt-8 pt-6 border-t border-neutral-800">
            <p className="text-sm font-semibold text-white">
              Build the technology. Build the people. Build the ecosystem.
            </p>

            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              We believe a growing technology ecosystem should create room for
              both products and the people who help make them possible.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}