// src/pages/admin/dashboard/DashboardPage.tsx
import { motion } from "framer-motion";
import PageContainer, { SectionHeader } from "../../../components/layout/PageContainer";

import StatsCard from "../../../components/cards/StatsCard";
import AnalyticsCard from "../../../components/cards/AnalyticsCard";
import ActivityCard from "../../../components/cards/ActivityCard";
import EmployeeCard from "../../../components/cards/EmployeeCard";
import BlogCard from "../../../components/cards/BlogCard";

export default function DashboardPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  return (
    <PageContainer
      statCards={
        <>
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
            <StatsCard label="Total Employees" value="42" sub="Active staff" trend={{ value: "+3%", up: true }} />
          </motion.div>
          <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible">
            <StatsCard label="New Hires" value="5" sub="Last 30 days" trend={{ value: "+12%", up: true }} />
          </motion.div>
          <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible">
            <StatsCard label="Departures" value="1" sub="Last 30 days" trend={{ value: "-4%", up: false }} />
          </motion.div>
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible">
            <StatsCard label="Avg. Performance" value="87%" sub="Team score" trend={{ value: "+2%", up: true }} />
          </motion.div>
        </>
      }
      primaryPanel={
        <motion.div
          className="flex flex-col gap-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
        >
          <SectionHeader title="Employee Analytics" />
          <AnalyticsCard />
        </motion.div>
      }
      secondaryPanel={
        <motion.div
          className="flex flex-col gap-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={5}
        >
          <SectionHeader title="Recent Activity" />
          <ActivityCard />

          <SectionHeader title="Top Employees" />
          <EmployeeCard />
        </motion.div>
      }
      tableSection={
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={6}
        >
          <SectionHeader title="Latest Blog Posts" />
          <BlogCard />
        </motion.div>
      }
    />
  );
}
