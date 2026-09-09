import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-200">404</p>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <Link href="/" className="text-yellow-200 hover:text-yellow-300">
        Back to catalog
      </Link>
    </section>
  );
}
