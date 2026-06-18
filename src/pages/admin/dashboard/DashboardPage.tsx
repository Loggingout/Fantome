// src/pages/admin/dashboard/DashboardPage.tsx
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import PageContainer, { SectionHeader } from "../../../components/layout/PageContainer";
import api from "../../../utils/api";

import StatsCard from "../../../components/cards/StatsCard";
import AnalyticsCard from "../../../components/cards/AnalyticsCard";
import ActivityCard from "../../../components/cards/ActivityCard";
import EmployeeCard from "../../../components/cards/EmployeeCard";
import BlogCard from "../../../components/cards/BlogCard";

interface Stats {
  totalEmployees: number;
  newHires: number;
  pendingTasks: number;
  completedTasks: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api
      .get("/admin/dashboard/stats")
      .then((res) => setStats(res.data.stats))
      .catch((err) => console.error("Dashboard stats error:", err));
  }, []);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] },
    }),
  };

  return (
    <PageContainer
      statCards={
        <>
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
            <StatsCard label="Total Employees" value={stats ? String(stats.totalEmployees) : "—"} sub="Active staff" trend={{ value: "live", up: true }} />
          </motion.div>
          <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible">
            <StatsCard label="New Hires" value={stats ? String(stats.newHires) : "—"} sub="Last 30 days" trend={{ value: "live", up: true }} />
          </motion.div>
          <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible">
            <StatsCard label="Pending Tasks" value={stats ? String(stats.pendingTasks) : "—"} sub="Awaiting action" trend={{ value: stats && stats.pendingTasks > 0 ? "open" : "clear", up: false }} />
          </motion.div>
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible">
            <StatsCard label="Completed Tasks" value={stats ? String(stats.completedTasks) : "—"} sub="All time" trend={{ value: "live", up: true }} />
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
