import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";

import { newsletterSignup } from "../../../data/newsletter.data";
import { subscribeToBlogUpdates } from "../../../../../services/marketingService";

const fadeUp = {
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

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const message = await subscribeToBlogUpdates(email);
      setFeedback({ type: "success", message });
      setEmail("");
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Unable to subscribe right now." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        className="
          mx-auto
          max-w-4xl
          rounded-3xl
          border
          border-neutral-800
          bg-neutral-900
          p-8
          sm:p-10
        "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800">
            <Mail className="h-5 w-5 text-neutral-300" />
          </div>

          <span className="mt-6 block text-xs tracking-widest uppercase text-neutral-500">
            {newsletterSignup.eyebrow}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
            {newsletterSignup.title}
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
            {newsletterSignup.description}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-2xl"
        >
          <label
            htmlFor="newsletter-email"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            {newsletterSignup.emailLabel}
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="newsletter-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={newsletterSignup.emailPlaceholder}
              autoComplete="email"
              required
              className="
                min-w-0
                flex-1
                rounded-xl
                border
                border-neutral-800
                bg-neutral-950
                px-4
                py-3
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-neutral-600
                focus:border-neutral-600
              "
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-neutral-700
                bg-neutral-800
                px-5
                py-3
                text-sm
                font-medium
                text-white
                transition-all
                duration-300
                hover:border-neutral-600
                hover:bg-neutral-700
              "
            >
              {isSubmitting ? "Subscribing..." : newsletterSignup.buttonLabel}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
          {feedback && (
            <p role={feedback.type === "error" ? "alert" : "status"} className={`mt-3 text-sm ${feedback.type === "error" ? "text-red-300" : "text-emerald-300"}`}>
              {feedback.message}
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}