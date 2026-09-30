import { motion } from "framer-motion";

import { contactInquiryTypes } from "../../../data/contact.data";
import ContactInquiryCard from "./ContactInquiryCard";

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

export default function ContactInquiryGrid() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {contactInquiryTypes.map(({ icon, title, text }, index) => (
          <motion.div
            key={title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardReveal}
            custom={index}
          >
            <ContactInquiryCard
              icon={icon}
              title={title}
              text={text}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}