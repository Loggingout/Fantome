import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageContainer, { SectionHeader, DashCard } from "../../../components/layout/PageContainer";

export default function SettingsIndex() {
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
      <SectionHeader title="Admin Settings" />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        {[
          { title: "Admin Profile", desc: "Update your personal admin details.", link: "profile" },
          { title: "Company Settings", desc: "Manage company-wide preferences.", link: "company" },
          { title: "Create Employee", desc: "Add new employees to the system.", link: "create-employee" },
          { title: "Delete Employee", desc: "Remove employees safely.", link: "delete-employee" },
          { title: "Manage Roles", desc: "Assign or update employee roles.", link: "manage-roles" },
          { title: "System Preferences", desc: "Configure global system settings.", link: "system" },
        ].map((item, i) => (
          <DashCard key={i}>
            <h3 className="text-white text-lg font-semibold">{item.title}</h3>
            <p className="text-neutral-500 text-sm">{item.desc}</p>
            <Link
              to={`/admin/settings/${item.link}`}
              className="text-blue-400 text-sm mt-3 inline-block hover:text-blue-300"
            >
              Open →
            </Link>
          </DashCard>
        ))}
      </motion.div>
    </PageContainer>
  );
}
