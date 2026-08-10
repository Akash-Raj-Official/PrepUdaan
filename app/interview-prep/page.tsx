"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { VIVA_QUESTIONS, VivaTopic } from "@/data/viva-questions";

const CATEGORIES = [
  "All",
  "Database Systems",
  "Operating Systems",
  "Computer Networks",
  "Data Structures & Algorithms",
  "Software Engineering",
  "Cybersecurity",
  "System Design",
  "Cloud Computing",
];

export default function InterviewPrepPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuestions = useMemo(() => {
    return VIVA_QUESTIONS.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.modelAnswer.toLowerCase().includes(query) ||
        item.keyConcepts.some((kc) => kc.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="gradient-hero min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 text-sm">
          <Link href="/" className="flex items-center gap-1.5 font-bold gradient-text text-lg">
            <span>⚡</span>PrepUdaan
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded-full badge-amber font-semibold hidden sm:inline-block">
              🎓 Technical Viva &amp; Interview Hub
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-amber text-xs font-semibold mb-4">
            Specialized Preparation Module · {VIVA_QUESTIONS.length} Questions
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
            Technical Interview &amp; Viva Questions
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Curated oral technical questions, model viva responses, and interviewer follow-up expectations for candidates targeting IBPS SO IT, ISRO Scientist (CS), Coal India MT, and NIC.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="glass-card p-5 mb-8 space-y-4 animate-fade-in-up delay-100">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search questions, concepts (e.g. ACID, B+ Tree, TCP, Normalization, Semaphore, Docker)..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "badge-amber font-bold shadow-sm"
                    : "bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-4 px-1 text-xs text-[var(--text-muted)]">
          <span>
            Showing <strong className="text-[var(--text-primary)]">{filteredQuestions.length}</strong> of {VIVA_QUESTIONS.length} interview topics
          </span>
          {selectedCategory !== "All" && (
            <span>Category: <strong className="text-[var(--accent-primary)]">{selectedCategory}</strong></span>
          )}
        </div>

        {/* Questions list */}
        <div className="space-y-6 animate-fade-in-up delay-200">
          {filteredQuestions.length === 0 ? (
            <div className="glass-card p-12 text-center text-[var(--text-muted)]">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                No matching viva questions found
              </h3>
              <p className="text-xs">
                Try searching for another topic or selecting "All" categories.
              </p>
            </div>
          ) : (
            filteredQuestions.map((item, idx) => (
              <div
                key={item.id}
                className="glass-card p-6 border border-[var(--border)] hover:border-[var(--accent-primary)]/40 transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)]/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full badge-indigo text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-[var(--accent-primary)] text-sm">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.exams.map((ex) => (
                      <span
                        key={ex}
                        className="px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[10px] text-[var(--text-muted)] font-mono"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Question text */}
                <h3 className="text-lg font-bold text-[var(--text-primary)] leading-snug">
                  {item.question}
                </h3>

                {/* Model answer */}
                <div className="p-4 rounded-xl badge-indigo space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    ✓ Model Viva Answer
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.modelAnswer}
                  </p>
                </div>

                {/* Key concepts & follow-ups */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="space-y-1.5">
                    <div className="font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Key Terminology &amp; Concepts
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.keyConcepts.map((kc) => (
                        <span
                          key={kc}
                          className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)]"
                        >
                          {kc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      Expected Interviewer Follow-Ups
                    </div>
                    <ul className="space-y-1 list-disc list-inside text-[var(--text-muted)]">
                      {item.interviewerFollowUps.map((fu, i) => (
                        <li key={i} className="leading-tight">
                          {fu}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center glass-card p-8 animate-fade-in-up">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Ready to test your timed MCQ performance?
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Practice actual-style objective papers for IBPS SO IT, ISRO Scientist, and Coal India MT under timed conditions.
          </p>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
          >
            ← Back to Exam Catalog
          </Link>
        </div>
      </main>
    </div>
  );
}
