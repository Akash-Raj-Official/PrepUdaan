import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NameEntryModal from "@/components/NameEntryModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ExamForge — Government & Technical Exam Mock Tests",
    template: "%s | ExamForge",
  },
  description:
    "Practice previous-year papers under real exam conditions for IBPS SO, SSC, RRB, ISRO, Coal India, BPSC and more. Detailed performance analysis after every attempt.",
  keywords: [
    "IBPS SO IT Officer mock test",
    "SSC Selection Post mock",
    "government exam mock test",
    "previous year papers",
    "RRB Technician mock",
    "ISRO exam mock",
    "banking exam mock",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "ExamForge — Government & Technical Exam Mock Tests",
    description:
      "Take the actual-style paper, understand your performance, and know exactly what to improve.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <NameEntryModal />
        {children}
      </body>
    </html>
  );
}
