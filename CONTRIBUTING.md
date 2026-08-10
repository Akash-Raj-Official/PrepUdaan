# Contributing to PrepUdaan ⚡

Thank you for your interest in contributing to **PrepUdaan**! We welcome contributions ranging from adding official exam papers and viva questions to UI enhancements and bug fixes.

---

## 🛠️ Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Akash-Raj-Official/PrepUdaan.git
   cd PrepUdaan
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🧪 Testing & Validation Requirements

Before submitting any Pull Request, ensure that all quality gates pass locally:

- **Type Check**:
  ```bash
  npx tsc --noEmit
  ```
- **Unit Test Suite**:
  ```bash
  npm test
  ```
- **Exam Dataset Validation**:
  ```bash
  npm run validate-exams
  ```
- **Production Build**:
  ```bash
  npm run build
  ```

---

## 📝 Adding New Exam Papers

Exam papers are stored as JSON files under `data/exams/<examId>/papers/<paperId>.json`.

Each paper must satisfy the standard schema:
```json
{
  "paperId": "ibps-so-it-officer-2025",
  "examId": "ibps-so-it-officer",
  "title": "IBPS SO IT Officer 2025 Official Paper",
  "year": 2025,
  "isOfficial": true,
  "totalQuestions": 50,
  "totalMarks": 50,
  "durationMinutes": 45,
  "sections": [ ... ],
  "questions": [
    {
      "id": "q1",
      "questionNumber": 1,
      "question": "Question text here...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of correct answer.",
      "subject": "Professional Knowledge",
      "topic": "DBMS",
      "difficulty": "medium"
    }
  ]
}
```

Run `npm run validate-exams` to verify that option counts, correct answer bounds, and section ranges are valid.

---

## 📜 Code Style & Commit Guidelines

- Write clean, type-safe TypeScript code.
- Follow existing Tailwind and Vanilla CSS variable patterns (`var(--bg-primary)`, `var(--text-primary)`, `badge-emerald`, `badge-amber`).
- Use clear git commit messages, e.g. `feat: add per-question explanation support` or `fix: resolve light mode contrast`.

Thank you for helping empower thousands of aspirants with **PrepUdaan**! 🚀
