import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import api from "../../../utils/api";
import type { AttendanceRecord } from "../analytics/AttendanceSummaryTable";

// ── Timezone utilities ────────────────────────────────────────────────────────

const COMMON_TIMEZONES = [
  { label: "Mountain Daylight Time (MDT) — UTC-6", value: "America/Denver" },
  { label: "Mountain Standard Time (MST) — UTC-7", value: "America/Phoenix" },
  { label: "Eastern Time (ET)", value: "America/New_York" },
  { label: "Central Time (CT)", value: "America/Chicago" },
  { label: "Pacific Time (PT)", value: "America/Los_Angeles" },
  { label: "Alaska Time (AKT)", value: "America/Anchorage" },
  { label: "Hawaii Time (HT)", value: "Pacific/Honolulu" },
  { label: "UTC", value: "UTC" },
];

/**
 * Get the UTC offset (in minutes) for an IANA timezone on a specific date.
 * Positive value means local time is BEHIND UTC (e.g. MDT = +360 → UTC = local + 6h).
 */
function getUTCOffset(dateStr: string, ianaTimezone: string): number {
  // Use noon UTC on that date to avoid any midnight DST edge-cases
  const ref = new Date(`${dateStr}T12:00:00Z`);
  const localNoonStr = new Intl.DateTimeFormat("en-US", {
    timeZone: ianaTimezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(ref);
  // en-US hour12:false can return "24:xx" for midnight — normalise
  const [rawH, rawM] = localNoonStr.split(":").map(Number);
  const localNoon = (rawH % 24) * 60 + rawM;
  const utcNoon = 12 * 60;
  return utcNoon - localNoon; // minutes to ADD to local to get UTC
}

/** Convert "HH:MM" local time → "HH:MM" UTC for the given date & timezone. */
function localToUTC(dateStr: string, localTime: string, ianaTimezone: string): string {
  if (!localTime) return "";
  const offset = getUTCOffset(dateStr, ianaTimezone);
  const [h, m] = localTime.split(":").map(Number);
  const total = ((h * 60 + m + offset) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Convert "HH:MM" UTC → "HH:MM" local time for the given date & timezone. */
function utcToLocal(dateStr: string, utcTime: string, ianaTimezone: string): string {
  if (!utcTime) return "";
  const offset = getUTCOffset(dateStr, ianaTimezone);
  const [h, m] = utcTime.split(":").map(Number);
  const total = ((h * 60 + m - offset) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Extract UTC "HH:MM" from an ISO timestamp string. */
function isoToUTCTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

/** Get the short timezone abbreviation, e.g. "MDT", "PST". */
function tzAbbrev(ianaTimezone: string): string {
  return (
    new Intl.DateTimeFormat("en-US", {
      timeZone: ianaTimezone,
      timeZoneName: "short",
    })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName")?.value ?? ianaTimezone
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  record: AttendanceRecord | null;
  onClose: () => void;
  onSaved: (updated: AttendanceRecord) => void;
}

interface Fields {
  clockIn: string;
  clockOut: string;
  lunchStart: string;
  lunchEnd: string;
  reason: string;
}

export default function CorrectionModal({ record, onClose, onSaved }: Props) {
  const defaultTz = record?.employee?.timezone ?? "America/Denver";
  const [timezone, setTimezone] = useState(defaultTz);
  const [fields, setFields] = useState<Fields>({
    clockIn: "",
    clockOut: "",
    lunchStart: "",
    lunchEnd: "",
    reason: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // When record changes, pre-fill inputs converted to the selected timezone
  useEffect(() => {
    if (!record) return;
    setTimezone(record.employee?.timezone ?? "America/Denver");
    setError("");
  }, [record]);

  // Re-convert pre-fill whenever timezone selector changes
  useEffect(() => {
    if (!record) return;
    setFields({
      clockIn: utcToLocal(record.date, isoToUTCTime(record.clockIn), timezone),
      clockOut: utcToLocal(record.date, isoToUTCTime(record.clockOut), timezone),
      lunchStart: utcToLocal(record.date, isoToUTCTime(record.lunchStart), timezone),
      lunchEnd: utcToLocal(record.date, isoToUTCTime(record.lunchEnd), timezone),
      reason: fields.reason,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timezone, record]);

  if (!record) return null;

  const abbrev = tzAbbrev(timezone);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFields((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // Convert all local times → UTC before sending
      const payload = {
        clockIn: localToUTC(record.date, fields.clockIn, timezone),
        clockOut: localToUTC(record.date, fields.clockOut, timezone),
        lunchStart: localToUTC(record.date, fields.lunchStart, timezone),
        lunchEnd: localToUTC(record.date, fields.lunchEnd, timezone),
        reason: fields.reason.trim(),
      };
      const res = await api.patch(`/attendance/${record._id}/correct`, payload);
      onSaved(res.data.record);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to save correction.");
    } finally {
      setSaving(false);
    }
  };

  const fmtDate = (d: string) =>
    new Date(d + "T12:00:00Z").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold text-lg leading-tight">
              Correct Attendance
            </h3>
            <p className="text-neutral-500 text-sm mt-0.5">
              {record.employee.name} &middot; {fmtDate(record.date)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-white transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Timezone selector */}
        <div className="mb-5">
          <label className="block text-neutral-400 text-xs mb-1.5">
            Employee Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500"
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <p className="text-neutral-600 text-xs mt-1.5 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Times are entered in <span className="text-neutral-400 font-medium">{abbrev}</span> and automatically converted to UTC for storage.
          </p>
        </div>

        {/* Time inputs */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {(
            [
              { key: "clockIn", label: `Clock In (${abbrev})` },
              { key: "clockOut", label: `Clock Out (${abbrev})` },
              { key: "lunchStart", label: `Lunch Start (${abbrev})` },
              { key: "lunchEnd", label: `Lunch End (${abbrev})` },
            ] as const
          ).map(({ key, label }) => (
            <div key={key}>
              <label className="block text-neutral-400 text-xs mb-1.5">{label}</label>
              <input
                type="time"
                value={fields[key]}
                onChange={set(key)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500"
              />
              {fields[key] && (
                <p className="text-neutral-600 text-xs mt-1">
                  = {localToUTC(record.date, fields[key], timezone)} UTC
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Reason */}
        <div className="mb-5">
          <label className="block text-neutral-400 text-xs mb-1.5">
            Reason <span className="text-neutral-600">(sent to employee)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. System error, forgot to clock out…"
            value={fields.reason}
            onChange={set("reason")}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500 placeholder:text-neutral-600"
          />
        </div>

        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Correction"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-semibold text-sm hover:bg-neutral-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
