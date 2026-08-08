"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { calculateScore } from "@/lib/scoring";
import { analyseSessionBehaviour, generateInsights } from "@/lib/analytics";
import type {
  TestSession,
  Paper,
  ExamConfig,
  TestResult,
  Insight,
  SubjectPerformance,
  SectionResult,
  PerformanceRating,
} from "@/lib/types";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function ratingColor(r: PerformanceRating) {
  if (r === "STRONG") return "badge-strong";
  if (r === "GOOD") return "badge-good";
  if (r === "NEEDS ATTENTION") return "badge-needs-attention";
  return "badge-weak";
}

function ratingIcon(r: PerformanceRating) {
  if (r === "STRONG") return "✅";
  if (r === "GOOD") return "👍";
  if (r === "NEEDS ATTENTION") return "⚠️";
  return "❌";
}

function insightBg(severity: Insight["severity"]) {
  if (severity === "positive")
    return "border-emerald-500/30 bg-emerald-500/5";
  if (severity === "critical") return "border-red-500/30 bg-red-500/5";
  return "border-amber-500/30 bg-amber-500/5";
}

function insightIcon(severity: Insight["severity"]) {
  if (severity === "positive") return "🌟";
  if (severity === "critical") return "🔴";
  return "🟡";
}

function msToSec(ms: number) {
  return Math.round(ms / 1000);
}

