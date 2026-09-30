import { LogIn } from "lucide-react";

interface LoginButtonProps {
  onClick: () => void;
}

export default function LoginButton({ onClick }: LoginButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex flex-col items-center gap-1
        px-4 py-2
        rounded-xl
        bg-neutral-800 border border-neutral-700
        text-neutral-300
        text-xs tracking-widest uppercase
        transition-all duration-200
        hover:bg-neutral-700 hover:border-neutral-600 hover:text-white
        active:scale-95
      "
    >
      <LogIn className="w-4 h-4" />
      <span>Company Login</span>
    </button>
  );
}