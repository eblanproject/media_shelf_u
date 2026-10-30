"use client";

import Link from "next/link";

type MsuLogoProps = {
    onClick?: () => void;
};

export default function MsuLogo({ onClick }: MsuLogoProps) {
    return (
        <div onClick={onClick} className="flex items-center gap-2.5 text-white cursor-pointer">
            <Link href="/" className="flex items-center gap-2.5">
                <svg
                    viewBox="0 0 40 40"
                    className="h-10 w-10"
                    fill="none"
                    aria-hidden="true"
                >
                    <rect x="3" y="5" width="34" height="30" rx="8" className="fill-yellow-200" />
                    <path d="M16 13.5L27 20L16 26.5V13.5Z" className="fill-black" />
                    <circle cx="8" cy="12" r="1.5" className="fill-white/70" />
                    <circle cx="8" cy="20" r="1.5" className="fill-white/70" />
                    <circle cx="8" cy="28" r="1.5" className="fill-white/70" />
                    <circle cx="32" cy="12" r="1.5" className="fill-white/70" />
                    <circle cx="32" cy="20" r="1.5" className="fill-white/70" />
                    <circle cx="32" cy="28" r="1.5" className="fill-white/70" />
                </svg>

                <span className="text-xl font-black tracking-tight">
                    MS<span className="text-gray-600">U</span>
                </span>
            </Link>
        </div>
    );
}