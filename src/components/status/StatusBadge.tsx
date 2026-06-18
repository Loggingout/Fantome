const VARIANTS: Record<string, string> = {
  published:   "bg-emerald-500/20 text-emerald-400 border border-emerald-800/40",
  active:      "bg-emerald-500/20 text-emerald-400 border border-emerald-800/40",
  completed:   "bg-emerald-500/20 text-emerald-400 border border-emerald-800/40",
  draft:       "bg-neutral-700/60 text-neutral-400 border border-neutral-600",
  inactive:    "bg-neutral-700/60 text-neutral-400 border border-neutral-600",
  pending:     "bg-amber-500/20 text-amber-400 border border-amber-800/40",
  "in-progress": "bg-blue-500/20 text-blue-400 border border-blue-800/40",
  warning:     "bg-amber-500/20 text-amber-400 border border-amber-800/40",
  error:       "bg-red-500/20 text-red-400 border border-red-800/40",
};

interface Props {
  status: string;
  label?: string;
}

export default function StatusBadge({ status, label }: Props) {
  const style = VARIANTS[status.toLowerCase()] ?? "bg-neutral-700 text-neutral-400 border border-neutral-600";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${style}`}>
      {label ?? status.replace("-", " ")}
    </span>
  );
}