function formatTime(ms: number) {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ResultClient() {
  const params = useParams();
  const examId = params.examId as string;
  const paperId = params.paperId as string;
  const fullPaperId = `${examId}-${paperId}`;

  const [result, setResult] = useState<TestResult | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [paper, setPaper] = useState<Paper | null>(null);
  const [exam, setExam] = useState<ExamConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "sections" | "subjects" | "review">(
    "overview"
  );
  const [animationReady, setAnimationReady] = useState(false);
  const [userName, setUserName] = useState<string>("");

  // Read user name from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("examforge_user_name");
    setUserName(stored && stored !== "Guest" ? stored : "");
  }, []);

  useEffect(() => {
    // Load session + config from sessionStorage
    const sessionStr = sessionStorage.getItem(`examSession_${fullPaperId}`);
    const paperStr = sessionStorage.getItem(`examPaper_${fullPaperId}`);
    const examStr = sessionStorage.getItem(`examConfig_${examId}`);

    if (!sessionStr || !paperStr || !examStr) {
      setError(
        "No exam session found. Please start the exam from the beginning."
      );
      return;
    }

    try {
      const session: TestSession = JSON.parse(sessionStr);
      const paperData: Paper = JSON.parse(paperStr);
      const examData: ExamConfig = JSON.parse(examStr);

      const calculatedResult = calculateScore(session, paperData, examData);
      const behaviour = analyseSessionBehaviour(session, calculatedResult);
      const generatedInsights = generateInsights(calculatedResult, behaviour);

      setPaper(paperData);
      setExam(examData);
      setResult(calculatedResult);
      setInsights(generatedInsights);

      setTimeout(() => setAnimationReady(true), 100);
    } catch (e) {
      setError("Failed to load result. " + String(e));
    }
  }, [fullPaperId, examId]);

  if (error) {
    return (
      <div className="gradient-hero min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-5xl">⚠️</div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Session Not Found
        </h1>
        <p className="text-[var(--text-secondary)] text-center max-w-md">{error}</p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
        >
          ← Go Home
        </Link>
      </div>
    );
  }

  if (!result || !paper || !exam) {
    return (
      <div className="gradient-hero min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-muted)] text-lg">Computing results…</div>
      </div>
    );
  }

  const scorePercent = (result.score / result.maxScore) * 100;
  const timeUsedMin = Math.round(result.timeUsedMs / 60000);

  // Personalised feedback
  const feedback = (() => {
    if (scorePercent >= 80) return {
      emoji: "🏆", label: "Congratulations!",
      message: `Exceptional performance${userName ? `, ${userName}` : ""}! You're well-prepared for the real exam.`,
      color: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
    };
    if (scorePercent >= 65) return {
      emoji: "🌟", label: "Well Done!",
      message: `Great effort${userName ? `, ${userName}` : ""}! A little more practice on weak areas will get you to the top.`,
      color: "border-blue-500/30 bg-blue-500/8 text-blue-300",
    };
    if (scorePercent >= 50) return {
      emoji: "💪", label: "Keep Going!",
      message: `You're on the right track${userName ? `, ${userName}` : ""}! Focus on accuracy and attempt more questions.`,
      color: "border-amber-500/30 bg-amber-500/8 text-amber-300",
    };
    return {
      emoji: "📚", label: "Needs Improvement",
      message: `Don't give up${userName ? `, ${userName}` : ""}! Review the concepts, practise daily, and retake this paper.`,
      color: "border-red-500/30 bg-red-500/8 text-red-300",
    };
  })();

  return (
    <div className="gradient-hero min-h-screen pb-16">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-2 h-16 text-sm">
          <Link href="/" className="font-bold gradient-text text-lg flex items-center gap-1">
            <span>⚡</span>ExamForge
          </Link>
          <span className="text-[var(--border)]">/</span>
          <Link
            href={`/exams/${examId}`}
            className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            {exam.shortName}
          </Link>
          <span className="text-[var(--border)]">/</span>
          <span className="text-[var(--text-secondary)] font-medium">Result</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6 sm:space-y-8">
        {/* ── Header ────────────────────────────────────────────────────────────── */}
        <div className="text-center animate-fade-in-up">
          <p className="text-[var(--text-muted)] text-sm mb-2">{exam.name}</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] mb-1">
            {paper.title}
          </h1>
          {userName && (
            <p className="text-[var(--text-secondary)] text-base mt-2">
              Candidate: <span className="font-semibold text-indigo-300">{userName}</span>
            </p>
          )}
        </div>

        {/* ── Personalised Feedback Banner ─────────────────────────────────────── */}
        <div className={`rounded-2xl border px-5 py-4 flex items-start gap-4 animate-fade-in-up delay-100 ${feedback.color}`}>
          <span className="text-3xl shrink-0">{feedback.emoji}</span>
          <div>
            <h2 className="font-bold text-lg mb-0.5">{feedback.label}</h2>
            <p className="text-sm opacity-90 leading-relaxed">{feedback.message}</p>
          </div>
          <div className="ml-auto shrink-0 text-right hidden sm:block">
            <div className="text-2xl font-extrabold">{scorePercent.toFixed(1)}%</div>
            <div className="text-xs opacity-70">Score</div>
          </div>
        </div>

        {/* ── Score Hero ────────────────────────────────────────────────────────── */}
        <div className="glass-card p-8 text-center relative overflow-hidden glow-indigo animate-fade-in-up delay-100">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <div className="text-6xl sm:text-8xl font-extrabold gradient-text animate-count-up">
              {result.score}
              <span className="text-3xl sm:text-5xl text-[var(--text-muted)] font-normal">
                /{result.maxScore}
              </span>
            </div>
            <div className="mt-3 text-lg text-[var(--text-secondary)]">
              Score —{" "}
              <span
                className={
                  scorePercent >= 70
                    ? "text-emerald-400 font-semibold"
                    : scorePercent >= 50
                    ? "text-amber-400 font-semibold"
                    : "text-red-400 font-semibold"
                }
              >
                {scorePercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* ── Summary Stats ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-fade-in-up delay-200">
          {[
            { label: "Attempted", value: result.attempted, color: "text-blue-400" },
            { label: "Correct", value: result.correct, color: "text-emerald-400" },
            { label: "Incorrect", value: result.incorrect, color: "text-red-400" },
            { label: "Unanswered", value: result.unattempted, color: "text-[var(--text-muted)]" },
            {
              label: "Accuracy",
              value: `${result.accuracy}%`,
              color: result.accuracy >= 75 ? "text-emerald-400" : "text-amber-400",
            },
            {
              label: "Attempt Rate",
              value: `${result.attemptRate}%`,
              color: result.attemptRate >= 75 ? "text-emerald-400" : "text-amber-400",
            },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Performance Ratings ────────────────────────────────────────────────── */}
        <div className="glass-card p-6 animate-fade-in-up delay-300">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-5">
            Performance Ratings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {(
              [
                ["Technical Knowledge", result.ratings.technicalKnowledge],
                ["Accuracy", result.ratings.accuracy],
                ["Speed", result.ratings.speed],
                ["Question Selection", result.ratings.questionSelection],
                ["Consistency", result.ratings.consistency],
              ] as [string, PerformanceRating][]
            ).map(([label, rating]) => (
              <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border)]">
                <span className="text-2xl">{ratingIcon(rating)}</span>
                <span className="text-xs font-semibold text-[var(--text-muted)] text-center">
                  {label}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${ratingColor(rating)}`}
                >
                  {rating}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Time Analysis ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up delay-300">
          <div className="glass-card p-5 text-center">
            <div className="text-3xl font-bold gradient-text-blue">
              {timeUsedMin}
            </div>
            <div className="text-sm text-[var(--text-muted)] mt-1">
              Minutes used of {paper.durationMinutes}
            </div>
          </div>
          <div className="glass-card p-5 text-center">
            <div className="text-3xl font-bold gradient-text-blue">
              {msToSec(result.avgTimePerQuestionMs)}s
            </div>
            <div className="text-sm text-[var(--text-muted)] mt-1">
              Avg. time per attempted question
            </div>
          </div>
          <div className="glass-card p-5 text-center">
            <div className="text-3xl font-bold gradient-text-blue">
              {Math.round(
                (paper.durationMinutes * 60) / paper.totalQuestions
              )}
              s
            </div>
            <div className="text-sm text-[var(--text-muted)] mt-1">
              Target time per question
            </div>
          </div>
        </div>

        {/* ── Tab navigation ─────────────────────────────────────────────────────── */}
        <div className="flex border-b border-[var(--border)] gap-1 overflow-x-auto animate-fade-in-up delay-400">
          {(
            [
              { key: "overview", label: "📊 Insights" },
              { key: "sections", label: "📋 Sections" },
              { key: "subjects", label: "🏷️ Subjects" },
              { key: "review", label: "🔍 Question Review" },
            ] as { key: typeof activeTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.key
                  ? "border-indigo-500 text-indigo-300"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ───────────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Improvement Insights
            </h2>
            {insights.length === 0 ? (
              <div className="glass-card p-8 text-center text-[var(--text-muted)]">
                No specific insights generated for this attempt.
              </div>
            ) : (
              insights.map((ins, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-5 ${insightBg(ins.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5 shrink-0">
                      {insightIcon(ins.severity)}
                    </span>
                    <div>
                      <h3 className="font-bold text-[var(--text-primary)] mb-1">
                        {ins.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-3 leading-relaxed">
                        {ins.description}
                      </p>
                      <div className="px-4 py-3 rounded-lg bg-[var(--bg-primary)]/60 border border-[var(--border)]">
                        <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                          <span className="font-semibold text-indigo-300">
                            Recommendation:{" "}
                          </span>
                          {ins.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "sections" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Section-wise Performance
            </h2>
            {result.sectionResults.map((sec) => (
              <SectionCard key={sec.sectionId} section={sec} animationReady={animationReady} />
            ))}
          </div>
        )}

        {activeTab === "subjects" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Subject-wise Performance
            </h2>
            {result.subjectPerformance.length === 0 ? (
              <div className="glass-card p-8 text-center text-[var(--text-muted)]">
                No subject metadata available for this paper.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.subjectPerformance.map((subj) => (
                  <SubjectCard key={subj.subject} subj={subj} animationReady={animationReady} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "review" && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              Question-by-Question Review
            </h2>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left">
                      <th className="px-4 py-3 text-[var(--text-muted)] font-semibold">#</th>
                      <th className="px-4 py-3 text-[var(--text-muted)] font-semibold">Subject</th>
                      <th className="px-4 py-3 text-[var(--text-muted)] font-semibold">Your Answer</th>
                      <th className="px-4 py-3 text-[var(--text-muted)] font-semibold">Correct</th>
                      <th className="px-4 py-3 text-[var(--text-muted)] font-semibold">Status</th>
                      <th className="px-4 py-3 text-[var(--text-muted)] font-semibold">Marks</th>
                      <th className="px-4 py-3 text-[var(--text-muted)] font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.questionResults.map((qr, i) => {
                      return (
                        <tr
                          key={qr.questionId}
                          className={`border-b border-[var(--border)]/50 hover:bg-[var(--bg-card)] transition-colors ${
                            i % 2 === 0 ? "bg-[var(--bg-primary)]/20" : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-[var(--text-muted)] font-mono text-xs">
                            {qr.questionNumber}
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-[120px] truncate">
                            {qr.subject ?? "—"}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">
                            {qr.userAnswer !== null
                              ? String.fromCharCode(65 + qr.userAnswer)
                              : <span className="text-[var(--text-muted)]">—</span>}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-emerald-400">
                            {String.fromCharCode(65 + qr.correctAnswer)}
                          </td>
                          <td className="px-4 py-3">
                            {!qr.isAttempted ? (
                              <span className="text-[var(--text-muted)] text-xs">Skipped</span>
                            ) : qr.isCorrect ? (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                                ✓ Correct
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                                ✗ Wrong
                              </span>
                            )}
                          </td>
                          <td className={`px-4 py-3 text-xs font-semibold ${
                            qr.marksAwarded > 0
                              ? "text-emerald-400"
                              : qr.marksAwarded < 0
                              ? "text-red-400"
                              : "text-[var(--text-muted)]"
                          }`}>
                            {qr.marksAwarded > 0 ? "+" : ""}{qr.marksAwarded}
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--text-muted)] font-mono">
                            {qr.isAttempted ? formatTime(qr.timeSpentMs) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Actions ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up">
          <Link
            href={`/exams/${examId}/papers/${paperId}`}
            id="retake-btn"
            className="flex-1 py-4 rounded-xl border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold text-center transition-all"
          >
            🔄 Retake This Paper
          </Link>
          <Link
            href={`/exams/${examId}`}
            id="other-papers-btn"
            className="flex-1 py-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] font-semibold text-center transition-all"
          >
            📋 Other Papers
          </Link>
          <Link
            href="/"
            id="home-btn"
            className="flex-1 py-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] font-semibold text-center transition-all"
          >
            🏠 Home
          </Link>
        </div>

        {/* Privacy reminder */}
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <span className="text-amber-400 text-lg mt-0.5">⚠️</span>
          <p className="text-sm text-amber-300/80">
            <strong className="text-amber-300">Save your result!</strong>{" "}
            This result is stored only in your browser session. It will be lost if you close this tab or navigate away. Take a screenshot before leaving.
          </p>
        </div>
      </main>
    </div>
  );
}

// ─── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({
  section,
  animationReady,
}: {
  section: SectionResult;
  animationReady: boolean;
}) {
  const fillWidth = animationReady ? section.accuracy : 0;
  const color =
    section.accuracy >= 75
      ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
      : section.accuracy >= 55
      ? "bg-gradient-to-r from-amber-500 to-amber-400"
      : "bg-gradient-to-r from-red-500 to-red-400";

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-[var(--text-primary)]">
          {section.sectionName}
        </h3>
        <span className="font-bold text-lg gradient-text-blue">
          {section.score.toFixed(1)} / {section.totalQuestions}
        </span>
      </div>
      <div className="progress-track mb-3">
        <div
          className={`progress-fill ${color}`}
          style={{ width: `${fillWidth}%` }}
        />
      </div>
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div>
          <div className="font-semibold text-[var(--text-primary)]">{section.attempted}</div>
          <div className="text-[var(--text-muted)]">Attempted</div>
        </div>
        <div>
          <div className="font-semibold text-emerald-400">{section.correct}</div>
          <div className="text-[var(--text-muted)]">Correct</div>
        </div>
        <div>
          <div className="font-semibold text-red-400">{section.incorrect}</div>
          <div className="text-[var(--text-muted)]">Incorrect</div>
        </div>
        <div>
          <div className="font-semibold text-[var(--text-secondary)]">
            {section.accuracy}%
          </div>
          <div className="text-[var(--text-muted)]">Accuracy</div>
        </div>
      </div>
    </div>
  );
}

