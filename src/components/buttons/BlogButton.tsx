interface BlogButtonProps {
    onClick?: () => void;
    isActive?: boolean;
}

export default function BlogButton({
    onClick,
    isActive = false,
}: BlogButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
                relative
                px-1 py-1
                bg-transparent
                border-none
                text-sm font-medium
                transition-colors duration-200
                cursor-pointer
                ${
                    isActive
                        ? "text-white"
                        : "text-gray-300 hover:text-neutral-500"
                }
            `}
        >
            Blog

            {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-red-500" />
            )}
        </button>
    );
}