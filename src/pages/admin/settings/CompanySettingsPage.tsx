import { motion } from "framer-motion";
import PageContainer, { SectionHeader, DashCard } from "../../../components/layout/PageContainer";

export default function CompanySettingsPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  return (
    <PageContainer>
      <SectionHeader title="Company Settings" />

      <motion.div
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <DashCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">General Company Information</h3>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Company Name"
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
            />

            <input
              type="text"
              placeholder="Company Address"
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
            />

            <textarea
              placeholder="Company Description"
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white h-32 resize-none"
            />

            <button className="bg-white text-black rounded-xl py-3 font-semibold hover:bg-neutral-200 transition">
              Save Settings
            </button>
          </div>
        </DashCard>
      </motion.div>
    </PageContainer>
  );
}
