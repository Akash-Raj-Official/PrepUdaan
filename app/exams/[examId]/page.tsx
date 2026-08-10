import Link from "next/link";
import { notFound } from "next/navigation";
import { getExamConfig, getPapersForExam, getAllExamSummaries } from "@/lib/data-loader";
import type { PaperSummary } from "@/lib/types";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ examId: string }>;
}

export async function generateStaticParams() {
  const exams = await getAllExamSummaries();
  return exams.map((exam) => ({
    examId: exam.examId,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { examId } = await params;
  const exam = await getExamConfig(examId);
  if (!exam) return {};

  const pageTitle = `${exam.name} | PrepUdaan`;
  const pageDescription = `Practice official previous-year papers and mock tests for ${exam.name} (${exam.authority}). Detailed subject breakdown, speed ratings, and technical analysis.`;
  const customKeywords = [
    `${exam.name.toLowerCase()} mock test`,
    `${exam.shortName.toLowerCase()} previous year paper`,
    `${exam.shortName.toLowerCase()} solved paper`,
    `${exam.authority.toLowerCase()} exam mock test`,
    `${exam.category.toLowerCase()} exam practice`,
    ...exam.tags.map((t) => `${t.toLowerCase()} mock test`),
  ];

  return {
    title: exam.name,
    description: pageDescription,
    keywords: customKeywords,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
  };
}

export default async function ExamPage({ params }: Props) {
  const { examId } = await params;
  const [exam, papers] = await Promise.all([
    getExamConfig(examId),
    getPapersForExam(examId),
  ]);

  if (!exam) notFound();

  // Group papers by year
  const papersByYear = papers.reduce<Record<number, PaperSummary[]>>((acc, p) => {
    if (!acc[p.year]) acc[p.year] = [];
    acc[p.year].push(p);
    return acc;
  }, {});

  const sortedYears = Object.keys(papersByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="gradient-hero min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 text-sm">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="shrink-0 group">
              <Logo size="sm" />
            </Link>
            <span className="text-[var(--border)]">/</span>
            <span className="text-[var(--text-muted)] truncate hidden sm:inline">{exam.category}</span>
            <span className="text-[var(--border)] hidden sm:inline">/</span>
            <span className="text-[var(--text-secondary)] font-medium truncate">{exam.shortName}</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main content ────────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Exam header */}
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-3">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
                  {exam.category}
                </span>
                <span>·</span>
                <span>{exam.authority}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-3">
                {exam.name}
              </h1>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                {exam.description}
              </p>
            </div>

            {/* Papers list */}
            <div className="animate-fade-in-up delay-200">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-5">
                Available Papers
              </h2>

              {papers.length === 0 ? (
                <div className="glass-card p-10 text-center text-[var(--text-muted)]">
                  <div className="text-4xl mb-3">📋</div>
                  <p>No papers available yet. Check back soon!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedYears.map((year) => (
                    <div key={year}>
                      <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">
                        {year}
                      </h3>
                      <div className="space-y-3">
                        {papersByYear[year].map((paper) => (
                          <PaperCard key={paper.paperId} paper={paper} examId={examId} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ────────────────────────────────────────────────────────── */}
          <aside className="space-y-5 animate-fade-in-up delay-300">
            {/* Exam info card */}
            <div className="glass-card p-6">
              <h3 className="font-bold text-[var(--text-primary)] mb-4">Exam Details</h3>
              <div className="space-y-3">
                <InfoRow label="Duration" value={`${exam.durationMinutes} minutes`} />
                <InfoRow label="Total Questions" value={`${exam.totalQuestions}`} />
                <InfoRow label="Total Marks" value={`${exam.totalMarks}`} />
                <InfoRow
                  label="Correct Answer"
                  value={`+${exam.marking.correct} mark`}
                />
                <InfoRow
                  label="Wrong Answer"
                  value={`−${exam.marking.negative} mark`}
                />
              </div>
            </div>

            {/* Sections */}
            <div className="glass-card p-6">
              <h3 className="font-bold text-[var(--text-primary)] mb-4">Sections</h3>
              <div className="space-y-2">
                {exam.sections.map((sec) => (
                  <div
                    key={sec.id}
                    className="flex items-center justify-between text-sm py-2 border-b border-[var(--border)] last:border-0"
                  >
                    <span className="text-[var(--text-secondary)]">{sec.name}</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {sec.maxQuestions} Qs
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-3 text-sm">Topics Covered</h3>
              <div className="flex flex-wrap gap-2">
                {exam.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs rounded-full bg-[var(--bg-primary)]/60 border border-[var(--border)] text-[var(--text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function PaperCard({
  paper,
  examId,
}: {
  paper: PaperSummary;
  examId: string;
}) {
  const paperSlug = paper.paperId.replace(`${examId}-`, "");
  return (
    <div className="glass-card p-5 flex items-center justify-between gap-4 category-card">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-semibold text-[var(--text-primary)]">
            {paper.title}
          </span>
          {paper.isOfficial && (
            <span className="px-2 py-0.5 text-xs rounded-full badge-emerald font-medium">
              Official
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
          <span>{paper.totalQuestions} questions</span>
          <span>·</span>
          <span>{paper.durationMinutes} min</span>
          {paper.shift && (
            <>
              <span>·</span>
              <span>{paper.shift}</span>
            </>
          )}
        </div>
      </div>
      <Link
        href={`/exams/${examId}/papers/${paperSlug}`}
        id={`start-paper-${paper.paperId}`}
        className="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20"
      >
        Start →
      </Link>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="font-semibold text-[var(--text-primary)]">{value}</span>
    </div>
  );
}
