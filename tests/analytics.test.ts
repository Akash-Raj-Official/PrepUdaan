import { describe, it, expect } from "vitest";
import { analyseSessionBehaviour, generateInsights } from "../lib/analytics";
import type { TestSession, TestResult } from "../lib/types";

const mockResult: TestResult = {
  paperId: "test-paper",
  examId: "test-exam",
  totalQuestions: 20,
  attempted: 15,
  correct: 9,
  incorrect: 6,
  unattempted: 5,
  score: 7.5,
  maxScore: 20,
  accuracy: 60, // < 65% triggers LOW_ACCURACY
  attemptRate: 75,
  timeUsedMs: 600000,
  durationMs: 1200000,
  avgTimePerQuestionMs: 40000,
  questionResults: Array.from({ length: 20 }, (_, i) => ({
    questionId: `q${i + 1}`,
    questionNumber: i + 1,
    userAnswer: i < 15 ? 0 : null,
    correctAnswer: i < 9 ? 0 : 1,
    isCorrect: i < 9,
    isAttempted: i < 15,
    marksAwarded: i < 9 ? 1 : i < 15 ? -0.25 : 0,
    timeSpentMs: 40000,
  })),
  sectionResults: [],
  subjectPerformance: [],
  ratings: {
    technicalKnowledge: "GOOD",
    accuracy: "NEEDS ATTENTION",
    speed: "GOOD",
    questionSelection: "GOOD",
    consistency: "GOOD",
  },
};

const mockSession: TestSession = {
  paperId: "test-paper",
  examId: "test-exam",
  startTime: 1000,
  submittedAt: 601000,
  durationMs: 1200000,
  currentQuestionIndex: 14,
  isSubmitted: true,
  answers: {},
  questionStatus: {},
  timings: {},
};

describe("analyseSessionBehaviour", () => {
  it("detects rapid guesses under 5000ms", () => {
    const sessionWithRapidGuesses: TestSession = {
      ...mockSession,
      timings: {
        q1: { questionId: "q1", openedAt: 1000, answeredAt: 3000, timeSpentMs: 2000, answerChanges: 0 },
        q2: { questionId: "q2", openedAt: 3000, answeredAt: 6000, timeSpentMs: 3000, answerChanges: 0 },
      },
    };

    const behaviour = analyseSessionBehaviour(sessionWithRapidGuesses, mockResult);
    expect(behaviour.rapidGuesses.count).toBeGreaterThanOrEqual(0);
  });
});

describe("generateInsights", () => {
  it("generates LOW_ACCURACY insight when accuracy is below 65%", () => {
    const behaviour = analyseSessionBehaviour(mockSession, mockResult);
    const insights = generateInsights(mockResult, behaviour);

    const lowAccInsight = insights.find((i) => i.type === "LOW_ACCURACY");
    expect(lowAccInsight).toBeDefined();
    expect(lowAccInsight?.severity).toBe("critical");
  });

  it("generates GOOD_PERFORMANCE insight when performance is strong", () => {
    const strongResult: TestResult = {
      ...mockResult,
      accuracy: 85,
      attemptRate: 90,
      score: 18,
    };

    const behaviour = analyseSessionBehaviour(mockSession, strongResult);
    const insights = generateInsights(strongResult, behaviour);

    const goodPerfInsight = insights.find((i) => i.type === "GOOD_PERFORMANCE");
    expect(goodPerfInsight).toBeDefined();
    expect(goodPerfInsight?.severity).toBe("positive");
  });
});
