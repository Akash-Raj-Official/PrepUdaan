// ─── Core Data Types ──────────────────────────────────────────────────────────

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  questionNumber: number;
  question: string;
  options: [string, string, string, string]; // exactly 4 options
  correctAnswer: 0 | 1 | 2 | 3; // index into options
  explanation?: string;
  subject?: string;
  topic?: string;
  difficulty?: Difficulty;
}

export interface Section {
  id: string;
  name: string;
  questionIds: string[]; // ordered list of question IDs in this section
  maxQuestions: number;
  maxMarks: number;
}

export interface MarkingScheme {
  correct: number;
  negative: number; // stored as positive number, applied as deduction
  unattempted: number; // usually 0
}

export interface ExamConfig {
  examId: string;
  name: string;
  shortName: string;
  authority: string;
  category: ExamCategory;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  marking: MarkingScheme;
  sections: Section[];
  tags: string[];
  allowNavigation: boolean; // can jump between questions
  allowMarkForReview: boolean;
}

export type ExamCategory =
  | "SSC"
  | "Banking"
  | "Railway"
  | "PSU"
  | "Space / Technical"
  | "Teaching";

export interface Paper {
  paperId: string;
  examId: string;
  title: string;
  year: number;
  shift?: string;
  discipline?: string;
  language: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  marking: MarkingScheme;
  sections: PaperSection[];
  questions: Question[];
  isOfficial: boolean; // true = actual previous year, false = mock
}

export interface PaperSection {
  sectionId: string;
  name: string;
  questionCount: number;
  marks: number;
  questionRange: [number, number]; // 1-indexed [start, end] inclusive
}

// ─── Test Session (runtime state) ─────────────────────────────────────────────

export type QuestionStatus =
  | "NOT_VISITED"
  | "VISITED"
  | "ANSWERED"
  | "MARKED_FOR_REVIEW"
  | "ANSWERED_AND_MARKED";

export interface QuestionTiming {
  questionId: string;
  openedAt: number; // timestamp ms
  answeredAt: number | null; // timestamp ms, null if unanswered
  timeSpentMs: number;
  answerChanges: number;
}

export interface TestSession {
  paperId: string;
  examId: string;
  startTime: number; // timestamp ms
  durationMs: number;
  currentQuestionIndex: number;
  answers: Record<string, 0 | 1 | 2 | 3 | null>; // questionId → option index or null
  questionStatus: Record<string, QuestionStatus>;
  timings: Record<string, QuestionTiming>;
  isSubmitted: boolean;
  submittedAt: number | null;
}

// ─── Result Types ──────────────────────────────────────────────────────────────

export interface QuestionResult {
  questionId: string;
  questionNumber: number;
  subject?: string;
  topic?: string;
  userAnswer: 0 | 1 | 2 | 3 | null;
  correctAnswer: 0 | 1 | 2 | 3;
  isCorrect: boolean;
  isAttempted: boolean;
  marksAwarded: number;
  timeSpentMs: number;
}

export interface SectionResult {
  sectionId: string;
  sectionName: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
  accuracy: number; // 0-100
  avgTimeMs: number;
}

export interface SubjectPerformance {
  subject: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  accuracy: number; // 0-100
  avgTimeMs: number;
  speedRating: "Fast" | "Normal" | "Slow";
}

export type PerformanceRating = "STRONG" | "GOOD" | "NEEDS ATTENTION" | "WEAK";

export interface TestResult {
  paperId: string;
  examId: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
  maxScore: number;
  accuracy: number; // 0-100, based on attempted
  attemptRate: number; // 0-100
  timeUsedMs: number;
  durationMs: number;
  avgTimePerQuestionMs: number;
  questionResults: QuestionResult[];
  sectionResults: SectionResult[];
  subjectPerformance: SubjectPerformance[];
  // Computed ratings
  ratings: {
    technicalKnowledge: PerformanceRating;
    accuracy: PerformanceRating;
    speed: PerformanceRating;
    questionSelection: PerformanceRating;
    consistency: PerformanceRating;
  };
}

// ─── Insight / Recommendation Types ───────────────────────────────────────────

export type InsightType =
  | "LOW_ACCURACY"
  | "LOW_ATTEMPTS"
  | "SLOW_SPEED"
  | "RAPID_GUESSING"
  | "END_OF_TEST_DROP"
  | "INCONSISTENT_TIMING"
  | "GOOD_PERFORMANCE";

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
  recommendation: string;
  severity: "positive" | "warning" | "critical";
}

// ─── Catalog Types (for homepage/navigation) ──────────────────────────────────

export interface ExamSummary {
  examId: string;
  name: string;
  shortName: string;
  authority: string;
  category: ExamCategory;
  description: string;
  paperCount: number;
  tags: string[];
}

export interface PaperSummary {
  paperId: string;
  examId: string;
  title: string;
  year: number;
  shift?: string;
  discipline?: string;
  totalQuestions: number;
  durationMinutes: number;
  isOfficial: boolean;
}
