import Link from "next/link";
import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Technical Viva & Interview Prep | ExamForge",
  description:
    "Master technical interview & viva questions for IBPS SO IT, ISRO Scientist (CS), and Coal India MT (CS/IT). Curated questions on DBMS, OS, Computer Networks, Data Structures, and System Design.",
  keywords: [
    "IBPS SO IT Officer interview questions",
    "ISRO scientist technical interview viva",
    "Coal India MT CS interview prep",
    "technical viva questions computer science",
    "DBMS interview questions IT officer",
    "Operating system viva questions",
  ],
  openGraph: {
    title: "Technical Viva & Interview Prep | ExamForge",
    description:
      "Master technical interview & viva questions for IBPS SO IT, ISRO Scientist, and Coal India MT.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Viva & Interview Prep | ExamForge",
    description:
      "Master technical interview & viva questions for IBPS SO IT, ISRO Scientist, and Coal India MT.",
  },
};

interface VivaTopic {
  id: string;
  category: string;
  question: string;
  exams: string[];
  modelAnswer: string;
  interviewerFollowUps: string[];
  keyConcepts: string[];
}

const VIVA_QUESTIONS: VivaTopic[] = [
  {
    id: "dbms-01",
    category: "Database Systems",
    question: "Explain ACID properties in RDBMS and how modern databases ensure Durability.",
    exams: ["IBPS SO IT", "Coal India MT", "ISRO Scientist"],
    modelAnswer:
      "ACID stands for Atomicity (all-or-nothing completion), Consistency (database transitions from one valid state to another), Isolation (concurrent transactions execute independently without interference), and Durability (committed changes persist even after system crashes). Durability is guaranteed using Write-Ahead Logging (WAL) and REDO logs saved to non-volatile storage before declaring a transaction committed.",
    interviewerFollowUps: [
      "What is the difference between 2-Phase Locking (2PL) and Strict 2PL?",
      "How does WAL differ from shadow paging?",
    ],
    keyConcepts: ["ACID Properties", "Write-Ahead Logging (WAL)", "Isolation Levels", "Concurrency Control"],
  },
  {
    id: "net-01",
    category: "Computer Networks",
    question: "What happens step-by-step when you type 'https://examforge.com' in your browser and press Enter?",
    exams: ["IBPS SO IT", "Coal India MT", "ISRO Scientist"],
    modelAnswer:
      "1. Browser checks local cache (DNS/HSTS). 2. OS performs DNS resolution (Recursive resolver -> Root -> TLD -> Authoritative server) to resolve IP address. 3. TCP 3-way handshake (SYN, SYN-ACK, ACK) establishes transport connection over port 443. 4. TLS 1.3 Handshake negotiates cipher suites, authenticates server certificate, and establishes symmetric session keys. 5. HTTP GET request sent inside encrypted TLS payload. 6. Server responds with 200 OK + HTML asset payload. 7. Browser parses DOM, executes JS, and renders page.",
    interviewerFollowUps: [
      "Explain the difference between TCP SYN Flood and HTTP Slowloris attacks.",
      "How does TLS 1.3 shorten the handshake latency compared to TLS 1.2?",
    ],
    keyConcepts: ["DNS Resolution", "TCP 3-Way Handshake", "TLS/SSL Cryptography", "HTTP Protocol Stack"],
  },
  {
    id: "os-01",
    category: "Operating Systems",
    question: "Differentiate between Process and Thread. How does context switching differ between them?",
    exams: ["IBPS SO IT", "Coal India MT", "ISRO Scientist"],
    modelAnswer:
      "A Process is an independent executing instance with its own virtual address space, file descriptor table, and security context. A Thread is a lightweight execution unit inside a process sharing the parent process's memory space (heap, global variables, code segment) while retaining its own stack pointer, registers, and thread ID. Process context switching requires flushing the CPU TLB (Translation Lookaside Buffer) and switching MMU page tables, making it significantly slower than thread context switching within the same process.",
    interviewerFollowUps: [
      "What causes a thread deadlock, and how does the OS detect it?",
      "What is a kernel thread vs user-level thread (1:1 vs N:M model)?",
    ],
    keyConcepts: ["Virtual Address Space", "TLB Flush", "Context Switch Latency", "Thread Synchronization"],
  },
  {
    id: "dsa-01",
    category: "Data Structures & Algorithms",
    question: "Compare B-Trees vs Hash Indexes for relational database indexing.",
    exams: ["IBPS SO IT", "Coal India MT", "ISRO Scientist"],
    modelAnswer:
      "Hash indexes provide O(1) average lookup time for point equality queries (e.g. WHERE id = 100) but cannot support range queries (e.g. WHERE age BETWEEN 20 AND 30) or sorting (ORDER BY). B-Trees (specifically B+ Trees) maintain keys in sorted order at leaf nodes linked together, supporting both equality and range scans in O(log N) time with predictable block disk I/O.",
    interviewerFollowUps: [
      "Why are leaf nodes in a B+ Tree linked via a doubly linked list?",
      "How does write amplification affect B+ Tree indexes during high write workloads?",
    ],
    keyConcepts: ["B+ Tree Indexing", "Hash Collisions", "Disk Block I/O", "Range Scanning"],
  },
  {
    id: "sec-01",
    category: "Cybersecurity & Web",
    question: "What is SQL Injection (SQLi) and how do Prepared Statements prevent it?",
    exams: ["IBPS SO IT", "Coal India MT"],
    modelAnswer:
      "SQL Injection occurs when untrusted user input is directly concatenated into SQL query strings, allowing attackers to inject malicious SQL directives (e.g. `' OR '1'='1`). Prepared Statements (Parameterized Queries) separate query code from data. The database engine compiles the SQL command structure first, treating user input purely as literal parameter values regardless of special SQL characters.",
    interviewerFollowUps: [
      "Can Stored Procedures still be vulnerable to SQL Injection?",
      "Explain the difference between In-band, Blind, and Time-based SQLi.",
    ],
    keyConcepts: ["Parameterized Queries", "Input Sanitization", "SQL Compiler Parsing", "Least Privilege"],
  },
  {
    id: "sys-01",
    category: "System Design & Cloud",
    question: "Design a scalable rate limiter for a banking API. Which algorithm and data store would you select?",
    exams: ["IBPS SO IT", "Coal India MT", "ISRO Scientist"],
    modelAnswer:
      "I would choose the Token Bucket or Sliding Window Log algorithm implemented over distributed Redis in-memory storage. For high-concurrency banking APIs, Redis Lua scripts provide atomic evaluation of client request counts per IP/API token key without race conditions. Excess requests beyond threshold return HTTP 429 Too Many Requests with a `Retry-After` header.",
    interviewerFollowUps: [
      "How would you handle Redis master node failure during rate checking?",
      "What is the difference between Token Bucket and Leaky Bucket algorithms?",
    ],
    keyConcepts: ["Token Bucket", "Redis Lua Scripting", "Race Conditions", "HTTP 429 Rate Limits"],
  },
];

