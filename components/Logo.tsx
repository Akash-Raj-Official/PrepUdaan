import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Vector Logo Emblem */}
      <div
        className={`${iconSizes[size]} rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105`}
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(167,139,250,0.15) 100%)",
          border: "1.5px solid rgba(99,102,241,0.35)",
        }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
        >
          <defs>
            <linearGradient id="prepUdaanGrad" x1="2" y1="28" x2="30" y2="4" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="accentGrad" x1="10" y1="22" x2="26" y2="6" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
          {/* Main Soaring Wing / Flight Path */}
          <path
            d="M4 22C8 18 13 15 19 14L28 5C24 11 20 17 18 20C16 23 12 26 6 28L4 22Z"
            fill="url(#prepUdaanGrad)"
          />
          {/* Secondary Upper Wing Feather */}
          <path
            d="M10 16C14 12 18 9 24 7L28 5C22 9 17 14 15 17L10 16Z"
            fill="url(#accentGrad)"
            opacity="0.9"
          />
          {/* Spark Star of Academic Excellence */}
          <path
            d="M25 4L26.5 7.5L30 9L26.5 10.5L25 14L23.5 10.5L20 9L23.5 7.5L25 4Z"
            fill="#f59e0b"
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-extrabold tracking-tight gradient-text ${textSizes[size]}`}>
          PrepUdaan
        </span>
      )}
    </div>
  );
}
