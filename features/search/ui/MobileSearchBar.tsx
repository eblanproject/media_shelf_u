import type { RefObject } from "react";
import SearchInput from "./SearchInput";

type MobileSearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    onClose: () => void;
    inputRef?: RefObject<HTMLInputElement | null>;
    placeholder?: string;
};

export default function MobileSearchBar({
                                            value,
                                            onChange,
                                            onClose,
                                            inputRef,
                                            placeholder = "Search movies...",
                                        }: MobileSearchBarProps) {
    return (
        <div className="flex items-center gap-2 sm:hidden">
            <SearchInput
                ref={inputRef}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="flex-1"
                inputClassName="border-yellow-300 bg-black/70 text-base"
                onEscape={onClose}
                // закрываем по blur только если поле пустое,
                // иначе набранный запрос пропадал бы при потере фокуса
                onBlur={() => {
                    if (value.trim().length === 0) onClose();
                }}
            />

            <button
                type="button"
                aria-label="Close movie search"
                onMouseDown={(event) => event.preventDefault()}
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-700 bg-black/50 text-gray-300 transition hover:bg-white/10 hover:text-yellow-200"
            >
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                >
                    <path d="M6 6l12 12M18 6 6 18" />
                </svg>
            </button>
        </div>
    );
}