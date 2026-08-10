"use client";

import { useState, useEffect } from "react";
import Logo from "@/components/Logo";

const PRIMARY_STORAGE_KEY = "prepudaan_user_name";
const LEGACY_STORAGE_KEY = "examforge_user_name";

export default function NameEntryModal() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PRIMARY_STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (stored) {
      setName(stored);
      setVisible(false);
    } else {
      // Small delay so page renders first
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    localStorage.setItem(PRIMARY_STORAGE_KEY, trimmed);
    setName(trimmed);
    setSubmitted(true);
    setTimeout(() => setVisible(false), 800);
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div
        className="glass-card w-full max-w-md mx-4 overflow-hidden"
        style={{
          animation: "fadeInUp 0.4s ease-out",
          boxShadow: "0 0 60px rgba(99,102,241,0.25), 0 24px 80px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, #6366f1, #a78bfa, #f59e0b)" }}
        />

        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <Logo size="lg" showText={false} />
          </div>

          {!submitted ? (
            <>
              <h2 className="text-2xl font-extrabold text-center text-[var(--text-primary)] mb-2">
                Welcome to PrepUdaan!
              </h2>
              <p className="text-[var(--text-secondary)] text-center text-sm mb-7 leading-relaxed">
                Enter your name to personalize your experience and result page.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="user-name-input"
                    className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="user-name-input"
                    type="text"
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. Arjun Sharma"
                    maxLength={40}
                    className="w-full px-4 py-3 rounded-xl text-[var(--text-primary)] text-base font-medium placeholder:text-[var(--text-muted)] focus:outline-none transition-all"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1.5px solid var(--border)",
                    }}
                  />
                </div>

                <button
                  id="name-submit-btn"
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background: inputValue.trim()
                      ? "linear-gradient(135deg, #6366f1, #818cf8)"
                      : "#374151",
                    boxShadow: inputValue.trim()
                      ? "0 8px 24px rgba(99,102,241,0.35)"
                      : "none",
                  }}
                >
                  Let's Begin →
                </button>

                <button
                  type="button"
                  id="skip-name-btn"
                  onClick={() => {
                    const fallback = "Guest";
                    localStorage.setItem(PRIMARY_STORAGE_KEY, fallback);
                    setVisible(false);
                  }}
                  className="w-full py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                >
                  Skip for now
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                Welcome, {name}!
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Your journey starts now. All the best!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Utility to read the name from localStorage (used on result page) ──────────
export function getUserName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(PRIMARY_STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY) ?? "Guest";
}
