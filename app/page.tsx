import Link from "next/link";
import { getExamsByCategory } from "@/lib/data-loader";
import type { ExamSummary } from "@/lib/types";

// ─── Category metadata (icons, colors, order) ──────────────────────────────────
const CATEGORY_META: Record<
  string,
  { icon: string; color: string; glow: string; order: number }
> = {
  Banking: {
    icon: "🏦",
    color: "from-blue-500/20 to-indigo-600/10",
    glow: "hover:border-blue-500/40",
    order: 1,
  },
  SSC: {
    icon: "📋",
    color: "from-violet-500/20 to-purple-600/10",
    glow: "hover:border-violet-500/40",
    order: 2,
  },
  Railway: {
    icon: "🚂",
    color: "from-orange-500/20 to-amber-600/10",
    glow: "hover:border-orange-500/40",
    order: 3,
  },
  PSU: {
    icon: "⚙️",
    color: "from-teal-500/20 to-cyan-600/10",
    glow: "hover:border-teal-500/40",
    order: 4,
  },
  "Space / Technical": {
    icon: "🚀",
    color: "from-cyan-500/20 to-blue-600/10",
    glow: "hover:border-cyan-500/40",
    order: 5,
  },
  Teaching: {
    icon: "📚",
    color: "from-pink-500/20 to-rose-600/10",
    glow: "hover:border-pink-500/40",
    order: 6,
  },
};

// ─── Stat cards for hero section ──────────────────────────────────────────────
const STATS = [
  { label: "Exam Families", value: "7+" },
  { label: "Questions", value: "125+" },
  { label: "Free & Private", value: "100%" },
];

// ─── Upcoming exams (roadmap teaser) ──────────────────────────────────────────
const UPCOMING = [
  "SSC Selection Post",
  "RRB Technician",
  "ISRO Scientist/Engineer",
  "Coal India MT",
  "BPSC TRE",
  "Computer Teacher",
];

