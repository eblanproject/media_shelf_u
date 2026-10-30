type SearchIconProps = {
    className?: string;
};

export default function SearchIcon({ className = "h-4 w-4" }: SearchIconProps) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={className}
        >
            <circle cx="11" cy="11" r="6" />
            <path d="m16 16 4 4" />
        </svg>
    );
}