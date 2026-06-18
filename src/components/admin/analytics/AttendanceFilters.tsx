export interface AttendanceFiltersState {
  startDate: string;
  endDate: string;
  status: string;
  search: string;
}

interface Props {
  filters: AttendanceFiltersState;
  onChange: (f: AttendanceFiltersState) => void;
}

export default function AttendanceFilters({ filters, onChange }: Props) {
  const set = (key: keyof AttendanceFiltersState, val: string) =>
    onChange({ ...filters, [key]: val });

  const clear = () =>
    onChange({ startDate: "", endDate: "", status: "", search: "" });

  const hasActive = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap gap-3 items-end">
      {/* Employee name search */}
      <div className="flex flex-col gap-1 w-full sm:w-auto sm:min-w-[160px]">
        <label className="text-neutral-500 text-xs">Employee</label>
        <input
          type="text"
          placeholder="Search name…"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      {/* Date range */}
      <div className="flex flex-col gap-1">
        <label className="text-neutral-500 text-xs">From</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => set("startDate", e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-neutral-500 text-xs">To</label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => set("endDate", e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1">
        <label className="text-neutral-500 text-xs">Status</label>
        <select
          value={filters.status}
          onChange={(e) => set("status", e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500 transition-colors cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="clocked-in">Clocked In</option>
          <option value="on-break">On Break</option>
          <option value="clocked-out">Clocked Out</option>
        </select>
      </div>

      {/* Clear */}
      {hasActive && (
        <button
          onClick={clear}
          className="self-end px-4 py-2 rounded-xl text-sm text-neutral-400 border border-neutral-700 hover:border-neutral-500 hover:text-white transition-all"
        >
          Clear
        </button>
      )}
    </div>
  );
}
