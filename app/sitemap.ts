import type { MetadataRoute } from "next";
import { getAllExamSummaries } from "@/lib/data-loader";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://akash-raj-official.github.io/PrepUdaan";
  const now = new Date();

  const exams = await getAllExamSummaries();
  const examUrls: MetadataRoute.Sitemap = exams.map((e) => ({
    url: `${baseUrl}/exams/${e.examId}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/interview-prep`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...examUrls,
  ];
}
