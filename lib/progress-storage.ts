import type { TestResult } from "./types";

export interface AttemptRecord {
  attemptId: string;
  examId: string;
  paperId: string;
  paperTitle: string;
  score: number;
  maxScore: number;
  accuracy: number;
  attemptRate: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  dateIso: string;
}

const PRIMARY_KEY = "prepudaan_attempt_history";
const LEGACY_KEY = "examforge_attempt_history";

export function getAttemptHistory(): AttemptRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PRIMARY_KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AttemptRecord[];
  } catch {
    return [];
  }
}

export function saveAttemptToHistory(result: TestResult, paperTitle: string): AttemptRecord {
  const history = getAttemptHistory();
  const record: AttemptRecord = {
    attemptId: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    examId: result.examId,
    paperId: result.paperId,
    paperTitle,
    score: result.score,
    maxScore: result.maxScore,
    accuracy: result.accuracy,
    attemptRate: result.attemptRate,
    attempted: result.attempted,
    correct: result.correct,
    incorrect: result.incorrect,
    unattempted: result.unattempted,
    dateIso: new Date().toISOString(),
  };

  const updated = [record, ...history].slice(0, 100); // keep last 100 attempts
  if (typeof window !== "undefined") {
    localStorage.setItem(PRIMARY_KEY, JSON.stringify(updated));
  }
  return record;
}

export function getPaperAttempts(paperId: string): AttemptRecord[] {
  return getAttemptHistory().filter((att) => att.paperId === paperId);
}

export function exportProgressJSON(): string {
  const history = getAttemptHistory();
  const exportPayload = {
    app: "PrepUdaan",
    version: "1.0",
    exportedAt: new Date().toISOString(),
    totalAttempts: history.length,
    history,
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function importProgressJSON(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data || !Array.isArray(data.history)) {
      return { success: false, count: 0, error: "Invalid backup format: 'history' array missing." };
    }
    const current = getAttemptHistory();
    const existingIds = new Set(current.map((c) => c.attemptId));
    const newRecords = (data.history as AttemptRecord[]).filter((r) => r.attemptId && !existingIds.has(r.attemptId));
    
    const merged = [...newRecords, ...current].slice(0, 100);
    localStorage.setItem(PRIMARY_KEY, JSON.stringify(merged));
    return { success: true, count: newRecords.length };
  } catch (err) {
    return { success: false, count: 0, error: err instanceof Error ? err.message : "Failed to parse JSON file." };
  }
}
