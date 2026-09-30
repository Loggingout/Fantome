import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { newsletterFaqs } from "../../../data/newsletter.data";

export default function NewsletterFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-10">
        <span className="text-xs tracking-widest uppercase text-neutral-500">
          Newsletter FAQ
        </span>

        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
          Before You Subscribe
        </h2>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
          A few things to know about staying connected with Fantome
          Technologies.
        </p>
      </div>

      <div className="border-t border-neutral-800">
        {newsletterFaqs.map(({ question, answer }, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={question}
              className="border-b border-neutral-800"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-6
                  py-5
                  text-left
                  cursor-pointer
                "
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-medium text-white">
                  {question}
                </span>

                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 pr-10 text-sm leading-relaxed text-neutral-400">
                      {answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}