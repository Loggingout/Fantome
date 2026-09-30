interface Props {
  online?: boolean;
  label?: boolean;
}

export default function OnlineIndicator({ online = false, label = false }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          online ? "bg-emerald-500 animate-pulse" : "bg-neutral-600"
        }`}
      />
      {label && (
        <span className={`text-xs ${online ? "text-emerald-400" : "text-neutral-500"}`}>
          {online ? "Online" : "Offline"}
        </span>
      )}
    </div>
  );
}