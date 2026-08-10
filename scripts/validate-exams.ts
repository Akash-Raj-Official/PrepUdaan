#!/usr/bin/env tsx
/**
 * ExamForge — Exam Validation Script
 * Usage: npx tsx scripts/validate-exams.ts
 * Or:    npm run validate-exams
 */
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "exams");

// ─── ANSI colors ──────────────────────────────────────────────────────────────
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

// ─── Types (minimal, matching lib/types.ts) ────────────────────────────────────
interface ExamConfig {
  examId: string;
  name: string;
  totalQuestions: number;
  totalMarks: number;
  marking: { correct: number; negative: number };
  sections: Array<{ id: string; name: string; maxQuestions: number }>;
}

interface Question {
  id: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Paper {
  paperId: string;
  examId: string;
  totalQuestions: number;
  questions: Question[];
  marking?: { correct: number; negative: number };
}

// ─── Validation ────────────────────────────────────────────────────────────────
let totalErrors = 0;
let totalWarnings = 0;

function pass(msg: string) {
  console.log(`  ${green("✓")} ${msg}`);
}
function fail(msg: string) {
  console.log(`  ${red("✗")} ${msg}`);
  totalErrors++;
}
function warn(msg: string) {
  console.log(`  ${yellow("⚠")} ${msg}`);
  totalWarnings++;
}

function validateExam(examId: string, examDir: string) {
  console.log(`\n${bold(`[EXAM] ${examId}`)}`);

  // 1. Check exam.json exists
  const examJsonPath = path.join(examDir, "exam.json");
  if (!fs.existsSync(examJsonPath)) {
    fail("exam.json not found");
    return;
  }

  let exam: ExamConfig;
  try {
    exam = JSON.parse(fs.readFileSync(examJsonPath, "utf-8"));
    pass("exam.json is valid JSON");
  } catch {
    fail("exam.json is not valid JSON");
    return;
  }

  // 2. Required fields
  const required = ["examId", "name", "totalQuestions", "totalMarks", "marking", "sections"];
  for (const field of required) {
    if (!(field in exam)) {
      fail(`exam.json missing required field: ${field}`);
    }
  }

  if (exam.examId === examId) pass("examId matches directory name");
  else fail(`examId "${exam.examId}" does not match directory "${examId}"`);

  if (exam.marking?.correct > 0) pass("marking.correct > 0");
  else fail("marking.correct must be > 0");

  if (exam.marking?.negative >= 0) pass("marking.negative is valid");
  else fail("marking.negative must be >= 0");

  // 3. Papers
  const papersDir = path.join(examDir, "papers");
  if (!fs.existsSync(papersDir)) {
    warn("No papers/ directory found");
    return;
  }

  const paperFiles = fs
    .readdirSync(papersDir)
    .filter((f) => f.endsWith(".json"));

  if (paperFiles.length === 0) {
    warn("No paper JSON files found in papers/");
    return;
  }

  console.log(dim(`  Found ${paperFiles.length} paper(s)`));

  for (const paperFile of paperFiles) {
    validatePaper(examId, path.join(papersDir, paperFile), paperFile);
  }
}

function validatePaper(
  examId: string,
  paperPath: string,
  paperFile: string
) {
  console.log(`\n  ${bold(`[PAPER] ${paperFile}`)}`);

  let paper: Paper;
  try {
    paper = JSON.parse(fs.readFileSync(paperPath, "utf-8"));
    pass("Valid JSON");
  } catch {
    fail("Not valid JSON");
    return;
  }

  // Required fields
  const required = ["paperId", "examId", "totalQuestions", "questions"];
  for (const field of required) {
    if (!(field in paper)) fail(`Missing required field: ${field}`);
    else pass(`Has field: ${field}`);
  }

  if (paper.examId === examId) pass("examId matches");
  else fail(`examId "${paper.examId}" does not match "${examId}"`);

  // Question count
  if (paper.questions?.length === paper.totalQuestions) {
    pass(`Question count: ${paper.questions.length} matches totalQuestions`);
  } else {
    fail(
      `Question count mismatch: found ${paper.questions?.length}, declared ${paper.totalQuestions}`
    );
  }

  if (!paper.questions) return;

  // Per-question checks
  const ids = new Set<string>();
  const qNums = new Set<number>();
  let qErrors = 0;

  for (const q of paper.questions) {
    if (!q.id) { fail(`Question missing id`); qErrors++; continue; }
    if (ids.has(q.id)) { fail(`Duplicate question id: ${q.id}`); qErrors++; }
    ids.add(q.id);

    if (qNums.has(q.questionNumber)) {
      fail(`Duplicate questionNumber: ${q.questionNumber}`);
      qErrors++;
    }
    qNums.add(q.questionNumber);

    if (!q.question || q.question.trim().length === 0) {
      fail(`Q${q.questionNumber}: Empty question text`);
      qErrors++;
    }

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      fail(`Q${q.questionNumber}: Must have exactly 4 options`);
      qErrors++;
    }

    if (
      typeof q.correctAnswer !== "number" ||
      q.correctAnswer < 0 ||
      q.correctAnswer > 3
    ) {
      fail(`Q${q.questionNumber}: correctAnswer must be 0-3`);
      qErrors++;
    }
  }

  if (qErrors === 0) {
    pass(`All ${paper.questions.length} questions passed individual checks`);
    pass(`No duplicate IDs or question numbers`);
    pass(`All correct answer indexes valid (0-3)`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log(bold("\n🔍 PrepUdaan — Exam Validation\n"));

if (!fs.existsSync(DATA_DIR)) {
  console.log(red("data/exams/ directory not found. Run from project root."));
  process.exit(1);
}

const examDirs = fs
  .readdirSync(DATA_DIR)
  .filter((d) => fs.statSync(path.join(DATA_DIR, d)).isDirectory());

if (examDirs.length === 0) {
  console.log(yellow("No exam directories found in data/exams/"));
  process.exit(0);
}

for (const examId of examDirs) {
  validateExam(examId, path.join(DATA_DIR, examId));
}

console.log(`\n${"─".repeat(50)}`);
if (totalErrors === 0 && totalWarnings === 0) {
  console.log(green(bold("✓ All validations passed!\n")));
  process.exit(0);
} else {
  if (totalErrors > 0)
    console.log(red(`✗ ${totalErrors} error(s) found`));
  if (totalWarnings > 0)
    console.log(yellow(`⚠ ${totalWarnings} warning(s)`));
  console.log();
  process.exit(totalErrors > 0 ? 1 : 0);
}
