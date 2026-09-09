"use client"



import Link from "next/link";

export default function LoginForm() {
    return (
        <div className="w-full max-w-md">
             <h1 className=" text-3xl font-bold text-white">Welcome back</h1>
             <p className="text-gray-400 mb-6">Sign in to access your watchlist and settings.
             </p>

            <form className="flex flex-col gap-4">
                <div className="mb-4 ">
                    <label htmlFor="email" className="block text-xs text-gray-300 font-semibold  mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-xs text-gray-300 font-semibold mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded outline-none placeholder:text-gray-500 focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full cursor-pointer bg-yellow-300 text-black py-3 rounded transition hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-black"
                >
                    Sign In
                </button>

                <h3 className="text-sm text-center  ">
                    Don't have an account?
                    <span className="text-gray-400 hover:text-yellow-300 cursor-pointer ml-1">

                        <Link
                            href="/auth/registration">
                                                    Create Account

                        </Link>

                </span>
                </h3>

            </form>
        </div>
    )
}
