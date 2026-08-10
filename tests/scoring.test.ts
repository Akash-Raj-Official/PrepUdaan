import { describe, it, expect } from "vitest";
import { calculateScore } from "../lib/scoring";
import type { Paper, ExamConfig, TestSession } from "../lib/types";

const mockExam: ExamConfig = {
  examId: "test-exam",
  name: "Test Exam",
  shortName: "TE",
  category: "Space / Technical",
  authority: "PrepUdaan Testing",
  description: "Mock exam for unit testing",
  durationMinutes: 60,
  totalQuestions: 5,
  totalMarks: 5,
  marking: { correct: 1, negative: 0.25, unattempted: 0 },
  tags: ["test"],
  allowNavigation: true,
  allowMarkForReview: true,
  sections: [
    { id: "sec-1", name: "Section 1", questionIds: ["q1", "q2", "q3", "q4", "q5"], maxQuestions: 5, maxMarks: 5 }
  ]
};

const mockPaper: Paper = {
  paperId: "test-exam-2025",
  examId: "test-exam",
  title: "Test Paper 2025",
  year: 2025,
  language: "English",
  isOfficial: true,
  totalQuestions: 5,
  totalMarks: 5,
  durationMinutes: 60,
  marking: { correct: 1, negative: 0.25, unattempted: 0 },
  sections: [
    { sectionId: "sec-1", name: "Section 1", questionRange: [1, 5], questionCount: 5, marks: 5 }
  ],
  questions: [
    { id: "q1", questionNumber: 1, question: "Q1", options: ["A", "B", "C", "D"], correctAnswer: 0, subject: "DBMS" },
    { id: "q2", questionNumber: 2, question: "Q2", options: ["A", "B", "C", "D"], correctAnswer: 1, subject: "DBMS" },
    { id: "q3", questionNumber: 3, question: "Q3", options: ["A", "B", "C", "D"], correctAnswer: 2, subject: "OS" },
    { id: "q4", questionNumber: 4, question: "Q4", options: ["A", "B", "C", "D"], correctAnswer: 3, subject: "OS" },
    { id: "q5", questionNumber: 5, question: "Q5", options: ["A", "B", "C", "D"], correctAnswer: 0, subject: "CN" }
  ]
};

describe("calculateScore", () => {
  it("calculates score correctly with positive and negative marking", () => {
    const session: TestSession = {
      paperId: "test-exam-2025",
      examId: "test-exam",
      startTime: 1000,
      submittedAt: 61000,
      durationMs: 60000,
      currentQuestionIndex: 4,
      isSubmitted: true,
      answers: {
        q1: 0, // Correct (+1)
        q2: 1, // Correct (+1)
        q3: 0, // Incorrect (-0.25)
        q4: 3  // Correct (+1)
      },
      questionStatus: {
        q1: "ANSWERED",
        q2: "ANSWERED",
        q3: "ANSWERED",
        q4: "ANSWERED",
        q5: "NOT_VISITED"
      },
      timings: {
        q1: { questionId: "q1", openedAt: 1000, answeredAt: 11000, timeSpentMs: 10000, answerChanges: 0 },
        q2: { questionId: "q2", openedAt: 11000, answeredAt: 21000, timeSpentMs: 10000, answerChanges: 0 },
        q3: { questionId: "q3", openedAt: 21000, answeredAt: 31000, timeSpentMs: 10000, answerChanges: 0 },
        q4: { questionId: "q4", openedAt: 31000, answeredAt: 41000, timeSpentMs: 10000, answerChanges: 0 }
      }
    };

    const result = calculateScore(session, mockPaper, mockExam);

    expect(result.attempted).toBe(4);
    expect(result.correct).toBe(3);
    expect(result.incorrect).toBe(1);
    expect(result.unattempted).toBe(1);
    expect(result.score).toBe(2.75); // 1 + 1 - 0.25 + 1 = 2.75
    expect(result.accuracy).toBe(75.0); // 3 / 4 = 75%
    expect(result.attemptRate).toBe(80.0); // 4 / 5 = 80%
  });

  it("handles 100% correct score scenario", () => {
    const session: TestSession = {
      paperId: "test-exam-2025",
      examId: "test-exam",
      startTime: 1000,
      submittedAt: 61000,
      durationMs: 60000,
      currentQuestionIndex: 4,
      isSubmitted: true,
      answers: { q1: 0, q2: 1, q3: 2, q4: 3, q5: 0 },
      questionStatus: {
        q1: "ANSWERED", q2: "ANSWERED", q3: "ANSWERED", q4: "ANSWERED", q5: "ANSWERED"
      },
      timings: {}
    };

    const result = calculateScore(session, mockPaper, mockExam);

    expect(result.score).toBe(5);
    expect(result.accuracy).toBe(100);
    expect(result.attemptRate).toBe(100);
  });

  it("handles completely unattempted scenario without errors", () => {
    const session: TestSession = {
      paperId: "test-exam-2025",
      examId: "test-exam",
      startTime: 1000,
      submittedAt: 61000,
      durationMs: 60000,
      currentQuestionIndex: 0,
      isSubmitted: true,
      answers: {},
      questionStatus: {},
      timings: {}
    };

    const result = calculateScore(session, mockPaper, mockExam);

    expect(result.attempted).toBe(0);
    expect(result.score).toBe(0);
    expect(result.accuracy).toBe(0);
    expect(result.attemptRate).toBe(0);
  });
});
