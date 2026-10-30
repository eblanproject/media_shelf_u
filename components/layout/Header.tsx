"use client"

import MsuLogo from "../MsuLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";



    export default function Header() {
            const router = useRouter();
            return (

                <div className="flex w-full items-center justify-between gap-2 h-15 border-b border-gray-900 text-2xl text-bold bg-transparent sticky">

    {/*logo*/}

    <div className="flex shrink-0 px-5 py-2 justify-items-center">

      <div className="flex   text-black  rounded-full">
            <div
                onClick={() => router.push("/")}
                className="cursor-pointer"
            >
                <MsuLogo />
            </div>
      </div>



    </div>

{/* Favorite */}

    <div className="flex shrink-0 justify-stretch items-center gap-3 sm:gap-6">

        <div className="flex items-center text-sm text-yellow-200 border-r border-gray-700 px-5 hover:text-yellow-300 cursor-pointer">

            <Link href="/profile">
                Favorite

            </Link>
        </div>

        {/*sign in/ join*/}

        <div className="flex shrink-0 flex-nowrap items-center gap-3 text-xs sm:gap-6 mr-3">
            <Link
                href="/auth/signin"
                className="flex h-5 shrink-0 items-center whitespace-nowrap text-sm hover:text-yellow-200"
            >
                Sign in
            </Link>

            <div className="flex shrink-0 items-center whitespace-nowrap rounded-md bg-yellow-200 px-2 text-sm text-black hover:bg-yellow-300">
                <Link href="/auth/registration"
                className="flex items-center text-sm hover:text-yellow-200">
                    Join
                </Link>

            </div>
        </div>



    </div>



</div>

                 )
    }