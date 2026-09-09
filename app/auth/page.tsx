"use client"

import MsuLogo from "@/components/MsuLogo";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col w-1/2 items-center justify-center min-h-screen bg-black">
            <MsuLogo onClick={() => router.push("/")} />
            <div className="flex flex-col fixed items-center justify-center z-11 bg-yellow-500">
            </div>

        </div>
    )
}
