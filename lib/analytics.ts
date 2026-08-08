import type { TestResult, TestSession, QuestionResult, Insight } from "./types";

// ─── Analytics: detect behavioural patterns ────────────────────────────────────

export interface BehaviourAnalysis {
  rapidGuesses: { count: number; incorrect: number };
  endOfTestDrop: { firstHalfAccuracy: number; secondHalfAccuracy: number; drop: number };
  avgTimeVarianceMs: number;
  longPauseCount: number; // questions where time > 3× average
  answerChangeCount: number;
}

const RAPID_THRESHOLD_MS = 5000; // < 5 sec = rapid guess

export function analyseSessionBehaviour(
  session: TestSession,
  result: TestResult
): BehaviourAnalysis {
  const { timings } = session;
  const qr = result.questionResults;

  // Rapid guesses
  const attempted = qr.filter((r) => r.isAttempted);
  const rapidAttempted = attempted.filter(
    (r) => r.timeSpentMs > 0 && r.timeSpentMs < RAPID_THRESHOLD_MS
  );
  const rapidIncorrect = rapidAttempted.filter((r) => !r.isCorrect);

  // End-of-test accuracy comparison
  const half = Math.floor(qr.length / 2);
  const first = qr.slice(0, half);
  const second = qr.slice(half);
  const firstAcc = safeAcc(first);
  const secondAcc = safeAcc(second);

  // Time variance
  const times = attempted.map((r) => r.timeSpentMs).filter((t) => t > 0);
  const avgTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  const variance =
    times.length > 1
      ? Math.sqrt(
          times.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) /
            times.length
        )
      : 0;

  // Long pauses
  const longPauseCount = attempted.filter(
    (r) => r.timeSpentMs > avgTime * 3
  ).length;

  // Answer changes
  const answerChangeCount = Object.values(timings).reduce(
    (sum, t) => sum + t.answerChanges,
    0
  );

  return {
    rapidGuesses: {
      count: rapidAttempted.length,
      incorrect: rapidIncorrect.length,
    },
    endOfTestDrop: {
      firstHalfAccuracy: firstAcc,
      secondHalfAccuracy: secondAcc,
      drop: firstAcc - secondAcc,
    },
    avgTimeVarianceMs: Math.round(variance),
    longPauseCount,
    answerChangeCount,
  };
}

function safeAcc(results: QuestionResult[]): number {
  const att = results.filter((r) => r.isAttempted);
  if (!att.length) return 0;
  return parseFloat(
    ((att.filter((r) => r.isCorrect).length / att.length) * 100).toFixed(1)
  );
}

// ─── Insight Generator ────────────────────────────────────────────────────────

