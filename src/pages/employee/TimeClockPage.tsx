import { useEffect, useState } from "react";
import api from "../../utils/api";
import PageContainer, { SectionHeader, DashCard } from "../../components/layout/PageContainer";
import TimeTracker from "../../components/employee/attendance/TimeTracker";
import ClockInButton from "../../components/employee/attendance/ClockInButton";
import ClockOutButton from "../../components/employee/attendance/ClockOutButton";
import LunchBreakButton from "../../components/employee/attendance/LunchBreakButton";
import HoursWorkedCard from "../../components/employee/attendance/HoursWorkedCard";

interface Attendance {
  clockIn: string | null;
  clockOut: string | null;
  lunchStart: string | null;
  lunchEnd: string | null;
  status: "clocked-in" | "on-break" | "clocked-out" | null;
}

export default function TimeClockPage() {
  const [attendance, setAttendance] = useState<Attendance>({
    clockIn: null,
    clockOut: null,
    lunchStart: null,
    lunchEnd: null,
    status: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchToday = async () => {
    try {
      // Send the browser's local date so getToday looks up the correct record
      const localDate = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD"
      const res = await api.get(`/attendance/today?localDate=${localDate}`);
      if (res.data.attendance) {
        setAttendance(res.data.attendance);
      }
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  const isClockedIn = !!attendance.clockIn;
  const isClockedOut = !!attendance.clockOut;
  const isOnBreak = attendance.status === "on-break";

  return (
    <PageContainer>
      <SectionHeader title="Time Clock" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN — Clock In/Out + Break */}
        <DashCard className="p-6 flex flex-col gap-4">
          {loading ? (
            <p className="text-neutral-400 text-sm text-center">Loading...</p>
          ) : (
            <>
              {!isClockedIn && (
                <ClockInButton onSuccess={fetchToday} />
              )}

              {isClockedIn && !isClockedOut && (
                <LunchBreakButton
                  onBreak={isOnBreak}
                  onSuccess={fetchToday}
                />
              )}

              {isClockedIn && !isClockedOut && (
                <ClockOutButton
                  disabled={isOnBreak}
                  onSuccess={fetchToday}
                />
              )}

              {isClockedOut && (
                <p className="text-center text-neutral-400 text-sm py-2">
                  Shift complete for today.
                </p>
              )}
            </>
          )}
        </DashCard>

        {/* MIDDLE COLUMN — Live Time Tracker */}
        <TimeTracker />

        {/* RIGHT COLUMN — Hours Worked */}
        <HoursWorkedCard
          clockIn={attendance.clockIn}
          clockOut={attendance.clockOut}
          lunchStart={attendance.lunchStart}
          lunchEnd={attendance.lunchEnd}
        />
      </div>
    </PageContainer>
  );
}

