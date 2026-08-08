import Link from "next/link";
import { notFound } from "next/navigation";
import { getExamConfig, getPaper, getAllExamSummaries, getPapersForExam } from "@/lib/data-loader";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ examId: string; paperId: string }>;
}

export async function generateStaticParams() {
  const exams = await getAllExamSummaries();
  const params: { examId: string; paperId: string }[] = [];
  for (const exam of exams) {
    const papers = await getPapersForExam(exam.examId);
    for (const paper of papers) {
      const paperSlug = paper.paperId.replace(`${exam.examId}-`, "");
      params.push({
        examId: exam.examId,
        paperId: paperSlug,
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { examId, paperId } = await params;
  const [exam, paper] = await Promise.all([
    getExamConfig(examId),
    getPaper(examId, `${examId}-${paperId}`),
  ]);
  if (!exam || !paper) return {};
  return {
    title: `${paper.title} — Instructions`,
    description: `Start ${paper.title} mock exam. ${paper.totalQuestions} questions, ${paper.durationMinutes} minutes.`,
  };
}

export default async function PaperInstructionsPage({ params }: Props) {
  const { examId, paperId } = await params;
  const fullPaperId = `${examId}-${paperId}`;

  const [exam, paper] = await Promise.all([
    getExamConfig(examId),
    getPaper(examId, fullPaperId),
  ]);

  if (!exam || !paper) notFound();

  const marking = paper.marking ?? exam.marking;

  return (
    <div className="gradient-hero min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-2 h-16 text-sm">
          <Link href="/" className="font-bold gradient-text text-lg flex items-center gap-1">
            <span>⚡</span>ExamForge
          </Link>
          <span className="text-[var(--border)]">/</span>
          <Link href={`/exams/${examId}`} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
            {exam.shortName}
          </Link>
          <span className="text-[var(--border)]">/</span>
          <span className="text-[var(--text-secondary)] font-medium truncate">{paper.title}</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-5">
            {paper.isOfficial ? "✓ Official Previous Year Paper" : "📝 Mock Test"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-3">
            {paper.title}
          </h1>
          <p className="text-[var(--text-secondary)]">{exam.authority}</p>
        </div>

        {/* Paper stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-in-up delay-100">
          {[
            { icon: "❓", label: "Questions", value: paper.totalQuestions },
            { icon: "🏆", label: "Total Marks", value: paper.totalMarks },
            { icon: "⏱️", label: "Duration", value: `${paper.durationMinutes} min` },
            { icon: "📌", label: "Language", value: paper.language },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-[var(--text-primary)]">
                {stat.value}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="glass-card p-6 mb-6 animate-fade-in-up delay-200">
          <h2 className="font-bold text-[var(--text-primary)] mb-4">Paper Sections</h2>
          <div className="space-y-2">
            {paper.sections.map((sec) => (
              <div
                key={sec.sectionId}
                className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0"
              >
                <div>
                  <span className="font-medium text-[var(--text-secondary)]">
                    {sec.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] ml-3">
                    Q{sec.questionRange[0]} – Q{sec.questionRange[1]}
                  </span>
                </div>
                <div className="text-sm text-right">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {sec.questionCount} Qs
                  </span>
                  <span className="text-[var(--text-muted)] ml-1">
                    / {sec.marks} marks
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="glass-card p-6 mb-6 animate-fade-in-up delay-300">
          <h2 className="font-bold text-[var(--text-primary)] mb-4">Instructions</h2>
          <ul className="space-y-3">
            {[
              `This is a ${paper.durationMinutes}-minute timed examination. The test will auto-submit when time runs out.`,
              `The paper has ${paper.totalQuestions} multiple-choice questions across ${paper.sections.length} sections.`,
              `Each correct answer awards +${marking.correct} mark. Each wrong answer deducts ${marking.negative} mark. Unattempted questions carry no penalty.`,
              "You can freely navigate between questions using the Question Navigator panel.",
              "You can Mark questions for Review if you want to return to them later.",
              "Click Submit Test only when you are done. You will not be able to change answers after submission.",
              "Your results, answers, and analysis are processed entirely in your browser and are never stored on any server.",
            ].map((inst, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-500/15 text-indigo-400 text-xs flex items-center justify-center shrink-0 font-bold">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{inst}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Marking scheme */}
        <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-in-up delay-300">
          <div className="glass-card p-4 text-center border border-emerald-500/20">
            <div className="text-2xl font-bold text-emerald-400">+{marking.correct}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Correct</div>
          </div>
          <div className="glass-card p-4 text-center border border-red-500/20">
            <div className="text-2xl font-bold text-red-400">−{marking.negative}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Incorrect</div>
          </div>
          <div className="glass-card p-4 text-center border border-[var(--border)]">
            <div className="text-2xl font-bold text-[var(--text-muted)]">0</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Skipped</div>
          </div>
        </div>

        {/* Privacy note */}
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 mb-8 animate-fade-in-up delay-400">
          <span className="text-emerald-400 text-lg mt-0.5">🔒</span>
          <p className="text-sm text-emerald-300/80">
            <strong className="text-emerald-300">Privacy Notice:</strong> Your responses and results are processed locally in your browser. They are never sent to our servers. Save or screenshot your result before leaving the result page.
          </p>
        </div>

        {/* Start button */}
        <div className="text-center animate-fade-in-up delay-500">
          <Link
            href={`/exams/${examId}/papers/${paperId}/test`}
            id="start-exam-btn"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl transition-all duration-200 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 glow-indigo"
          >
            <span>🚀</span>
            Start Examination
          </Link>
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            Timer starts immediately. Good luck!
          </p>
        </div>
      </main>
    </div>
  );
}
