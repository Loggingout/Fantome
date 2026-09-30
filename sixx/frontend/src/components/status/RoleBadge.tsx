interface Props {
  role: "admin" | "employee" | string;
}

export default function RoleBadge({ role }: Props) {
  const style =
    role === "admin"
      ? "bg-amber-500/20 text-amber-400 border border-amber-800/40"
      : "bg-neutral-700/60 text-neutral-300 border border-neutral-600";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${style}`}>
      {role}
    </span>
  );
}