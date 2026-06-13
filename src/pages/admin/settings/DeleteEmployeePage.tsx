import { motion } from "framer-motion";
import PageContainer, { SectionHeader, DashCard } from "../../../components/layout/PageContainer";

export default function DeleteEmployeePage() {
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
      <SectionHeader title="Delete Employee" />

      <motion.div
        className="max-w-xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <DashCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Remove Employee</h3>

          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Employee Email"
              className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white"
            />

            <button className="bg-red-600 text-white rounded-xl py-3 font-semibold hover:bg-red-500 transition">
              Delete Employee
            </button>
          </div>
        </DashCard>
      </motion.div>
    </PageContainer>
  );
}
