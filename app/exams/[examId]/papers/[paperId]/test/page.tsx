import { getExamConfig, getPaper, getAllExamSummaries, getPapersForExam } from "@/lib/data-loader";
import { notFound } from "next/navigation";
import ExamInterface from "@/components/exam/ExamInterface";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ examId: string; paperId: string }>;
}

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

export const metadata: Metadata = {
  title: "Examination in Progress",
  description: "Your timed examination is running.",
};

export default async function TestPage({ params }: Props) {
  const { examId, paperId } = await params;
  const fullPaperId = `${examId}-${paperId}`;

  const [exam, paper] = await Promise.all([
    getExamConfig(examId),
    getPaper(examId, fullPaperId),
  ]);

  if (!exam || !paper) notFound();

  return <ExamInterface paper={paper} exam={exam} />;
}
