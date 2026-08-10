# ⚡ PrepUdaan

> **Modern, Free, & Private Competitive Exam Practice Platform**

**PrepUdaan** is an open-source, client-side examination platform designed to help students and aspirants practice past papers, mock tests, and technical viva questions for competitive examinations (Banking, Space/Technical, PSUs, SSC, Railways, Teaching, and more). Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **TypeScript**, and **Vitest**.

---

## ✨ Features

- 🌗 **Dark & Light Theme Toggle**: Instant, seamless dark and light mode switching with `localStorage` persistence, prefers-color-scheme detection, zero layout flash (FOUC prevention), and tailored CSS variable design tokens across all pages.
- 🎓 **Technical Viva & Interview Prep Hub**: Specialized module for CS/IT aspirants (IBPS SO IT, ISRO Scientist, Coal India MT) featuring curated core technical questions, model responses, key concepts, and interviewer follow-up expectations.
- 🎯 **Realistic Exam Simulator**: Timed test environment with section navigation, question palette, flagging for review, mobile drawer support, and auto-submit features.
- 📊 **Comprehensive Performance Analytics**: Instant score computation, subject-wise breakdown, accuracy rate, speed ratings, candidate name personalization, and targeted improvement recommendations.
- 💡 **Per-Question Explanations**: Detailed step-by-step model explanations for each question in the post-test answer review.
- 📥 **Progress Export & Import (JSON)**: Export your attempt history to JSON files for offline backups, device transfer, or data privacy.
- 📈 **Historical Performance Trends**: Track your progress and accuracy across retakes over time.
- 🧪 **Unit Test Suite & CI/CD Gates**: Automated unit testing (`vitest`) covering scoring math, negative marking, attempt rates, and behavioral analytics.
- 🔒 **100% Free & Private**: All data processing runs client-side inside your browser. No account registration, backend database, or tracking required.
- 📁 **JSON Schema-Driven Content**: Simple JSON file structures for adding new exams and past year question papers without touching application logic.
- 🚀 **SEO & PWA Ready**: Includes dynamic `sitemap.xml`, `robots.txt`, schema metadata, and PWA `manifest.json`.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & SSG)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & CSS Custom Variables
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Testing**: [Vitest](https://vitest.dev/)
- **CI/CD**: GitHub Actions (Automated Type-Checking, Unit Testing, Exam Validation, & GitHub Pages Deployment)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or v20.x (Recommended: v20 LTS)
- **npm**: v9.x or higher

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Akash-Raj-Official/PrepUdaan.git
   cd PrepUdaan
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run Unit Tests**:
   ```bash
   npm test
   ```

5. **Validate exam datasets**:
   ```bash
   npm run validate-exams
   ```

6. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
PrepUdaan/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions auto-deployment pipeline
├── app/                        # Next.js App Router pages, sitemaps & layouts
│   ├── page.tsx                # Homepage catalog & exam directory
│   ├── layout.tsx              # Root layout, theme script & font configuration
│   ├── globals.css             # Theme design tokens & custom component styles
│   ├── interview-prep/         # Technical viva & interview prep hub
│   ├── robots.ts               # Dynamic robots.txt
│   ├── sitemap.ts              # Dynamic sitemap.xml
│   └── exams/                  # Dynamic routes for exam categories & papers
├── components/                 # UI components
│   ├── ThemeToggle.tsx         # Dark/Light mode theme switcher button
│   ├── NameEntryModal.tsx      # Candidate name entry modal
│   └── exam/                   # Exam interface & result analytics components
├── data/
│   └── exams/                  # Exam definitions & paper JSON files
│       ├── ibps-so-it-officer/
│       ├── coal-india-mt/
│       └── isro-scientist-cs/
├── lib/                        # Core utilities & domain logic
│   ├── analytics.ts            # Performance analytics & recommendation engine
│   ├── data-loader.ts          # Static exam loader & paper parser
│   ├── progress-storage.ts     # Attempt history & JSON export/import
│   ├── scoring.ts              # Scoring calculation & negative marking rules
│   └── types.ts                # TypeScript interfaces & types
├── tests/                      # Vitest unit test suite
│   ├── analytics.test.ts
│   └── scoring.test.ts
├── scripts/
│   └── validate-exams.ts       # CLI script for JSON data validation
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License file
├── next.config.ts              # Next.js configuration (static export enabled)
└── package.json
```

---

## 📝 Adding New Exam Papers

Adding a new exam or paper is completely data-driven:

1. **Create an Exam Directory**: Add a folder in `data/exams/<exam-id>/` with an `exam.json` file.
2. **Add Paper Data**: Add paper files under `data/exams/<exam-id>/papers/<year>.json`.
3. **Validate**: Run `npm run validate-exams` to verify question counts, correct option indices, and schema compliance.

---

## ⚙️ GitHub Actions CI/CD Pipeline

The repository includes a pre-configured workflow in `.github/workflows/deploy.yml` that:
1. Performs TypeScript type checking (`npx tsc --noEmit`).
2. Runs the Vitest unit test suite (`npm test`).
3. Runs automated validation on all exam JSON files (`npm run validate-exams`).
4. Builds the static output (`npm run build`).
5. Deploys automatically to **GitHub Pages** whenever changes are pushed to `main` or `master`.

---

## 🤝 Contributing

Contributions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a PR.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
