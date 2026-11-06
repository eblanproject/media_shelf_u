"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/api/auth";

export default function LoginForm() {
    const router = useRouter();
    const [loginValue, setLoginValue] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setPending(true);
        try {
            await login({ login: loginValue.trim(), password });
            router.push("/profile");
            router.refresh();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not sign in");
            setPending(false);
        }
    }

    return (
        <div className="w-full max-w-md">
             <h1 className=" text-3xl font-bold text-white">Welcome back</h1>
             <p className="text-gray-400 mb-6">Sign in to access your watchlist and settings.
             </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="mb-4 ">
                    <label htmlFor="login" className="block text-xs text-gray-300 font-semibold  mb-2">
                        Email or username
                    </label>
                    <input
                        type="text"
                        id="login"
                        autoComplete="username"
                        value={loginValue}
                        onChange={(event) => setLoginValue(event.target.value)}
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
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded outline-none placeholder:text-gray-500 focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300"
                        required
                    />
                </div>
                {error && (
                    <p role="alert" className="rounded border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-300">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full cursor-pointer bg-yellow-300 text-black py-3 rounded transition hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-wait disabled:opacity-70"
                >
                    {pending ? "Signing in…" : "Sign In"}
                </button>

                <h3 className="text-sm text-center  ">
                    Don&apos;t have an account?
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
