# ⚡ ExamForge

> **Modern, Free, & Private Competitive Exam Practice Platform**

ExamForge is an open-source, client-side examination platform designed to help students and aspirants practice past papers and mock tests for competitive examinations (Banking, Space/Technical, PSUs, SSC, Railways, Teaching, and more). Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.

---

## ✨ Features

- 🎯 **Realistic Exam Simulator**: Timed test environment with section navigation, question palette, flagging for review, and auto-submit features.
- 📊 **Comprehensive Performance Analytics**: Instant score computation, subject-wise breakdown, accuracy rate, speed ratings, and targeted improvement recommendations.
- 🔒 **100% Free & Private**: All data processing runs client-side. No account registration, database, or tracking required.
- 📁 **JSON Schema-Driven Content**: Simple JSON file structures for adding new exams and past year question papers without touching application logic.
- 🛠️ **Automated Validation CLI**: Built-in verification script (`npm run validate-exams`) to ensure all exam datasets comply with structural and answer constraints before deployment.
- 🚀 **Static Export Ready**: Fully compatible with GitHub Pages, Vercel, Netlify, and Cloudflare Pages deployment via static site generation (SSG).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & SSG)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS custom tokens
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **CI/CD**: GitHub Actions (Automated Exam Validation & GitHub Pages Deployment)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or v20.x (Recommended: v20 LTS)
- **npm**: v9.x or higher

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Akash-Raj-Official/Exam-Forge.git
   cd Exam-Forge/examforge
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

4. **Validate exam data**:
   ```bash
   npm run validate-exams
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
examforge/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions auto-deployment pipeline
├── app/                        # Next.js App Router pages & layouts
│   ├── page.tsx                # Homepage catalog & exam directory
│   ├── layout.tsx              # Root layout & font configuration
│   └── exams/                  # Dynamic routes for exam categories & papers
├── components/                 # UI components
│   ├── exam/                   # Exam interface & result analytics components
│   └── NameEntryModal.tsx     # Candidate name entry modal
├── data/
│   └── exams/                  # Exam definitions & paper JSON files
│       ├── ibps-so-it-officer/
│       ├── coal-india-mt/
│       └── isro-scientist-cs/
├── lib/                        # Core utilities & domain logic
│   ├── analytics.ts            # Performance analytics & recommendation engine
│   ├── data-loader.ts          # Static exam loader & paper parser
│   ├── scoring.ts              # Scoring calculation & negative marking rules
│   └── types.ts                # TypeScript interfaces & types
├── scripts/
│   └── validate-exams.ts       # CLI script for JSON data validation
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
1. Runs automated validation on all exam JSON files (`npm run validate-exams`).
2. Builds the static output (`npm run build`).
3. Deploys automatically to **GitHub Pages** whenever changes are pushed to `main` or `master`.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request to add new exam papers, refine scoring algorithms, or enhance the UI.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