export function generateInsights(
  result: TestResult,
  behaviour: BehaviourAnalysis
): Insight[] {
  const insights: Insight[] = [];
  const { accuracy, attemptRate, avgTimePerQuestionMs, totalQuestions } = result;

  // ── Case 1: Low accuracy ──────────────────────────────────────────────────────
  if (accuracy < 65 && result.attempted > 0) {
    insights.push({
      type: "LOW_ACCURACY",
      title: "Accuracy Needs Improvement",
      description: `Your attempt rate is reasonable, but your accuracy (${accuracy}%) is currently limiting your score. Each incorrect answer costs 0.25 marks in addition to the missed mark.`,
      recommendation:
        "Focus on strengthening core concepts before increasing attempts. Avoid guessing unless you can eliminate at least 2 options. Review incorrect questions and understand the correct approach.",
      severity: "critical",
    });
  }

  // ── Case 2: Low attempts ──────────────────────────────────────────────────────
  if (attemptRate < 65 && accuracy >= 75) {
    insights.push({
      type: "LOW_ATTEMPTS",
      title: "Strong Accuracy, But Too Many Skipped Questions",
      description: `Your accuracy is strong (${accuracy}%), but you left ${result.unattempted} questions unanswered (${(100 - attemptRate).toFixed(0)}% unattempted). You are leaving significant marks on the table.`,
      recommendation:
        "Work on speed and question selection strategy. Attempt easier questions first, then return to harder ones. Practice more timed full-length mock tests to build stamina.",
      severity: "warning",
    });
  }

  // ── Case 3: Slow speed ────────────────────────────────────────────────────────
  const targetAvgMs =
    (result.durationMs / totalQuestions);
  if (avgTimePerQuestionMs > targetAvgMs * 1.4 && result.attempted > 10) {
    const avgSec = Math.round(avgTimePerQuestionMs / 1000);
    const targetSec = Math.round(targetAvgMs / 1000);
    insights.push({
      type: "SLOW_SPEED",
      title: "Speed Needs Improvement",
      description: `Your average time per attempted question was ${avgSec} seconds, against a target of ~${targetSec} seconds. This is likely preventing you from attempting all questions.`,
      recommendation:
        "Practice timed sets of 25–30 questions under strict time limits. Use a skip-and-return strategy for questions requiring extended calculation. Build speed on high-frequency question types first.",
      severity: "warning",
    });
  }

  // ── Case 4: Rapid guessing ────────────────────────────────────────────────────
  const { rapidGuesses } = behaviour;
  if (rapidGuesses.count >= 10 && rapidGuesses.incorrect >= 7) {
    insights.push({
      type: "RAPID_GUESSING",
      title: "Rapid Guessing Detected",
      description: `${rapidGuesses.count} questions were answered in under 5 seconds, and ${rapidGuesses.incorrect} of them were incorrect. This is likely hurting your score with unnecessary negative marking.`,
      recommendation:
        "Spend a minimum of 5–10 seconds eliminating obviously wrong options before marking an answer. Only make quick guesses when you are genuinely confident. Otherwise, skip and come back.",
      severity: "critical",
    });
  }

  // ── Case 5: End-of-test accuracy drop ─────────────────────────────────────────
  const { endOfTestDrop } = behaviour;
  if (endOfTestDrop.drop >= 15 && result.attempted > 20) {
    insights.push({
      type: "END_OF_TEST_DROP",
      title: "Accuracy Drops Toward End of Exam",
      description: `Your accuracy in the first half of the paper was ${endOfTestDrop.firstHalfAccuracy}%, but dropped to ${endOfTestDrop.secondHalfAccuracy}% in the second half — a drop of ${endOfTestDrop.drop.toFixed(0)} percentage points.`,
      recommendation:
        "Practice full-length (120-minute) timed papers regularly, not just short practice sets. Build the mental endurance needed to maintain concentration for the full exam duration.",
      severity: "warning",
    });
  }

  // ── Case 6: Timing inconsistency ─────────────────────────────────────────────
  if (behaviour.avgTimeVarianceMs > avgTimePerQuestionMs * 1.2 && result.attempted > 15) {
    insights.push({
      type: "INCONSISTENT_TIMING",
      title: "Inconsistent Response Times",
      description:
        "Your response times varied significantly across questions, suggesting concentration lapses or strategy inconsistency during the exam.",
      recommendation:
        "Develop a consistent question-attempt strategy: read once, eliminate, decide. Avoid spending disproportionate time on a single question early in the paper.",
      severity: "warning",
    });
  }

  // ── Positive feedback ─────────────────────────────────────────────────────────
  if (accuracy >= 80 && attemptRate >= 80) {
    insights.push({
      type: "GOOD_PERFORMANCE",
      title: "Excellent Overall Performance",
      description: `You achieved ${accuracy}% accuracy with a ${attemptRate}% attempt rate — a strong combination. Your score of ${result.score}/${result.maxScore} reflects consistent preparation.`,
      recommendation:
        "Maintain this level of preparation. Focus on the 2–3 weakest subject areas to push your score further. Take at least one full mock per week leading up to the actual exam.",
      severity: "positive",
    });
  }

  return insights;
}
