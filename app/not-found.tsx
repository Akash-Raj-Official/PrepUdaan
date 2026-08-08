import Link from "next/link";

export default function NotFound() {
  return (
    <div className="gradient-hero min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-6xl">🔍</div>
      <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">
        Page Not Found
      </h1>
      <p className="text-[var(--text-secondary)] max-w-md">
        The exam, paper, or page you are looking for does not exist or has not
        been published yet.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
