import type {
  Paper,
  ExamConfig,
  TestSession,
  QuestionResult,
  SectionResult,
  SubjectPerformance,
  TestResult,
  PerformanceRating,
} from "./types";

// ─── Main Scoring Function ─────────────────────────────────────────────────────

export function calculateScore(
  session: TestSession,
  paper: Paper,
  exam: ExamConfig
): TestResult {
  const { answers, timings } = session;
  const marking = paper.marking ?? exam.marking;

  // ── Per-question results ──────────────────────────────────────────────────────
  const questionResults: QuestionResult[] = paper.questions.map((q) => {
    const userAnswer = answers[q.id] ?? null;
    const isAttempted = userAnswer !== null;
    const isCorrect = isAttempted && userAnswer === q.correctAnswer;
    const isIncorrect = isAttempted && !isCorrect;

    let marksAwarded = 0;
    if (isCorrect) marksAwarded = marking.correct;
    else if (isIncorrect) marksAwarded = -marking.negative;

    const timing = timings[q.id];
    const timeSpentMs = timing?.timeSpentMs ?? 0;

    return {
      questionId: q.id,
      questionNumber: q.questionNumber,
      subject: q.subject,
      topic: q.topic,
      explanation: q.explanation,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      isAttempted,
      marksAwarded,
      timeSpentMs,
    };
  });

  // ── Totals ────────────────────────────────────────────────────────────────────
  const attempted = questionResults.filter((r) => r.isAttempted).length;
  const correct = questionResults.filter((r) => r.isCorrect).length;
  const incorrect = questionResults.filter(
    (r) => r.isAttempted && !r.isCorrect
  ).length;
  const unattempted = paper.totalQuestions - attempted;

  const score = parseFloat(
    questionResults.reduce((sum, r) => sum + r.marksAwarded, 0).toFixed(2)
  );
  const maxScore = paper.totalMarks;

  const accuracy =
    attempted > 0 ? parseFloat(((correct / attempted) * 100).toFixed(1)) : 0;
  const attemptRate = parseFloat(
    ((attempted / paper.totalQuestions) * 100).toFixed(1)
  );

  const timeUsedMs = session.submittedAt
    ? session.submittedAt - session.startTime
    : session.durationMs;
  const avgTimePerQuestionMs =
    attempted > 0
      ? Math.round(
          questionResults.filter((r) => r.isAttempted).reduce((s, r) => s + r.timeSpentMs, 0) /
            attempted
        )
      : 0;

  // ── Section results ───────────────────────────────────────────────────────────
  const sectionResults: SectionResult[] = paper.sections.map((sec) => {
    const [start, end] = sec.questionRange;
    const secQuestions = questionResults.filter(
      (r) => r.questionNumber >= start && r.questionNumber <= end
    );
    const secAttempted = secQuestions.filter((r) => r.isAttempted).length;
    const secCorrect = secQuestions.filter((r) => r.isCorrect).length;
    const secIncorrect = secQuestions.filter(
      (r) => r.isAttempted && !r.isCorrect
    ).length;
    const secScore = parseFloat(
      secQuestions.reduce((s, r) => s + r.marksAwarded, 0).toFixed(2)
    );
    const secAccuracy =
      secAttempted > 0
        ? parseFloat(((secCorrect / secAttempted) * 100).toFixed(1))
        : 0;
    const secAvgTime =
      secAttempted > 0
        ? Math.round(
            secQuestions
              .filter((r) => r.isAttempted)
              .reduce((s, r) => s + r.timeSpentMs, 0) / secAttempted
          )
        : 0;

    return {
      sectionId: sec.sectionId,
      sectionName: sec.name,
      totalQuestions: sec.questionCount,
      attempted: secAttempted,
      correct: secCorrect,
      incorrect: secIncorrect,
      unattempted: sec.questionCount - secAttempted,
      score: secScore,
      accuracy: secAccuracy,
      avgTimeMs: secAvgTime,
    };
  });

  // ── Subject performance (from question metadata) ──────────────────────────────
  const subjectMap: Record<
    string,
    { total: number; attempted: number; correct: number; totalTimeMs: number }
  > = {};

  for (const r of questionResults) {
    const subj = r.subject ?? "General";
    if (!subjectMap[subj]) {
      subjectMap[subj] = { total: 0, attempted: 0, correct: 0, totalTimeMs: 0 };
    }
    subjectMap[subj].total++;
    if (r.isAttempted) {
      subjectMap[subj].attempted++;
      subjectMap[subj].totalTimeMs += r.timeSpentMs;
    }
    if (r.isCorrect) subjectMap[subj].correct++;
  }

  // Global avg time for speed rating benchmark
  const globalAvgTimeMs = avgTimePerQuestionMs || 60000;

  const subjectPerformance: SubjectPerformance[] = Object.entries(
    subjectMap
  ).map(([subject, data]) => {
    const subjectAccuracy =
      data.attempted > 0
        ? parseFloat(((data.correct / data.attempted) * 100).toFixed(1))
        : 0;
    const subjectAvgTimeMs =
      data.attempted > 0 ? Math.round(data.totalTimeMs / data.attempted) : 0;

    let speedRating: SubjectPerformance["speedRating"] = "Normal";
    if (subjectAvgTimeMs < globalAvgTimeMs * 0.7) speedRating = "Fast";
    else if (subjectAvgTimeMs > globalAvgTimeMs * 1.4) speedRating = "Slow";

    return {
      subject,
      totalQuestions: data.total,
      attempted: data.attempted,
      correct: data.correct,
      accuracy: subjectAccuracy,
      avgTimeMs: subjectAvgTimeMs,
      speedRating,
    };
  });

  // ── Performance ratings ───────────────────────────────────────────────────────
  const ratings = computeRatings(
    accuracy,
    attemptRate,
    avgTimePerQuestionMs,
    paper.durationMinutes,
    paper.totalQuestions,
    questionResults
  );

  return {
    paperId: paper.paperId,
    examId: paper.examId,
    totalQuestions: paper.totalQuestions,
    attempted,
    correct,
    incorrect,
    unattempted,
    score,
    maxScore,
    accuracy,
    attemptRate,
    timeUsedMs,
    durationMs: session.durationMs,
    avgTimePerQuestionMs,
    questionResults,
    sectionResults,
    subjectPerformance,
    ratings,
  };
}