// ─── Subject Card ──────────────────────────────────────────────────────────────
function SubjectCard({
  subj,
  animationReady,
}: {
  subj: SubjectPerformance;
  animationReady: boolean;
}) {
  const fillWidth = animationReady ? subj.accuracy : 0;
  const color =
    subj.accuracy >= 75
      ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
      : subj.accuracy >= 55
      ? "bg-gradient-to-r from-amber-500 to-amber-400"
      : "bg-gradient-to-r from-red-500 to-red-400";

  const speedColor =
    subj.speedRating === "Fast"
      ? "text-emerald-400"
      : subj.speedRating === "Slow"
      ? "text-red-400"
      : "text-amber-400";

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-[var(--text-primary)] text-sm">
          {subj.subject}
        </h3>
        <span className={`text-xs font-medium ${speedColor}`}>
          {subj.speedRating}
        </span>
      </div>
      <div className="progress-track mb-3">
        <div
          className={`progress-fill ${color}`}
          style={{ width: `${fillWidth}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>
          {subj.correct}/{subj.attempted} correct
          {subj.totalQuestions !== subj.attempted &&
            ` (${subj.totalQuestions - subj.attempted} skipped)`}
        </span>
        <span className="font-bold text-[var(--text-secondary)]">
          {subj.accuracy}%
        </span>
      </div>
    </div>
  );
}
