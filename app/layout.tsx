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
    default: "PrepUdaan — Government & Technical Exam Mock Tests",
    template: "%s | PrepUdaan",
  },
  description:
    "Practice previous-year papers under real exam conditions for IBPS SO, SSC, RRB, ISRO, Coal India, BPSC and more on PrepUdaan. Detailed performance analysis, topic breakdowns, and viva preparation.",
  keywords: [
    "PrepUdaan mock test",
    "IBPS SO IT Officer mock test",
    "SSC Selection Post mock",
    "government exam mock test",
    "previous year papers",
    "RRB Technician mock",
    "ISRO exam mock",
    "banking exam mock",
    "technical viva interview prep",
  ],
  openGraph: {
    title: "PrepUdaan — Government & Technical Exam Mock Tests",
    description:
      "Take actual-style papers, understand your performance, and master technical interview concepts on PrepUdaan.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var theme = saved ? saved : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
        <NameEntryModal />
        {children}
      </body>
    </html>
  );
}
