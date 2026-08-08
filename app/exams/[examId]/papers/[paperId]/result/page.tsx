import { getAllExamSummaries, getPapersForExam } from "@/lib/data-loader";
import ResultClient from "@/components/exam/ResultClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Result & Analytics",
  description: "View detailed performance breakdown and insights.",
};

export async function generateStaticParams() {
  const exams = await getAllExamSummaries();
  const params: { examId: string; paperId: string }[] = [];
  for (const exam of exams) {
    const papers = await getPapersForExam(exam.examId);
    for (const paper of papers) {
      const paperSlug = paper.paperId.replace(`${exam.examId}-`, "");
      params.push({
        examId: exam.examId,
        paperId: paperSlug,
      });
    }
  }
  return params;
}

export default function ResultPage() {
  return <ResultClient />;
}