export default async function HomePage() {
  const byCategory = await getExamsByCategory();

  // Sort categories by predefined order
  const sortedCategories = Object.entries(byCategory).sort(([a], [b]) => {
    const orderA = CATEGORY_META[a]?.order ?? 99;
    const orderB = CATEGORY_META[b]?.order ?? 99;
    return orderA - orderB;
  });

  return (
    <div className="gradient-hero min-h-screen">
      {/* ── Navigation ────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-xl tracking-tight gradient-text">
              ExamForge
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <span className="hidden sm:inline">100% Free &amp; Private</span>
            <span className="hidden sm:inline text-[var(--border)]">|</span>
            <span className="hidden sm:inline">No account required</span>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero Section ────────────────────────────────────────────────────── */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 overflow-hidden">
          {/* Decorative orbs */}
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute top-20 right-1/4 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div className="max-w-4xl mx-auto text-center relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse inline-block"></span>
              Previous Year Papers · Mock Tests · Detailed Analytics
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up delay-100">
              <span className="gradient-text">Government &amp; Technical</span>
              <br />
              <span className="text-[var(--text-primary)]">Exam Mock Portal</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
              Practice previous-year papers under real exam conditions. Understand
              exactly where you are losing marks and what to improve before your
              next attempt.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
              <Link
                href="#exams"
                id="explore-exams-btn"
                className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Explore Exams →
              </Link>
              <div className="text-[var(--text-muted)] text-sm">
                No sign-up · No server storage · Free forever
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto animate-fade-in-up delay-400">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card p-4 text-center"
                >
                  <div className="text-2xl font-bold gradient-text-blue">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Privacy Notice ───────────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start gap-3 px-5 py-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <span className="text-emerald-400 text-lg mt-0.5 shrink-0">🔒</span>
              <p className="text-sm text-emerald-300/80 leading-relaxed">
                <strong className="text-emerald-300">Your privacy is guaranteed.</strong>{" "}
                Your assessment responses, answers, and results are processed entirely in
                your browser and are never sent to our servers. Save or screenshot your
                result before leaving the page.
              </p>
            </div>
          </div>
        </section>

        {/* ── Exam Categories ──────────────────────────────────────────────────── */}
        <section id="exams" className="px-4 sm:px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                Available Exams
              </h2>
              <p className="text-[var(--text-secondary)]">
                Select an exam to view available papers and start your mock test.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedCategories.map(([category, exams], idx) => {
                const meta = CATEGORY_META[category] ?? {
                  icon: "📝",
                  color: "from-slate-500/20 to-slate-600/10",
                  glow: "hover:border-slate-500/40",
                  order: 99,
                };
                return (
                  <CategoryCard
                    key={category}
                    category={category}
                    exams={exams ?? []}
                    icon={meta.icon}
                    gradientClass={meta.color}
                    glowClass={meta.glow}
                    delay={idx * 0.1}
                  />
                );
              })}

              {/* Upcoming placeholders */}
              {sortedCategories.length === 0 &&
                UPCOMING.map((name, i) => (
                  <UpcomingCard key={name} name={name} delay={i * 0.1} />
                ))}
            </div>

            {/* Coming Soon section */}
            {sortedCategories.length > 0 && (
              <div className="mt-10">
                <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">
                  Coming Soon
                </h3>
                <div className="flex flex-wrap gap-3">
                  {UPCOMING.map((name) => (
                    <div
                      key={name}
                      className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)]/50 text-sm text-[var(--text-muted)]"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-16 border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12 text-[var(--text-primary)]">
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  icon: "🎯",
                  title: "Select Exam",
                  desc: "Choose from IBPS SO, SSC, RRB, ISRO, and more exam families.",
                },
                {
                  step: "02",
                  icon: "📄",
                  title: "Pick a Paper",
                  desc: "Select a previous-year paper or mock by year and shift.",
                },
                {
                  step: "03",
                  icon: "⏱️",
                  title: "Take the Test",
                  desc: "Answer under real exam conditions with live timer and navigator.",
                },
                {
                  step: "04",
                  icon: "📊",
                  title: "Analyse & Improve",
                  desc: "Get detailed performance insights and actionable recommendations.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="glass-card p-6 text-center relative overflow-hidden"
                >
                  <div className="absolute top-3 right-4 text-xs font-mono text-[var(--text-muted)] opacity-50">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] py-8 px-4 sm:px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold gradient-text">ExamForge</span>
          </div>
          <p className="text-sm text-[var(--text-muted)] text-center">
            Take the actual-style paper. Understand your performance. Know exactly what to improve.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} ExamForge
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── Category Card Component ───────────────────────────────────────────────────
function CategoryCard({
  category,
  exams,
  icon,
  gradientClass,
  glowClass,
  delay,
}: {
  category: string;
  exams: ExamSummary[];
  icon: string;
  gradientClass: string;
  glowClass: string;
  delay: number;
}) {
  return (
    <div
      className={`category-card glass-card p-6 ${glowClass}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradientClass} text-xl shrink-0`}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-[var(--text-primary)]">{category}</h3>
          <p className="text-xs text-[var(--text-muted)]">
            {exams.length} exam{exams.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      {/* Exam list */}
      <div className="space-y-2">
        {exams.map((exam) => (
          <Link
            key={exam.examId}
            href={`/exams/${exam.examId}`}
            id={`exam-link-${exam.examId}`}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)]/50 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-200 group"
          >
            <div>
              <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-indigo-300 transition-colors">
                {exam.shortName}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {exam.paperCount} paper{exam.paperCount !== 1 ? "s" : ""}
              </div>
            </div>
            <span className="text-[var(--text-muted)] group-hover:text-indigo-400 transition-colors text-sm">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Upcoming Card ─────────────────────────────────────────────────────────────
function UpcomingCard({ name, delay }: { name: string; delay: number }) {
  return (
    <div
      className="glass-card p-6 opacity-50 cursor-not-allowed"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border)] text-xl">
          📝
        </div>
        <div>
          <h3 className="font-bold text-[var(--text-secondary)]">{name}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}
