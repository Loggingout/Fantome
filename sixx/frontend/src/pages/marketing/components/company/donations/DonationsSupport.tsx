import { motion } from "framer-motion";

import { donationSupportOptions } from "../../../data/donations.data";
import DonationSupportCard from "./DonationSupportCard";

const sectionReveal = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

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

export default function DonationsSupport() {
  return (
    <section id="direct-support" className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        className="max-w-2xl mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionReveal}
      >
        <span className="text-xs tracking-widest uppercase text-neutral-500">
          Direct Support
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
          Support Fantome Technologies
        </h2>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
          Direct support is used to help maintain the company, the people
          behind it, and the technology required to keep our ecosystem
          operating and growing.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {donationSupportOptions.map(
          ({ id, title, description }, index) => (
            <motion.div
              key={id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardReveal}
              custom={index}
            >
              <DonationSupportCard
                number={`0${index + 1}`}
                title={title}
                description={description}
              />
            </motion.div>
          ),
        )}
      </div>
    </section>
  );
}