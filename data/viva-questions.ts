export interface VivaTopic {
  id: string;
  category: string;
  question: string;
  exams: string[];
  modelAnswer: string;
  interviewerFollowUps: string[];
  keyConcepts: string[];
}

export const VIVA_QUESTIONS: VivaTopic[] = [
  // ── Database Systems (DBMS) ────────────────────────────────────────────────
  {
    id: "dbms-01",
    category: "Database Systems",
    question: "Explain ACID properties in RDBMS and how modern databases ensure Durability.",
    exams: ["IBPS SO IT", "Coal India MT", "ISRO Scientist"],
    modelAnswer:
      "ACID stands for Atomicity (all-or-nothing completion), Consistency (valid state transitions), Isolation (concurrency control), and Durability (permanent storage). Durability is guaranteed using Write-Ahead Logging (WAL) and REDO logs written to disk before transaction commit.",
    interviewerFollowUps: [
      "What is the difference between 2-Phase Locking (2PL) and Strict 2PL?",
      "How does WAL differ from shadow paging?",
    ],
    keyConcepts: ["ACID Properties", "Write-Ahead Logging (WAL)", "Isolation Levels", "Concurrency Control"],
  },
  {
    id: "dbms-02",
    category: "Database Systems",
    question: "What is Database Normalization? Differentiate between 3NF and BCNF.",
    exams: ["IBPS SO IT", "Coal India MT", "NIC Scientist B"],
    modelAnswer:
      "Normalization eliminates data redundancy and insertion/update anomalies by decomposing relations. 3NF requires that every non-prime attribute is non-transitively dependent on candidate keys. BCNF is a stricter version where for every functional dependency X -> Y, X must be a super key.",
    interviewerFollowUps: [
      "Can a relation be in 3NF but not in BCNF? Give a real-world example.",
      "What are the trade-offs of denormalization in OLAP systems?",
    ],
    keyConcepts: ["3NF vs BCNF", "Functional Dependencies", "Anomalies", "Super Keys"],
  },
  {
    id: "dbms-03",
    category: "Database Systems",
    question: "Compare B-Trees vs B+ Trees. Why do relational databases prefer B+ Trees for indexes?",
    exams: ["ISRO Scientist", "Coal India MT", "IBPS SO IT"],
    modelAnswer:
      "In B-Trees, data pointers exist at internal and leaf nodes. In B+ Trees, data pointers exist exclusively at leaf nodes, and leaf nodes are linked sequentially via a linked list. Relational databases prefer B+ Trees because range queries and sequential scans require traversing only the leaf level with minimal disk I/O.",
    interviewerFollowUps: [
      "How does the fan-out factor of a B+ Tree affect disk seek operations?",
      "What is a clustered vs non-clustered index in SQL Server/PostgreSQL?",
    ],
    keyConcepts: ["B+ Tree Indexing", "Disk Block I/O", "Sequential Range Scan", "Clustered Index"],
  },
  {
    id: "dbms-04",
    category: "Database Systems",
    question: "Explain Transaction Isolation Levels and the anomalies they prevent.",
    exams: ["IBPS SO IT", "Coal India MT"],
    modelAnswer:
      "The four ANSI SQL isolation levels are Read Uncommitted, Read Committed, Repeatable Read, and Serializable. They prevent Dirty Reads (reading uncommitted data), Non-Repeatable Reads (data modified by another transaction), and Phantom Reads (new rows inserted matching search criteria).",
    interviewerFollowUps: [
      "How does Multi-Version Concurrency Control (MVCC) eliminate read locks in PostgreSQL?",
      "What is Snapshot Isolation and can phantom reads occur under it?",
    ],
    keyConcepts: ["Isolation Levels", "Dirty Read", "Phantom Read", "MVCC"],
  },
  {
    id: "dbms-05",
    category: "Database Systems",
    question: "What is a Deadlock in DBMS and how is it detected and resolved?",
    exams: ["IBPS SO IT", "ISRO Scientist"],
    modelAnswer:
      "A DBMS deadlock occurs when two or more transactions hold locks on data items needed by the other, creating a circular wait. It is detected using a Wait-For-Graph (WFG) where cycles indicate deadlocks. Resolution involves selecting a victim transaction and aborting/rolling it back.",
    interviewerFollowUps: [
      "What is the difference between Wait-Die and Wound-Wait deadlock prevention algorithms?",
      "How does lock escalation work when row locks exceed memory limits?",
    ],
    keyConcepts: ["Wait-For Graph", "Deadlock Victim Selection", "Lock Escalation", "Wound-Wait"],
  },
  {
    id: "dbms-06",
    category: "Database Systems",
    question: "What are Index Scans vs Index Seeks, and what causes an index to be skipped (Table Scan)?",
    exams: ["IBPS SO IT", "Coal India MT"],
    modelAnswer:
      "An Index Seek uses index tree structure to find specific matching keys directly. An Index Scan traverses the entire index leaf chain. The query optimizer skips indexes (triggering a full Table Scan) when wildcard prefix operators (e.g. `LIKE '%abc'`), functions on indexed columns, or high selectivity estimates make table scans faster.",
    interviewerFollowUps: [
      "Why does applying `UPPER(column_name)` in a WHERE clause invalidate standard indexes?",
      "What is a Expression-based / Functional Index?",
    ],
    keyConcepts: ["Index Seek vs Scan", "Query Optimizer", "Functional Index", "SARGability"],
  },
  {
    id: "dbms-07",
    category: "Database Systems",
    question: "Explain the difference between SQL (Relational) and NoSQL (Document/Key-Value) databases.",
    exams: ["Coal India MT", "IBPS SO IT", "NIC Scientist B"],
    modelAnswer:
      "SQL databases (PostgreSQL, MySQL) adhere to ACID, schema enforcement, structured tables, and foreign key relations. NoSQL databases (MongoDB, Redis, Cassandra) prioritize horizontal scaling, flexible dynamic schemas, event-driven consistency (BASE model), and document/key-value storage for unstructured data.",
    interviewerFollowUps: [
      "Explain the CAP Theorem and where MongoDB falls under network partition.",
      "What is Eventual Consistency vs Strong Consistency?",
    ],
    keyConcepts: ["ACID vs BASE", "CAP Theorem", "Schema Enforcement", "Horizontal Scaling"],
  },

  // ── Operating Systems (OS) ─────────────────────────────────────────────────
  {
    id: "os-01",
    category: "Operating Systems",
    question: "Differentiate between Process and Thread. How does context switching differ between them?",
    exams: ["IBPS SO IT", "Coal India MT", "ISRO Scientist"],
    modelAnswer:
      "A Process is an independent executing unit with its own virtual address space and resources. A Thread is a lightweight execution path within a process sharing memory (heap, code, globals). Thread context switching is faster because page tables and TLB remain intact, whereas process context switching requires page table reloading and TLB flushing.",
    interviewerFollowUps: [
      "What causes a thread deadlock, and how does the OS detect it?",
      "What is a kernel thread vs user-level thread (1:1 vs N:M model)?",
    ],
    keyConcepts: ["Process vs Thread", "TLB Flush", "Context Switch Latency", "Thread Synchronization"],
  },
  {
    id: "os-02",
    category: "Operating Systems",
    question: "What is Virtual Memory and how does Paging work with Translation Lookaside Buffer (TLB)?",
    exams: ["ISRO Scientist", "Coal India MT", "NIC Scientist B"],
    modelAnswer:
      "Virtual Memory gives processes an illusion of contiguous memory larger than physical RAM using secondary disk storage. Memory is split into fixed-size pages mapped to physical frames via page tables. The TLB acts as a high-speed hardware cache for virtual-to-physical address translations.",
    interviewerFollowUps: [
      "What is a Page Fault and what steps occur when one is triggered?",
      "Explain Thrashing and how the Working Set Model prevents it.",
    ],
    keyConcepts: ["Virtual Memory", "Page Table", "TLB Cache", "Page Fault Handler"],
  },
  {
    id: "os-03",
    category: "Operating Systems",
    question: "Explain Banker's Algorithm for Deadlock Avoidance.",
    exams: ["ISRO Scientist", "Coal India MT"],
    modelAnswer:
      "Banker's Algorithm tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources. It checks if allocation leaves the system in a safe state where every process can complete without deadlock. If allocating resources leads to an unsafe state, the request is denied.",
    interviewerFollowUps: [
      "What is the time complexity of Banker's Algorithm with n processes and m resource types?",
      "Why is Banker's Algorithm rarely used in modern general-purpose operating systems?",
    ],
    keyConcepts: ["Banker's Algorithm", "Safe State", "Resource Allocation Graph", "Deadlock Avoidance"],
  },
  {
    id: "os-04",
    category: "Operating Systems",
    question: "What is a Semaphore vs Mutex? Differentiate between Counting and Binary Semaphores.",
    exams: ["IBPS SO IT", "ISRO Scientist", "Coal India MT"],
    modelAnswer:
      "A Mutex is a locking mechanism where only the thread holding the lock can release it. A Semaphore is a signaling mechanism using counter variables. A Binary Semaphore takes values 0 or 1, whereas a Counting Semaphore takes non-negative values to restrict access to a finite pool of resources.",
    interviewerFollowUps: [
      "What is Priority Inversion and how does Priority Inheritance solve it?",
      "Can a thread release a Mutex acquired by another thread?",
    ],
    keyConcepts: ["Mutex vs Semaphore", "Priority Inversion", "Critical Section", "Atomic Operations"],
  },
  {
    id: "os-05",
    category: "Operating Systems",
    question: "Compare CPU Scheduling Algorithms: Round Robin vs Shortest Remaining Time First (SRTF).",
    exams: ["ISRO Scientist", "Coal India MT"],
    modelAnswer:
      "Round Robin is preemptive, allocating equal fixed time slices (quanta) sequentially, ensuring low response time for interactive jobs. SRTF is the preemptive version of SJF, selecting the process with minimum remaining CPU burst time, achieving optimal average wait time but risking starvation of long processes.",
    interviewerFollowUps: [
      "How does the choice of time quantum affect Round Robin performance?",
      "How do Multilevel Feedback Queue (MLFQ) schedulers adapt without knowing burst times?",
    ],
    keyConcepts: ["CPU Scheduling", "Round Robin", "SRTF", "Starvation", "Time Quantum"],
  },
  {
    id: "os-06",
    category: "Operating Systems",
    question: "What is Memory Fragmentation? Differentiate between Internal and External Fragmentation.",
    exams: ["ISRO Scientist", "IBPS SO IT"],
    modelAnswer:
      "Internal Fragmentation occurs when memory is allocated in fixed-size blocks and process memory requests are smaller than block size, wasting memory inside blocks. External Fragmentation occurs in dynamic partitioning when total free memory is sufficient but scattered in non-contiguous fragments.",
    interviewerFollowUps: [
      "How does Paging eliminate External Fragmentation?",
      "What is Compaction in dynamic memory allocation?",
    ],
    keyConcepts: ["Internal Fragmentation", "External Fragmentation", "Compaction", "Non-contiguous Allocation"],
  },

  // ── Computer Networks (CN) ─────────────────────────────────────────────────
  {
    id: "net-01",
    category: "Computer Networks",
    question: "What happens step-by-step when you type 'https://prepudaan.com' in browser address bar?",
    exams: ["IBPS SO IT", "Coal India MT", "ISRO Scientist"],
    modelAnswer:
      "1. Browser checks cache/HSTS. 2. DNS resolution converts domain to IP. 3. TCP 3-way handshake (SYN, SYN-ACK, ACK) establishes transport connection on port 443. 4. TLS 1.3 Handshake authenticates server certificate and negotiates session keys. 5. Encrypted HTTP GET request sent. 6. Server returns 200 OK + HTML payload.",
    interviewerFollowUps: [
      "Explain the difference between TCP SYN Flood and HTTP Slowloris attacks.",
      "How does TLS 1.3 shorten handshake latency compared to TLS 1.2?",
    ],
    keyConcepts: ["DNS Resolution", "TCP 3-Way Handshake", "TLS 1.3 Cryptography", "HTTP Protocol"],
  },
  {
    id: "net-02",
    category: "Computer Networks",
    question: "Differentiate between TCP and UDP. When should a developer choose UDP over TCP?",
    exams: ["IBPS SO IT", "Coal India MT", "NIC Scientist B"],
    modelAnswer:
      "TCP is connection-oriented, reliable, guarantees ordered delivery, and provides congestion control via ACK retransmissions. UDP is connectionless, lightweight, and unordered without delivery guarantees. Developers choose UDP for real-time applications (VoIP, online gaming, video streaming, DNS) where speed and low latency outweigh packet loss.",
    interviewerFollowUps: [
      "How does QUIC protocol (HTTP/3) combine TCP reliability with UDP latency benefits?",
      "Explain TCP Flow Control (Sliding Window) vs Congestion Control (Slow Start).",
    ],
    keyConcepts: ["TCP vs UDP", "Reliable Transport", "Sliding Window", "QUIC Protocol"],
  },
  {
    id: "net-03",
    category: "Computer Networks",
    question: "What is IPv4 Subnetting? Calculate the network ID, broadcast address, and valid host count for 192.168.1.130/26.",
    exams: ["ISRO Scientist", "Coal India MT", "IBPS SO IT"],
    modelAnswer:
      "A /26 CIDR mask is 255.255.255.192 (block size 64). For IP 192.168.1.130, the subnets increment by 64 (0, 64, 128, 192). Thus, Network ID is 192.168.1.128, Broadcast address is 192.168.1.191, and valid host IPs range from 192.168.1.129 to 192.168.1.190 (62 usable hosts).",
    interviewerFollowUps: [
      "Why are the first and last addresses in a subnet reserved?",
      "What is VLSM (Variable Length Subnet Masking)?",
    ],
    keyConcepts: ["IPv4 Subnetting", "CIDR Notation", "Network & Broadcast Address", "VLSM"],
  },
  {
    id: "net-04",
    category: "Computer Networks",
    question: "Explain the OSI Model layers and map common protocols (BGP, OSPF, TCP, IP, HTTP) to them.",
    exams: ["ISRO Scientist", "IBPS SO IT", "Coal India MT"],
    modelAnswer:
      "The 7 OSI layers are Physical, Data Link, Network, Transport, Session, Presentation, and Application. HTTP and BGP operate at Application layer (Layer 7). TCP and UDP operate at Transport layer (Layer 4). IP and OSPF operate at Network layer (Layer 3). Ethernet operates at Data Link layer (Layer 2).",
    interviewerFollowUps: [
      "Why is BGP an Application layer protocol while being a routing protocol?",
      "What is ARP and at which layer does it operate?",
    ],
    keyConcepts: ["OSI Model", "Protocol Layering", "BGP / OSPF", "ARP Protocol"],
  },
  {
    id: "net-05",
    category: "Computer Networks",
    question: "What is TCP Congestion Control? Explain Slow Start, Congestion Avoidance, and Fast Recovery.",
    exams: ["ISRO Scientist", "Coal India MT"],
    modelAnswer:
      "TCP Congestion Control prevents network overload by dynamically adjusting the congestion window (cwnd). Slow Start doubles cwnd exponentially every RTT until threshold (ssthresh). Congestion Avoidance increments cwnd linearly (+1 per RTT). Fast Recovery responds to 3 duplicate ACKs by halving ssthresh and retransmitting missing segments immediately.",
    interviewerFollowUps: [
      "What is the difference between TCP Tahoe and TCP Reno?",
      "How does BBR (Bottleneck Bandwidth and RTT) differ from loss-based congestion control?",
    ],
    keyConcepts: ["Slow Start", "Congestion Window (cwnd)", "Fast Retransmit", "TCP Reno / BBR"],
  },
  {
    id: "net-06",
    category: "Computer Networks",
    question: "What is NAT (Network Address Translation) and how does PAT (Port Address Translation) enable multiple devices to share one public IP?",
    exams: ["IBPS SO IT", "Coal India MT"],
    modelAnswer:
      "NAT translates private IP addresses (RFC 1918) to public IP addresses. PAT (NAPT) maps multiple internal private IP + source port combinations to a single public IP address with unique temporary public source ports, updating an internal NAT translation table.",
    interviewerFollowUps: [
      "What is a NAT Traversal issue in peer-to-peer applications?",
      "Explain STUN, TURN, and ICE protocols.",
    ],
    keyConcepts: ["NAT vs PAT", "RFC 1918 Private IP", "Translation Table", "P2P NAT Traversal"],
  },

  // ── Data Structures & Algorithms (DSA) ────────────────────────────────────
  {
    id: "dsa-01",
    category: "Data Structures & Algorithms",
    question: "Compare Binary Search Tree (BST) vs AVL Tree vs Red-Black Tree.",
    exams: ["ISRO Scientist", "Coal India MT", "IBPS SO IT"],
    modelAnswer:
      "A BST has no height balancing guarantee, degenerating to O(N) linked list worst-case. An AVL tree strictly balances height (|balance factor| <= 1), offering faster O(log N) lookups but frequent rotations on write. A Red-Black tree relaxes height rules (longest path <= 2 * shortest path), requiring fewer rotations on insert/delete.",
    interviewerFollowUps: [
      "Why does C++ std::map / Java TreeMap use Red-Black Tree instead of AVL Tree?",
      "What are the 4 cases of AVL Tree rotations?",
    ],
    keyConcepts: ["BST", "AVL Tree Rotations", "Red-Black Tree", "Strict vs Weak Balance"],
  },
  {
    id: "dsa-02",
    category: "Data Structures & Algorithms",
    question: "How does Hash Table collision resolution work? Compare Chaining vs Open Addressing.",
    exams: ["ISRO Scientist", "Coal India MT", "IBPS SO IT"],
    modelAnswer:
      "Collisions occur when two distinct keys map to the same hash index. Chaining resolves collisions by storing colliding elements in linked lists or balanced trees at each bucket. Open Addressing finds another open slot within the table using Linear Probing, Quadratic Probing, or Double Hashing.",
    interviewerFollowUps: [
      "What is Primary Clustering in Linear Probing?",
      "How does Load Factor threshold trigger hash table resizing/rehash?",
    ],
    keyConcepts: ["Hash Collision", "Chaining", "Open Addressing", "Load Factor & Rehashing"],
  },
  {
    id: "dsa-03",
    category: "Data Structures & Algorithms",
    question: "Explain Dijkstra's Algorithm for Shortest Path. When does it fail?",
    exams: ["ISRO Scientist", "Coal India MT"],
    modelAnswer:
      "Dijkstra's Algorithm finds the shortest path from a single source node to all other nodes in a weighted graph using a min-priority queue (greedy approach) in O((V + E) log V) time. It fails on graphs containing negative edge weights, where Bellman-Ford algorithm must be used instead.",
    interviewerFollowUps: [
      "Why does Dijkstra fail on negative edge weights?",
      "What is Bellman-Ford's time complexity and how does it detect negative cycles?",
    ],
    keyConcepts: ["Dijkstra Shortest Path", "Min-Priority Queue", "Negative Edge Weights", "Bellman-Ford"],
  },
  {
    id: "dsa-04",
    category: "Data Structures & Algorithms",
    question: "Explain QuickSort partitioning. What is worst-case time complexity and how do you prevent it?",
    exams: ["ISRO Scientist", "Coal India MT"],
    modelAnswer:
      "QuickSort selects a pivot element and partitions the array into sub-arrays of elements smaller and larger than the pivot recursively. Worst-case O(N^2) occurs when array is already sorted or reverse-sorted with a bad pivot. Randomized pivot selection or Median-of-Three pivot strategy guarantees expected O(N log N).",
    interviewerFollowUps: [
      "Is QuickSort a stable sorting algorithm? Why or why not?",
      "Explain Space Complexity of QuickSort recursion call stack.",
    ],
    keyConcepts: ["QuickSort Partitioning", "Pivot Selection", "Worst-case O(N^2)", "Algorithm Stability"],
  },
  {
    id: "dsa-05",
    category: "Data Structures & Algorithms",
    question: "What is a Heap (Min-Heap / Max-Heap) and how is HeapSort implemented?",
    exams: ["ISRO Scientist", "Coal India MT", "IBPS SO IT"],
    modelAnswer:
      "A Heap is a complete binary tree satisfying the heap property (parent <= children for Min-Heap; parent >= children for Max-Heap). HeapSort builds a Max-Heap from input data in O(N) time, then repeatedly swaps the root (max element) with the last element and heapifies down, achieving O(N log N) in-place sorting.",
    interviewerFollowUps: [
      "Why is building a heap from an array O(N) and not O(N log N)?",
      "How is a Min-Heap used to find Kth largest element in an array?",
    ],
    keyConcepts: ["Max-Heap / Min-Heap", "Heapify Down", "HeapSort In-Place", "Priority Queue"],
  },

  // ── Software Engineering & Design Patterns ────────────────────────────────
  {
    id: "se-01",
    category: "Software Engineering",
    question: "Explain SOLID principles in Object-Oriented Software Design.",
    exams: ["IBPS SO IT", "Coal India MT", "NIC Scientist B"],
    modelAnswer:
      "SOLID stands for: S - Single Responsibility (one reason to change), O - Open/Closed (open for extension, closed for modification), L - Liskov Substitution (subtypes substitutable for base types), I - Interface Segregation (specific interfaces over monolithic ones), D - Dependency Inversion (depend on abstractions, not concrete implementations).",
    interviewerFollowUps: [
      "Give a code violation of Liskov Substitution Principle (e.g. Square inheriting Rectangle).",
      "How does Dependency Injection framework (Spring / NestJS) implement Dependency Inversion?",
    ],
    keyConcepts: ["SOLID Principles", "Single Responsibility", "Liskov Substitution", "Dependency Injection"],
  },
  {
    id: "se-02",
    category: "Software Engineering",
    question: "Compare Singleton vs Factory Method Design Patterns. What is Thread-Safe Singleton?",
    exams: ["IBPS SO IT", "Coal India MT"],
    modelAnswer:
      "Singleton ensures a class has only one instance globally with a global access point. Factory Method defines an interface for creating objects, delegating instantiation logic to subclasses. Thread-Safe Singleton uses double-checked locking with volatile keywords or static inner helper classes (Bill Pugh Singleton) to prevent multithread race conditions.",
    interviewerFollowUps: [
      "How does Double-Checked Locking work in Java/C++?",
      "Why is Singleton sometimes considered an anti-pattern in unit testing?",
    ],
    keyConcepts: ["Singleton Pattern", "Factory Pattern", "Double-Checked Locking", "Thread Safety"],
  },
  {
    id: "se-03",
    category: "Software Engineering",
    question: "Explain Agile Scrum methodology. What are Sprint Artifacts and Ceremonies?",
    exams: ["IBPS SO IT", "Coal India MT"],
    modelAnswer:
      "Scrum is an iterative Agile framework delivering working software in fixed-length Sprints (2-4 weeks). Ceremonies include Sprint Planning, Daily Standup, Sprint Review, and Sprint Retrospective. Core Artifacts include Product Backlog, Sprint Backlog, and Increment.",
    interviewerFollowUps: [
      "What is the role of a Scrum Master vs Product Owner?",
      "How do velocity and story points help estimate sprint capacity?",
    ],
    keyConcepts: ["Scrum Framework", "Sprint Ceremonies", "Product Backlog", "Story Points"],
  },
  {
    id: "se-04",
    category: "Software Engineering",
    question: "What is CI/CD (Continuous Integration / Continuous Deployment)?",
    exams: ["IBPS SO IT", "Coal India MT", "NIC Scientist B"],
    modelAnswer:
      "CI automatically triggers code compilation, static linting, and unit test execution on every commit to merge code frequently. CD (Continuous Delivery/Deployment) automatically builds deployment artifacts and releases verified software to staging or production environments seamlessly via automated pipelines.",
    interviewerFollowUps: [
      "What is the difference between Continuous Delivery and Continuous Deployment?",
      "How do Blue-Green and Canary Deployment strategies minimize downtime?",
    ],
    keyConcepts: ["CI/CD Pipeline", "Automated Testing", "Blue-Green Deployment", "Canary Release"],
  },

  // ── Cybersecurity & Web Security ──────────────────────────────────────────
  {
    id: "sec-01",
    category: "Cybersecurity",
    question: "What is SQL Injection (SQLi) and how do Prepared Statements prevent it?",
    exams: ["IBPS SO IT", "Coal India MT"],
    modelAnswer:
      "SQL Injection occurs when untrusted user input is directly concatenated into SQL strings, enabling attackers to execute unauthorized commands. Prepared Statements (Parameterized Queries) pre-compile SQL structure first, treating user input strictly as literal parameter data regardless of special characters.",
    interviewerFollowUps: [
      "Can Stored Procedures still be vulnerable to SQL Injection?",
      "Explain the difference between In-band, Blind, and Time-based SQLi.",
    ],
    keyConcepts: ["Parameterized Queries", "Input Sanitization", "SQL Compiler Parsing", "Least Privilege"],
  },
  {
    id: "sec-02",
    category: "Cybersecurity",
    question: "Differentiate between Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).",
    exams: ["IBPS SO IT", "Coal India MT", "NIC Scientist B"],
    modelAnswer:
      "XSS injects malicious JavaScript into vulnerable web pages executed in victim's browser to steal cookies or session tokens. CSRF tricks an authenticated user into executing unauthorized state-changing actions (e.g. transferring funds) on a trusted application where they are currently logged in.",
    interviewerFollowUps: [
      "How do HttpOnly cookies and Content Security Policy (CSP) headers mitigate XSS?",
      "How do Anti-CSRF tokens and SameSite cookie attributes prevent CSRF?",
    ],
    keyConcepts: ["XSS vs CSRF", "HttpOnly Cookie", "Content Security Policy (CSP)", "Anti-CSRF Tokens"],
  },
  {
    id: "sec-03",
    category: "Cybersecurity",
    question: "Explain Asymmetric Cryptography vs Symmetric Cryptography. How does RSA work?",
    exams: ["ISRO Scientist", "IBPS SO IT", "Coal India MT"],
    modelAnswer:
      "Symmetric Cryptography (AES) uses a single shared secret key for encryption and decryption. Asymmetric Cryptography (RSA, ECC) uses a mathematically linked key pair: a public key for encryption/verifying signatures, and a private key for decryption/signing. RSA relies on the prime factorization hardness problem.",
    interviewerFollowUps: [
      "Why is hybrid encryption (RSA + AES) used in HTTPS instead of pure RSA?",
      "What is a Digital Certificate and how does Certificate Authority (CA) chain of trust work?",
    ],
    keyConcepts: ["Symmetric vs Asymmetric", "RSA Public/Private Key", "Hybrid Encryption", "PKI & CA"],
  },

  // ── System Design & Distributed Systems ──────────────────────────────────
  {
    id: "sys-01",
    category: "System Design",
    question: "Design a scalable rate limiter for an API portal. Which algorithm and store would you choose?",
    exams: ["IBPS SO IT", "Coal India MT", "ISRO Scientist"],
    modelAnswer:
      "I would choose Token Bucket algorithm implemented over distributed Redis in-memory storage. Redis Lua scripts evaluate client request counters per IP/API token atomically to avoid race conditions, returning HTTP 429 Too Many Requests when rate limits are exceeded.",
    interviewerFollowUps: [
      "How would you handle Redis master node failure during rate checking?",
      "What is the difference between Token Bucket and Leaky Bucket algorithms?",
    ],
    keyConcepts: ["Token Bucket", "Redis Atomic Scripting", "Race Conditions", "HTTP 429 Rate Limits"],
  },
  {
    id: "sys-02",
    category: "System Design",
    question: "Explain CAP Theorem in Distributed Systems. Can a system be Consistency + Availability + Partition Tolerance?",
    exams: ["ISRO Scientist", "Coal India MT", "NIC Scientist B"],
    modelAnswer:
      "CAP Theorem states that a distributed data store can simultaneously provide at most 2 out of 3 guarantees: Consistency (all nodes see same data), Availability (every request receives non-error response), and Partition Tolerance (system operates despite network message losses). Because network partitions (P) are inevitable, distributed systems must trade off between CP or AP.",
    interviewerFollowUps: [
      "Give examples of CP databases vs AP databases.",
      "What is PACELC theorem and how does it extend CAP for normal network conditions?",
    ],
    keyConcepts: ["CAP Theorem", "CP vs AP Database", "Network Partition", "PACELC Theorem"],
  },
  {
    id: "sys-03",
    category: "System Design",
    question: "Explain Caching Strategies: Write-Through, Write-Back (Write-Behind), and Cache-Aside.",
    exams: ["IBPS SO IT", "Coal India MT"],
    modelAnswer:
      "In Cache-Aside, application reads from cache first; if cache miss occurs, reads DB and populates cache. In Write-Through, application writes to cache, and cache synchronously writes to DB before returning success. In Write-Back, application writes to cache, which asynchronously writes to DB in background batches.",
    interviewerFollowUps: [
      "What is Cache Stampede (Thundering Herd Problem) and how do lock leases mitigate it?",
      "Compare LRU (Least Recently Used) vs LFU (Least Frequently Used) cache eviction policies.",
    ],
    keyConcepts: ["Cache-Aside", "Write-Through vs Write-Back", "Cache Eviction Policies", "Thundering Herd"],
  },
  {
    id: "sys-04",
    category: "System Design",
    question: "What is Load Balancing? Compare Layer 4 (Transport) vs Layer 7 (Application) Load Balancers.",
    exams: ["IBPS SO IT", "Coal India MT", "NIC Scientist B"],
    modelAnswer:
      "Load balancing distributes incoming traffic across backend server pools. Layer 4 Load Balancers route packets based on IP addresses and TCP/UDP ports without inspecting packet payload. Layer 7 Load Balancers inspect HTTP headers, cookies, and URL paths, enabling smart content-based routing and TLS termination.",
    interviewerFollowUps: [
      "Compare Round Robin, Least Connections, and IP Hash load balancing algorithms.",
      "What is Health Checking and Passive vs Active health probes?",
    ],
    keyConcepts: ["Layer 4 vs Layer 7", "Content Routing", "TLS Termination", "Health Check Probes"],
  },

  // ── Cloud Computing & Modern Tech Stack ────────────────────────────────────
  {
    id: "cloud-01",
    category: "Cloud Computing",
    question: "Differentiate between Containers (Docker) and Virtual Machines (VMs).",
    exams: ["IBPS SO IT", "Coal India MT", "NIC Scientist B"],
    modelAnswer:
      "Virtual Machines virtualize physical hardware via a Hypervisor (Type 1 or Type 2), requiring a full guest OS for each instance. Containers virtualize the host OS kernel, packaging application code and dependencies into isolated lightweight process namespaces, enabling sub-second startup times and lower memory footprints.",
    interviewerFollowUps: [
      "What are Linux Namespaces and Cgroups in container runtime engine?",
      "What is Kubernetes Pod vs Container?",
    ],
    keyConcepts: ["Containers vs VMs", "Hypervisor", "Linux Namespaces & Cgroups", "Docker Engine"],
  },
  {
    id: "cloud-02",
    category: "Cloud Computing",
    question: "What is Microservices Architecture vs Monolithic Architecture?",
    exams: ["IBPS SO IT", "Coal India MT"],
    modelAnswer:
      "Monolithic Architecture packages all business domains into a single deployable artifact sharing a unified database. Microservices Architecture decomposes application domains into autonomous, loosely coupled services communicating via lightweight APIs (REST/gRPC/Kafka), each managing its own isolated data storage.",
    interviewerFollowUps: [
      "Explain Saga Pattern for distributed transactions across microservices.",
      "What is API Gateway pattern and what responsibilities does it handle?",
    ],
    keyConcepts: ["Microservices", "Monolith", "Saga Pattern", "API Gateway"],
  },
  {
    id: "cloud-03",
    category: "Cloud Computing",
    question: "Explain Message Queues (Kafka / RabbitMQ) and event-driven architecture benefits.",
    exams: ["IBPS SO IT", "Coal India MT"],
    modelAnswer:
      "Message queues enable asynchronous communication and decoupling between producer and consumer services. Producers publish event messages to queue topics, buffering burst traffic and guaranteeing eventual processing even if consumer services experience temporary downtime or maintenance.",
    interviewerFollowUps: [
      "What is the difference between RabbitMQ (AMQP broker) and Apache Kafka (distributed commit log)?",
      "Explain At-most-once, At-least-once, and Exactly-once delivery semantics.",
    ],
    keyConcepts: ["Message Queue", "Kafka vs RabbitMQ", "Asynchronous Decoupling", "Delivery Semantics"],
  },
];
