import { motion, type Variants } from "framer-motion";
import PageContainer, { SectionHeader, DashCard } from "../../components/layout/PageContainer";
import MyTaskList from "../../components/employee/tasks/MyTaskList";
import MyShifts from "../../components/employee/shifts/MyShifts";

export default function DashboardPage() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] },
    }),
  };

  return (
    <PageContainer>
      <SectionHeader title="Employee Dashboard" />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
      >
        {/* Attendance Summary */}
        <motion.div variants={fadeUp} custom={0}>
          <DashCard className="p-6">
            <h3 className="text-lg font-serif text-white mb-2">Today’s Status</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Quick overview of your attendance today.
            </p>

            <div className="flex flex-col gap-2">
              <p className="text-white"><span className="text-neutral-500">Clock In:</span> —</p>
              <p className="text-white"><span className="text-neutral-500">Clock Out:</span> —</p>
              <p className="text-white"><span className="text-neutral-500">Hours Worked:</span> 0h 00m</p>
            </div>
          </DashCard>
        </motion.div>

        {/* Upcoming Shift */}
        <motion.div variants={fadeUp} custom={1}>
          <DashCard className="p-6">
            <h3 className="text-lg font-serif text-white mb-2">Upcoming Shift</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Your next scheduled work shift.
            </p>
            <MyShifts />
          </DashCard>
        </motion.div>

        {/* Time Off Summary */}
        <motion.div variants={fadeUp} custom={2}>
          <DashCard className="p-6">
            <h3 className="text-lg font-serif text-white mb-2">Time Off Balance</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Overview of your available leave.
            </p>

            <div className="flex flex-col gap-2">
              <p className="text-white"><span className="text-neutral-500">PTO:</span> 0 days</p>
              <p className="text-white"><span className="text-neutral-500">Sick Leave:</span> 0 days</p>
            </div>
          </DashCard>
        </motion.div>

        {/* Payroll Snapshot */}
        <motion.div variants={fadeUp} custom={3}>
          <DashCard className="p-6">
            <h3 className="text-lg font-serif text-white mb-2">Payroll Snapshot</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Your most recent pay summary.
            </p>

            <p className="text-white">No payroll data available.</p>
          </DashCard>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={fadeUp} custom={4}>
          <DashCard className="p-6">
            <h3 className="text-lg font-serif text-white mb-4">Quick Actions</h3>

            <div className="flex flex-col gap-3">
              <a href="/employee/timeclock" className="bg-neutral-800 border border-neutral-700 rounded-xl py-3 text-center text-white hover:bg-neutral-700 transition">
                Go to Time Clock
              </a>
              <a href="/employee/schedule" className="bg-neutral-800 border border-neutral-700 rounded-xl py-3 text-center text-white hover:bg-neutral-700 transition">
                View Schedule
              </a>
              <a href="/employee/timeoff" className="bg-neutral-800 border border-neutral-700 rounded-xl py-3 text-center text-white hover:bg-neutral-700 transition">
                Request Time Off
              </a>
            </div>
          </DashCard>
        </motion.div>
      </motion.div>

      {/* My Tasks — full width below the cards */}
      <motion.div
        className="mt-6"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={5}
      >
        <DashCard className="p-6">
          <h3 className="text-lg font-serif text-white mb-4">My Tasks</h3>
          <MyTaskList />
        </DashCard>
      </motion.div>
    </PageContainer>
  );
}
