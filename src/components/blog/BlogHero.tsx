import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function BlogHero() {
  return (
    <motion.div
      className="pt-20 pb-12 text-center"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={0}
    >
      {/* Label pill */}
      <span className="inline-block mb-5 px-4 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs tracking-widest uppercase">
        Insights & Updates
      </span>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mb-5">
        The Fantome{" "}
        <span className="text-neutral-400 font-normal italic">Blog</span>
      </h1>

      <p className="text-neutral-400 text-lg max-w-xl mx-auto leading-relaxed">
        Tips, tutorials, and behind-the-scenes stories from our studio — built
        for founders who care about their digital presence.
      </p>

      {/* Divider */}
      <div className="mt-10 mx-auto w-16 h-px bg-neutral-700" />
    </motion.div>
  );
}