export default function InterviewPrepPage() {
  return (
    <div className="gradient-hero min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 text-sm">
          <Link href="/" className="flex items-center gap-1.5 font-bold gradient-text text-lg">
            <span>⚡</span>ExamForge
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
            Specialized Preparation Module
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
            Technical Interview &amp; Viva Questions
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Curated oral technical questions, model responses, and interviewer follow-ups for candidates targeting IBPS SO IT, ISRO Scientist (CS), and Coal India MT.
          </p>
        </div>

        {/* Exam filter pills */}
        <div className="glass-card p-4 mb-8 flex flex-wrap items-center justify-between gap-3 text-sm animate-fade-in-up delay-100">
          <span className="text-[var(--text-muted)] font-medium">Covered Exam Domains:</span>
          <div className="flex flex-wrap gap-2">
            {["IBPS SO IT Officer", "ISRO Scientist (CS)", "Coal India MT (CS/IT)"].map((exam) => (
              <span
                key={exam}
                className="px-3 py-1 rounded-full badge-indigo text-xs font-semibold"
              >
                {exam}
              </span>
            ))}
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-6 animate-fade-in-up delay-200">
          {VIVA_QUESTIONS.map((item, idx) => (
            <div
              key={item.id}
              className="glass-card p-6 border border-[var(--border)] hover:border-indigo-500/30 transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)]/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-indigo-300 text-sm">
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
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
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
                  <div className="font-bold text-amber-400/90 uppercase tracking-wider">
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
          ))}
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
