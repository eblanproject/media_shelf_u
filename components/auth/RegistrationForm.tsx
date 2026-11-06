"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/lib/api/auth";
import { isValidEmail, isValidPassword } from "@/lib/validations/auth";

export default function RegistrationForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (username.trim().length < 3) return setError("Username must be at least 3 characters");
        if (!isValidEmail(email)) return setError("Enter a valid email");
        if (!isValidPassword(password)) return setError("Password must be at least 8 characters");

        setPending(true);
        try {
            await register({ username: username.trim(), email: email.trim(), password });
            router.push("/profile");
            router.refresh();
        } catch (e) {
            const message = e instanceof Error ? e.message : "Could not create an account";
            setError(message === "User already exists" ? "This username or email is already taken" : message);
            setPending(false);
        }
    }

    return (
        <div className="w-full max-w-md">
            <h1 className=" text-3xl font-bold text-white">Create an account</h1>
            <p className="text-gray-400 mb-6">Sign up to access your watchlist and settings.
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                <div className="mb-4 ">
                    <label htmlFor="username" className="block text-xs text-gray-300 font-semibold  mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        autoComplete="username"
                        maxLength={50}
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300"
                        required
                    />
                </div>

                <div className="mb-4 ">
                    <label htmlFor="email" className="block text-xs text-gray-300 font-semibold  mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
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
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
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
                    {pending ? "Creating account…" : "Create account"}
                </button>

                <h3 className="text-sm text-center  ">
                    Already have an account?
                    <span className="text-gray-400 hover:text-yellow-300 cursor-pointer ml-1">

                        <Link
                            href="/auth/signin">
                                                    Sign in

                        </Link>

                </span>
                </h3>

            </form>
        </div>
    )
}
