interface Props {
  status: string;
}

const STYLES: Record<string, string> = {
  "clocked-in":  "bg-emerald-500/20 text-emerald-400 border border-emerald-800/40",
  "on-break":    "bg-amber-500/20 text-amber-400 border border-amber-800/40",
  "clocked-out": "bg-neutral-700/60 text-neutral-400 border border-neutral-600",
};

export default function AttendanceStatus({ status }: Props) {
  const style = STYLES[status] ?? "bg-neutral-700 text-neutral-400 border border-neutral-600";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${style}`}>
      {status.replace("-", " ")}
    </span>
  );
}