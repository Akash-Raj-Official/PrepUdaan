import Link from "next/link";
import { getExamsByCategory, getExamStats } from "@/lib/data-loader";
import type { ExamSummary } from "@/lib/types";
import ThemeToggle from "@/components/ThemeToggle";

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

// ─── Upcoming exam roadmap ──────────────────────────────────────────────────
const UPCOMING_DETAILS = [
  {
    name: "SSC Selection Post (Phase XII)",
    category: "SSC",
    timeline: "Expected Q3 2026",
    sections: "General Intelligence · GA · Quant · English",
  },
  {
    name: "RRB Technician (Grade I CS/Signal)",
    category: "Railway",
    timeline: "Expected Q3 2026",
    sections: "Basic Science & Engg · CS/Electronics · Reasoning",
  },
  {
    name: "BPSC TRE (PGT Computer Science)",
    category: "Teaching",
    timeline: "Expected Q4 2026",
    sections: "General Studies · Computer Science Domain",
  },
  {
    name: "Computer Teacher / PGT CS",
    category: "Teaching",
    timeline: "Expected Q4 2026",
    sections: "Pedagogy · CS Core · Data Structures & DBMS",
  },
  {
    name: "NIC Scientist B (CS/IT)",
    category: "Space / Technical",
    timeline: "Expected Q4 2026",
    sections: "Generic Aptitude · CS/IT Domain Specialization",
  },
  {
    name: "NLC Graduate Executive Trainee",
    category: "PSU",
    timeline: "Expected Q4 2026",
    sections: "Quantitative · Reasoning · Technical Engineering",
  },
];

export default async function HomePage() {
  const [byCategory, stats] = await Promise.all([
    getExamsByCategory(),
    getExamStats(),
  ]);

  // Dynamic stat cards
  const heroStats = [
    { label: "Active Categories", value: `${stats.categoriesCount} / 6` },
    { label: "Solved Questions", value: `${stats.totalQuestions}+` },
    { label: "Free & Private", value: "100%" },
  ];

  // Sort categories by predefined order
  const sortedCategories = Object.entries(byCategory).sort(([a], [b]) => {
    const orderA = CATEGORY_META[a]?.order ?? 99;
    const orderB = CATEGORY_META[b]?.order ?? 99;
    return orderA - orderB;
  });

  return (
    <div className="gradient-hero min-h-screen">
      {/* ── Navigation ────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-xl tracking-tight gradient-text">
              PrepUdaan
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <Link
              href="/interview-prep"
              id="nav-interview-prep-btn"
              className="px-3 py-1.5 rounded-lg badge-amber hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>🎓</span> Technical Viva &amp; Interview Prep
            </Link>
            <span className="hidden md:inline text-[var(--border)]">|</span>
            <span className="hidden md:inline">100% Free &amp; Client-Side</span>
            <ThemeToggle />
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
                "radial-gradient(circle, var(--hero-orb-1) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute top-20 right-1/4 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, var(--hero-orb-2) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div className="max-w-4xl mx-auto text-center relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-indigo text-sm font-medium mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse inline-block"></span>
              Official PYPs · Timed Mocks · Analytics · Technical Viva Prep
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up delay-100">
              <span className="gradient-text">Government &amp; Technical</span>
              <br />
              <span className="text-[var(--text-primary)]">Exam &amp; Interview Portal</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
              Practice past-year papers under real exam conditions and prepare for technical viva interviews for IBPS SO IT, ISRO Scientist, Coal India MT, and more.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
              <Link
                href="#exams"
                id="explore-exams-btn"
                className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Explore Live Papers →
              </Link>
              <Link
                href="/interview-prep"
                id="hero-interview-prep-btn"
                className="px-8 py-4 rounded-xl badge-amber font-semibold text-lg transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
              >
                🎓 Interview Prep Hub
              </Link>
            </div>

            {/* Dynamic Stats row */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto animate-fade-in-up delay-400">
              {heroStats.map((stat) => (
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
            <div className="flex items-start gap-3 px-5 py-4 rounded-xl badge-emerald">
              <span className="text-lg mt-0.5 shrink-0">🔒</span>
              <p className="text-sm leading-relaxed opacity-95">
                <strong className="font-bold">100% Client-Side Privacy:</strong>{" "}
                Your responses, timings, and analytical reports are calculated strictly inside your browser and never transmitted to external servers.
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
                Select an exam to view available papers, detailed pattern info, and start your mock test.
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
            </div>

            {/* Coming Soon / Roadmap Section */}
            <div className="mt-14 pt-10 border-t border-[var(--border)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    Upcoming Exam Targets
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Genuinely new exam families undergoing question curation &amp; verification
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full badge-amber font-semibold">
                  In Active Preparation
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {UPCOMING_DETAILS.map((item) => (
                  <div
                    key={item.name}
                    className="glass-card p-5 hover:border-[var(--accent-primary)]/40 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded badge-indigo">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        {item.timeline}
                      </span>
                    </div>
                    <h4 className="font-bold text-[var(--text-primary)] text-base mb-2">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      <strong className="text-[var(--text-secondary)]">Pattern:</strong> {item.sections}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Technical Interview & Viva Spotlight ─────────────────────────────────── */}
        <section className="px-4 sm:px-6 py-14 bg-[var(--spotlight-bg)] border-t border-[var(--border)] transition-colors duration-300">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-amber text-xs font-semibold">
                🎓 New Module
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                Preparing for Technical Interviews &amp; Vivas?
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Objective MCQs are only stage 1. Clear technical viva questions for IBPS SO IT, ISRO Scientist, and Coal India MT with curated core CS/IT interview questions, model answers, and interviewer expectations.
              </p>
            </div>
            <Link
              href="/interview-prep"
              id="spotlight-interview-prep-btn"
              className="shrink-0 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
            >
              Open Interview Prep Hub →
            </Link>
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
                  desc: "Choose from IBPS SO IT, ISRO Scientist, Coal India MT, and more.",
                },
                {
                  step: "02",
                  icon: "📄",
                  title: "Pick a Paper",
                  desc: "Select an official previous-year paper or subject mock test.",
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
                  title: "Analyse & Viva Prep",
                  desc: "Review detailed accuracy ratings and practice technical viva concepts.",
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
            <span className="font-bold gradient-text">PrepUdaan</span>
          </div>
          <p className="text-sm text-[var(--text-muted)] text-center">
            Take official-style papers. Understand performance. Master technical interview concepts.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} PrepUdaan
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
            className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--badge-indigo-bg)] hover:border-[var(--accent-primary)]/40 transition-all duration-200 group"
          >
            <div>
              <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                {exam.shortName}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {exam.paperCount} paper{exam.paperCount !== 1 ? "s" : ""} available
              </div>
            </div>
            <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors text-sm">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
