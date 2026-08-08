import type { ExamConfig, Paper, PaperSummary, ExamSummary } from "./types";

// ─── Exam index (statically defined, updated when new exams are added) ─────────
const EXAM_IDS = [
  "ibps-so-it-officer",
  "coal-india-mt",
  "isro-scientist-cs",
];

// ─── Load exam configuration ───────────────────────────────────────────────────
export async function getExamConfig(examId: string): Promise<ExamConfig | null> {
  try {
    const exam = await import(`@/data/exams/${examId}/exam.json`);
    return exam.default as ExamConfig;
  } catch {
    return null;
  }
}

// ─── Load a specific paper ─────────────────────────────────────────────────────
export async function getPaper(
  examId: string,
  paperId: string
): Promise<Paper | null> {
  try {
    // paperId format: "ibps-so-it-officer-2024" → file "2024.json"
    const yearPart = paperId.replace(`${examId}-`, "");
    const paper = await import(`@/data/exams/${examId}/papers/${yearPart}.json`);
    return paper.default as Paper;
  } catch {
    return null;
  }
}

// ─── List all papers for an exam ───────────────────────────────────────────────
// In production this would be a manifest file; for MVP we use a static map
const PAPER_MANIFEST: Record<string, string[]> = {
  "ibps-so-it-officer": ["2025", "2024", "2023", "2022"],
  "coal-india-mt": ["2023", "2022"],
  "isro-scientist-cs": ["2023", "2020"],
};

export async function getPapersForExam(examId: string): Promise<PaperSummary[]> {
  const paperYears = PAPER_MANIFEST[examId] ?? [];
  const summaries: PaperSummary[] = [];

  for (const year of paperYears) {
    try {
      const paper = await import(
        `@/data/exams/${examId}/papers/${year}.json`
      );
      const p = paper.default as Paper;
      summaries.push({
        paperId: p.paperId,
        examId: p.examId,
        title: p.title,
        year: p.year,
        shift: p.shift,
        discipline: p.discipline,
        totalQuestions: p.totalQuestions,
        durationMinutes: p.durationMinutes,
        isOfficial: p.isOfficial,
      });
    } catch {
      // skip if file not found
    }
  }

  return summaries;
}

// ─── Get all exam summaries (for homepage) ────────────────────────────────────
export async function getAllExamSummaries(): Promise<ExamSummary[]> {
  const summaries: ExamSummary[] = [];

  for (const examId of EXAM_IDS) {
    const exam = await getExamConfig(examId);
    if (!exam) continue;

    const papers = await getPapersForExam(examId);
    summaries.push({
      examId: exam.examId,
      name: exam.name,
      shortName: exam.shortName,
      authority: exam.authority,
      category: exam.category,
      description: exam.description,
      paperCount: papers.length,
      tags: exam.tags,
    });
  }

  return summaries;
}

// ─── Catalog: all exams grouped by category ───────────────────────────────────
export type ExamsByCategory = Partial<
  Record<string, ExamSummary[]>
>;

export async function getExamsByCategory(): Promise<ExamsByCategory> {
  const all = await getAllExamSummaries();
  return all.reduce<ExamsByCategory>((acc, exam) => {
    const cat = exam.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat]!.push(exam);
    return acc;
  }, {});
}

// ─── Aggregate stats for platform ──────────────────────────────────────────────
export interface GlobalExamStats {
  totalExams: number;
  totalPapers: number;
  totalQuestions: number;
  categoriesCount: number;
}

export async function getExamStats(): Promise<GlobalExamStats> {
  const summaries = await getAllExamSummaries();
  let totalPapers = 0;
  let totalQuestions = 0;
  const categories = new Set<string>();

  for (const summary of summaries) {
    categories.add(summary.category);
    const papers = await getPapersForExam(summary.examId);
    totalPapers += papers.length;
    totalQuestions += papers.reduce((sum, p) => sum + p.totalQuestions, 0);
  }

  return {
    totalExams: summaries.length,
    totalPapers,
    totalQuestions,
    categoriesCount: categories.size,
  };
}

