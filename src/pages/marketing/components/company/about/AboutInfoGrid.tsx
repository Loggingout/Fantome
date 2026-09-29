import { motion } from "framer-motion";
import { aboutInfoItems } from "../../../data/about.data";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: index * 0.1,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

export default function AboutInfoGrid() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs tracking-widest uppercase text-neutral-500">
          At a Glance
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
          Inside Fantome Technologies
        </h2>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
          A look at the company, what we build, and the direction behind the
          Fantome Technologies ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {aboutInfoItems.map(({ icon: Icon, title, text }, index) => (
          <motion.article
            key={title}
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border border-neutral-800
              bg-neutral-900/80
              p-6
              transition-all
              duration-300
              hover:border-neutral-700
              hover:bg-neutral-900
            "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            custom={index}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="flex items-start gap-4">
              <span
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border border-neutral-700
                  bg-neutral-800
                "
              >
                <Icon className="h-5 w-5 text-neutral-300" />
              </span>

              <div>
                <h3 className="text-base font-semibold tracking-wide text-white">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                  {text}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}