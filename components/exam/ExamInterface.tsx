"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import type {
  Paper,
  ExamConfig,
  TestSession,
  QuestionStatus,
  QuestionTiming,
} from "@/lib/types";

// ─── Init session ──────────────────────────────────────────────────────────────
function initSession(paper: Paper, exam: ExamConfig): TestSession {
  const now = Date.now();
  const durationMs = (paper.durationMinutes ?? exam.durationMinutes) * 60 * 1000;
  return {
    paperId: paper.paperId,
    examId: paper.examId,
    startTime: now,
    durationMs,
    currentQuestionIndex: 0,
    answers: Object.fromEntries(paper.questions.map((q) => [q.id, null])),
    questionStatus: Object.fromEntries(
      paper.questions.map((q) => [q.id, "NOT_VISITED" as QuestionStatus])
    ),
    timings: Object.fromEntries(
      paper.questions.map((q) => [
        q.id,
        {
          questionId: q.id,
          openedAt: q.questionNumber === 1 ? now : 0,
          answeredAt: null,
          timeSpentMs: 0,
          answerChanges: 0,
        } satisfies QuestionTiming,
      ])
    ),
    isSubmitted: false,
    submittedAt: null,
  };
}

// ─── Timer hook ────────────────────────────────────────────────────────────────
function useTimer(startTime: number, durationMs: number) {
  const [remaining, setRemaining] = useState(
    Math.max(0, durationMs - (Date.now() - startTime))
  );
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, durationMs - (Date.now() - startTime)));
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [startTime, durationMs]);
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  return {
    remaining,
    display: `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
    isDanger: remaining <= 5 * 60 * 1000,
    isExpired: remaining <= 0,
  };
}

// ─── Status helpers ────────────────────────────────────────────────────────────
function statusClass(status: QuestionStatus) {
  if (status === "ANSWERED") return "answered";
  if (status === "MARKED_FOR_REVIEW") return "marked";
  if (status === "ANSWERED_AND_MARKED") return "answered-marked";
  if (status === "VISITED") return "visited";
  return "not-visited";
}

// ─── Navigator Panel (shared between desktop sidebar & mobile drawer) ──────────
function NavigatorPanel({
  paper,
  session,
  onNavigate,
}: {
  paper: Paper;
  session: TestSession;
  onNavigate: (idx: number) => void;
}) {
  const answered = Object.values(session.answers).filter((v) => v !== null).length;
  const marked = Object.values(session.questionStatus).filter(
    (s) => s === "MARKED_FOR_REVIEW" || s === "ANSWERED_AND_MARKED"
  ).length;
  const visited = Object.values(session.questionStatus).filter(
    (s) => s !== "NOT_VISITED"
  ).length;

  return (
    <>
      {/* Stats */}
      <div className="px-3 pt-3 pb-2 border-b border-[var(--border)]">
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          {[
            { label: "Ans", value: answered, cls: "badge-emerald" },
            { label: "Marked", value: marked, cls: "badge-amber" },
            { label: "Visited", value: visited, cls: "badge-indigo" },
            { label: "Unseen", value: paper.totalQuestions - visited, cls: "text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)]" },
          ].map((s) => (
            <div key={s.label} className={`rounded-lg p-1.5 text-center ${s.cls}`}>
              <div className="font-bold text-sm leading-none">{s.value}</div>
              <div className="opacity-80 leading-none mt-0.5 text-[0.6rem]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Question grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {paper.sections.map((sec) => {
          const secQs = paper.questions.filter(
            (q) => q.questionNumber >= sec.questionRange[0] && q.questionNumber <= sec.questionRange[1]
          );
          return (
            <div key={sec.sectionId}>
              <p className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                {sec.name}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {secQs.map((q) => {
                  const isCurrent = paper.questions[session.currentQuestionIndex]?.id === q.id;
                  const idx = paper.questions.findIndex((pq) => pq.id === q.id);
                  return (
                    <button
                      key={q.id}
                      id={`nav-q-${q.questionNumber}`}
                      onClick={() => onNavigate(idx)}
                      className={`q-nav-btn ${statusClass(session.questionStatus[q.id])} ${isCurrent ? "current" : ""}`}
                      title={`Q${q.questionNumber}`}
                    >
                      {q.questionNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ExamInterface({ paper, exam }: { paper: Paper; exam: ExamConfig }) {
  const router = useRouter();
  const [session, setSession] = useState<TestSession>(() => initSession(paper, exam));
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNavDrawer, setShowNavDrawer] = useState(false);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const timer = useTimer(session.startTime, session.durationMs);
  const currentQ = paper.questions[session.currentQuestionIndex];
  const questionOpenedAt = useRef<number>(Date.now());

  // ── Mark VISITED on question change ────────────────────────────────────────
  useEffect(() => {
    questionOpenedAt.current = Date.now();
    setSession((prev) => {
      const qId = paper.questions[prev.currentQuestionIndex].id;
      const currentStatus = prev.questionStatus[qId];
      return {
        ...prev,
        questionStatus: {
          ...prev.questionStatus,
          [qId]: currentStatus === "NOT_VISITED" ? "VISITED" : currentStatus,
        },
        timings: {
          ...prev.timings,
          [qId]: { ...prev.timings[qId], openedAt: Date.now() },
        },
      };
    });
  }, [session.currentQuestionIndex, paper.questions]);

  // ── Auto-submit on timer expiry ────────────────────────────────────────────
  useEffect(() => {
    if (timer.isExpired && !session.isSubmitted) submitTest(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isExpired, session.isSubmitted]);

  // ── Track section ──────────────────────────────────────────────────────────
  useEffect(() => {
    const qNum = currentQ.questionNumber;
    const idx = paper.sections.findIndex(
      (s) => qNum >= s.questionRange[0] && qNum <= s.questionRange[1]
    );
    if (idx !== -1) setCurrentSectionIdx(idx);
  }, [currentQ, paper.sections]);

  // ── Record time before navigating ──────────────────────────────────────────
  const recordTimeSpent = useCallback(
    (s: TestSession, qIdx: number) => {
      const qId = paper.questions[qIdx].id;
      const elapsed = Date.now() - questionOpenedAt.current;
      return {
        ...s,
        timings: {
          ...s.timings,
          [qId]: { ...s.timings[qId], timeSpentMs: (s.timings[qId].timeSpentMs ?? 0) + elapsed },
        },
      };
    },
    [paper.questions]
  );

  const goToQuestion = useCallback(
    (idx: number) => {
      setSession((prev) => ({ ...recordTimeSpent(prev, prev.currentQuestionIndex), currentQuestionIndex: idx }));
      setShowNavDrawer(false);
    },
    [recordTimeSpent]
  );

  const selectAnswer = useCallback(
    (optionIdx: 0 | 1 | 2 | 3) => {
      setSession((prev) => {
        const qId = currentQ.id;
        const hadAnswer = prev.answers[qId] !== null;
        const isMarked = prev.questionStatus[qId] === "MARKED_FOR_REVIEW" || prev.questionStatus[qId] === "ANSWERED_AND_MARKED";
        return {
          ...prev,
          answers: { ...prev.answers, [qId]: optionIdx },
          questionStatus: { ...prev.questionStatus, [qId]: isMarked ? "ANSWERED_AND_MARKED" : "ANSWERED" },
          timings: {
            ...prev.timings,
            [qId]: { ...prev.timings[qId], answeredAt: Date.now(), answerChanges: prev.timings[qId].answerChanges + (hadAnswer ? 1 : 0) },
          },
        };
      });
    },
    [currentQ.id]
  );

  const clearAnswer = useCallback(() => {
    setSession((prev) => {
      const qId = currentQ.id;
      const isMarked = prev.questionStatus[qId] === "ANSWERED_AND_MARKED";
      return {
        ...prev,
        answers: { ...prev.answers, [qId]: null },
        questionStatus: { ...prev.questionStatus, [qId]: isMarked ? "MARKED_FOR_REVIEW" : "VISITED" },
      };
    });
  }, [currentQ.id]);

  const toggleMark = useCallback(() => {
    setSession((prev) => {
      const qId = currentQ.id;
      const cur = prev.questionStatus[qId];
      const next: QuestionStatus =
        cur === "ANSWERED" ? "ANSWERED_AND_MARKED" :
        cur === "ANSWERED_AND_MARKED" ? "ANSWERED" :
        cur === "MARKED_FOR_REVIEW" ? "VISITED" : "MARKED_FOR_REVIEW";
      return { ...prev, questionStatus: { ...prev.questionStatus, [qId]: next } };
    });
  }, [currentQ.id]);

  const submitTest = useCallback(
    (autoSubmit = false) => {
      setSession((prev) => {
        const updated = recordTimeSpent(prev, prev.currentQuestionIndex);
        const final = { ...updated, isSubmitted: true, submittedAt: Date.now() };
        if (typeof window !== "undefined") {
          sessionStorage.setItem(`examSession_${paper.paperId}`, JSON.stringify(final));
          sessionStorage.setItem(`examPaper_${paper.paperId}`, JSON.stringify(paper));
          sessionStorage.setItem(`examConfig_${paper.examId}`, JSON.stringify(exam));
        }
        return final;
      });
      if (!autoSubmit) setShowSubmitModal(false);
      const pid = paper.paperId.replace(`${paper.examId}-`, "");
      router.push(`/exams/${paper.examId}/papers/${pid}/result`);
    },
    [paper, exam, router, recordTimeSpent]
  );

  const answered = Object.values(session.answers).filter((v) => v !== null).length;
  const marked = Object.values(session.questionStatus).filter(
    (s) => s === "MARKED_FOR_REVIEW" || s === "ANSWERED_AND_MARKED"
  ).length;

  return (
    <div className="h-[100dvh] flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      {/* ── Top Bar ─────────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-3 sm:px-5 h-13 min-h-[52px] border-b border-[var(--border)] bg-[var(--bg-secondary)] shrink-0 gap-2">
        {/* Left: Logo + exam name */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="hidden sm:block">
            <Logo size="sm" />
          </div>
          <span className="text-[var(--border)] hidden sm:inline">|</span>
          <span className="text-[var(--text-secondary)] text-xs font-medium truncate">
            {exam.shortName}
          </span>
        </div>

        {/* Centre: Timer */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-lg shrink-0 ${
            timer.isDanger
              ? "text-red-400 bg-red-500/10 border border-red-500/30 timer-danger"
              : "text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border)]"
          }`}
        >
          ⏱️ {timer.display}
        </div>

        {/* Right: Theme toggle + Mobile nav toggle + submit */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          {/* Mobile nav toggle */}
          <button
            id="mobile-nav-btn"
            onClick={() => setShowNavDrawer(true)}
            className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] text-xs font-semibold"
          >
            📋 <span className="text-emerald-700 dark:text-emerald-400 font-bold">{answered}</span>
          </button>
          <button
            id="submit-test-btn"
            onClick={() => setShowSubmitModal(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            Submit
          </button>
        </div>
      </header>

      {/* ── Section Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-[var(--border)] bg-[var(--bg-secondary)] shrink-0 overflow-x-auto no-scrollbar">
        {paper.sections.map((sec, i) => (
          <button
            key={sec.sectionId}
            onClick={() => {
              const firstQIdx = paper.questions.findIndex(
                (q) => q.questionNumber === sec.questionRange[0]
              );
              if (firstQIdx !== -1) goToQuestion(firstQIdx);
            }}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
              i === currentSectionIdx
                ? "border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--badge-indigo-bg)] font-semibold"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {sec.name}
            <span className="ml-1 opacity-60">({sec.questionCount})</span>
          </button>
        ))}
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Question Panel ────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable question area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
            {/* Q header */}
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-card)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                Q {currentQ.questionNumber} / {paper.totalQuestions}
              </span>
              {currentQ.subject && (
                <span className="text-xs px-2.5 py-1 rounded-full badge-indigo font-medium">
                  {currentQ.subject}
                </span>
              )}
              {currentQ.difficulty && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  currentQ.difficulty === "easy"
                    ? "badge-emerald"
                    : currentQ.difficulty === "hard"
                    ? "badge-red"
                    : "badge-amber"
                }`}>
                  {currentQ.difficulty}
                </span>
              )}
            </div>

            {/* Question text */}
            <div className="glass-card p-4 sm:p-5 mb-5">
              <p className="text-[var(--text-primary)] text-sm sm:text-base lg:text-lg leading-relaxed font-medium">
                {currentQ.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, i) => {
                const isSelected = session.answers[currentQ.id] === i;
                return (
                  <button
                    key={i}
                    id={`option-${i}`}
                    onClick={() => selectAnswer(i as 0 | 1 | 2 | 3)}
                    className={`option-btn ${isSelected ? "selected" : ""}`}
                  >
                    <span className="inline-flex items-start gap-3">
                      <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-all ${
                        isSelected ? "bg-indigo-600 border-indigo-500 text-white" : "border-[var(--border-light)] text-[var(--text-muted)]"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm sm:text-base leading-relaxed">{opt}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Bottom Controls ─────────────────────────────────────────────────── */}
          <div className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 shrink-0">
            <button
              id="prev-question-btn"
              onClick={() => goToQuestion(Math.max(0, session.currentQuestionIndex - 1))}
              disabled={session.currentQuestionIndex === 0}
              className="px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] text-xs sm:text-sm font-medium hover:bg-[var(--bg-card)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>

            <div className="flex items-center gap-1.5">
              {session.answers[currentQ.id] !== null && (
                <button
                  id="clear-answer-btn"
                  onClick={clearAnswer}
                  className="px-2.5 py-1.5 rounded-lg text-red-400 text-xs font-medium hover:bg-red-500/10 border border-red-500/20 transition-all"
                >
                  Clear
                </button>
              )}
              <button
                id="mark-review-btn"
                onClick={toggleMark}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  session.questionStatus[currentQ.id] === "MARKED_FOR_REVIEW" ||
                  session.questionStatus[currentQ.id] === "ANSWERED_AND_MARKED"
                    ? "badge-amber font-semibold"
                    : "border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
                }`}
              >
                🔖 {session.questionStatus[currentQ.id] === "MARKED_FOR_REVIEW" || session.questionStatus[currentQ.id] === "ANSWERED_AND_MARKED" ? "Marked" : "Mark"}
              </button>
            </div>

            <button
              id="next-question-btn"
              onClick={() => goToQuestion(Math.min(paper.questions.length - 1, session.currentQuestionIndex + 1))}
              disabled={session.currentQuestionIndex === paper.questions.length - 1}
              className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>

        {/* ── Desktop sidebar navigator ──────────────────────────────────────────── */}
        <aside className="w-52 xl:w-60 border-l border-[var(--border)] bg-[var(--bg-secondary)] hidden md:flex flex-col overflow-hidden">
          <NavigatorPanel paper={paper} session={session} onNavigate={goToQuestion} />
        </aside>
      </div>

      {/* ── Mobile Navigator Drawer ────────────────────────────────────────────── */}
      {showNavDrawer && (
        <div className="fixed inset-0 z-50 md:hidden flex" onClick={() => setShowNavDrawer(false)}>
          {/* Scrim */}
          <div className="flex-1 bg-black/60 backdrop-blur-sm" />
          {/* Drawer panel */}
          <div
            className="w-64 bg-[var(--bg-secondary)] border-l border-[var(--border)] flex flex-col h-full overflow-hidden"
            style={{ animation: "slideInRight 0.25s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
              <span className="font-semibold text-[var(--text-primary)] text-sm">Question Navigator</span>
              <button
                onClick={() => setShowNavDrawer(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl leading-none"
              >
                ×
              </button>
            </div>
            <NavigatorPanel paper={paper} session={session} onNavigate={goToQuestion} />
          </div>
        </div>
      )}

      {/* ── Submit Confirmation Modal ──────────────────────────────────────────── */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div
            className="glass-card p-6 sm:p-8 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2">
              Submit Test?
            </h2>
            <p className="text-[var(--text-secondary)] text-sm mb-5">
              You cannot change your answers after submission.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { label: "Answered", value: answered, cls: "badge-emerald" },
                { label: "Unanswered", value: paper.totalQuestions - answered, cls: "badge-red" },
                { label: "Marked", value: marked, cls: "badge-amber" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl p-3 text-center ${s.cls}`}>
                  <div className="text-xl font-bold">{s.value}</div>
                  <div className="text-xs opacity-80 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                id="cancel-submit-btn"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] font-semibold text-sm hover:bg-[var(--bg-card)] transition-all"
              >
                Continue
              </button>
              <button
                id="confirm-submit-btn"
                onClick={() => submitTest(false)}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