// ─── Rating Computation ────────────────────────────────────────────────────────

function computeRatings(
  accuracy: number,
  attemptRate: number,
  avgTimeMs: number,
  durationMinutes: number,
  totalQuestions: number,
  questionResults: QuestionResult[]
): TestResult["ratings"] {
  // Target avg time: full duration / total questions (in ms)
  const targetAvgMs = (durationMinutes * 60 * 1000) / totalQuestions;

  // Technical Knowledge — proxy: accuracy on Professional Knowledge questions
  const pkQuestions = questionResults.filter(
    (r) => r.subject === "Professional Knowledge"
  );
  const pkAccuracy =
    pkQuestions.length > 0 && pkQuestions.some((r) => r.isAttempted)
      ? (pkQuestions.filter((r) => r.isCorrect).length /
          pkQuestions.filter((r) => r.isAttempted).length) *
        100
      : accuracy;

  // End-of-test accuracy comparison
  const half = Math.floor(questionResults.length / 2);
  const firstHalf = questionResults.slice(0, half);
  const secondHalf = questionResults.slice(half);
  const firstHalfAcc = safeAccuracy(firstHalf);
  const secondHalfAcc = safeAccuracy(secondHalf);
  const consistencyDrop = firstHalfAcc - secondHalfAcc;

  return {
    technicalKnowledge: ratePercent(pkAccuracy),
    accuracy: ratePercent(accuracy),
    speed: rateSpeed(avgTimeMs, targetAvgMs),
    questionSelection: rateAttemptRate(attemptRate, accuracy),
    consistency: rateConsistency(consistencyDrop),
  };
}

function safeAccuracy(results: QuestionResult[]): number {
  const attempted = results.filter((r) => r.isAttempted);
  if (attempted.length === 0) return 0;
  return (attempted.filter((r) => r.isCorrect).length / attempted.length) * 100;
}

function ratePercent(pct: number): PerformanceRating {
  if (pct >= 80) return "STRONG";
  if (pct >= 65) return "GOOD";
  if (pct >= 50) return "NEEDS ATTENTION";
  return "WEAK";
}

function rateSpeed(avgMs: number, targetMs: number): PerformanceRating {
  if (avgMs === 0) return "NEEDS ATTENTION";
  const ratio = avgMs / targetMs;
  if (ratio <= 0.8) return "STRONG";
  if (ratio <= 1.1) return "GOOD";
  if (ratio <= 1.4) return "NEEDS ATTENTION";
  return "WEAK";
}

function rateAttemptRate(
  attemptRate: number,
  accuracy: number
): PerformanceRating {
  if (attemptRate >= 85 && accuracy >= 70) return "STRONG";
  if (attemptRate >= 75) return "GOOD";
  if (attemptRate >= 60) return "NEEDS ATTENTION";
  return "WEAK";
}

function rateConsistency(drop: number): PerformanceRating {
  if (drop <= 5) return "STRONG";
  if (drop <= 15) return "GOOD";
  if (drop <= 25) return "NEEDS ATTENTION";
  return "WEAK";
}
