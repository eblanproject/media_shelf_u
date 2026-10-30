import { forwardRef } from "react";
import SearchIcon from "./SearchIcon";

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    onBlur?: () => void;
    onEscape?: () => void;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    function SearchInput(
        {
            value,
            onChange,
            placeholder = "Search...",
            className = "",
            inputClassName = "",
            onBlur,
            onEscape,
        },
        ref,
    ) {
        return (
            <div className={`relative ${className}`}>
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    ref={ref}
                    type="search"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onBlur={onBlur}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") onEscape?.();
                    }}
                    placeholder={placeholder}
                    className={`w-full rounded-xl border border-gray-700 bg-black/50 py-2 pr-3 pl-9 text-sm text-white outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-yellow-300 ${inputClassName}`}
                />
            </div>
        );
    },
);

export default SearchInput;