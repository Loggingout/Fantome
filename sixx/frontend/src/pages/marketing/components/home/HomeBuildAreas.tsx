import { motion } from "framer-motion";

import { homepageAreas } from "../../data/homepage.data";

const cardReveal = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: index * 0.1,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

export default function HomeBuildAreas() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {homepageAreas.map(
          ({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-neutral-800
                bg-neutral-900
                p-7
                transition-all
                duration-300
                hover:border-neutral-700
              "
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardReveal}
              custom={index}
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-neutral-700
                  bg-neutral-800
                "
              >
                <Icon className="h-5 w-5 text-neutral-300" />
              </div>

              <h3 className="mt-7 text-lg font-semibold text-white">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                {text}
              </p>

              <div className="mt-7 h-px w-10 bg-neutral-700 transition-all duration-300 group-hover:w-16" />
            </motion.article>
          ),
        )}
      </div>
    </section>
  );
}