import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import StudioImg from "../../../../../assets/ft-studio.png";
import { aboutTrustStats } from "../../../data/about.data";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

export default function AboutCompanySection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Company Philosophy */}
        <motion.div
          className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8 flex flex-col justify-between"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2 rounded-xl bg-neutral-700/50">
                <Code2 className="w-5 h-5 text-neutral-300" />
              </span>

              <h3 className="text-base font-semibold text-white tracking-wide">
                Built With Purpose
              </h3>
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed">
              Fantome Technologies is focused on building and operating
              technology from within. Our work centers around in-house SaaS
              and PaaS products, the infrastructure behind them, and the
              systems needed to support their continued growth.
            </p>

            <p className="text-neutral-400 text-sm leading-relaxed mt-4">
              Our approach is simple: build for the consumer, scale for the
              consumer, and listen to the consumer. Every product gives us an
              opportunity to learn, improve, and build technology that can
              serve people at a larger scale.
            </p>
          </div>

          {/* Company Stats */}
          <div className="mt-8 pt-6 border-t border-neutral-700 flex flex-wrap gap-x-8 gap-y-5">
            {aboutTrustStats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-white text-xl font-bold">{value}</p>
                <p className="text-neutral-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Studio Image */}
        <motion.div
          className="rounded-2xl overflow-hidden min-h-[260px]"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <img
            src={StudioImg}
            alt="Fantome Technologies Studio"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}