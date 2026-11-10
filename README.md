# Soumyashree Rout — Engineering Portfolio

> **Junior Software Engineer at PractmoMind · Backend & Distributed Systems**  
> Editorial Black-and-White Aesthetic (`#080808` / `#FFFFFF`), Persistent Light/Dark Mode, 3D Live Quorum Cluster Observatory, Deterministic Technical Simulators, and In-Card Previews.

---

## 1. Professional Positioning

* **Core Headline:** *"I build backend systems, and tools that show how they fail."*
* **Current Role:** Junior Software Engineer at PractmoMind.
* **Competencies:** Distributed Consensus, Discrete-Event Simulation, Fault Injection, Replicated Logs, Concurrency Contention, and High-Throughput API Contracts.

---

## 2. Interactive Demonstrators & Architecture

This portfolio rejects generic portfolio clichés (such as arbitrary skill percentage bars, static screenshots, and unverified claims). It presents working, deterministic engineering simulators:

### 01 — BLACKBOX-X (Capacity & Failure Simulation Engine)
* **Demonstration Type:** `Interactive Educational Simulator`
* **Mathematical Model:** Discrete-event virtual clock scheduling with Poisson arrival processes ($\lambda$), exponential service times ($\mu = 50\text{ s}^{-1}$, mean service time $20\text{ ms}$), virtual worker pool ($k = 12$, maximum capacity $k\mu = 600\text{ req/s}$), and bounded queue ($C$) under Drop-Tail vs Backpressure overload policies.
* **Simulated P99 Latency:** $108.4\text{ ms}$ under offered load $\rho = 0.80$ ($480\text{ req/s}$).
* **Deterministic PRNG:** Mulberry32 generator ensuring 100% reproducible p95/p99 latency distributions.
* **In-Card Live Preview:** Dynamic bounded queue buffer visualizer with slot fill and worker pool activity.

### 02 — QUORUM LAB (Distributed Consistency & Consensus Environment)
* **Demonstration Type:** `Interactive Educational Simulator`
* **Quorum Replication:** Mathematically models selection-aware quorum sets where $W + R > N$ ($W=3, R=3, N=5$) guarantees non-empty intersection across all pairs, while $W=2, R=2$ yields an exact $30\%$ disjoint probability ($\frac{\binom{3}{2}}{\binom{5}{2}} = \frac{3}{10}$) resulting in stale reads.
* **Raft Replicated Log Lifecycle:** Tracks state progression through `RECEIVED` $\to$ `APPENDED` $\to$ `REPLICATED` $\to$ `COMMITTED` $\to$ `APPLIED`.
* **Split-Brain Comparison:** Compares unsafe multi-master write divergence against linearizable consensus under network partitions.
* **In-Card Live Preview:** Interactive 5-node quorum overlap toggle ($W=3, R=3$ vs $W=2, R=2$).

### 03 — SYSTEM-X (Integration & Experimentation API Layer)
* **Demonstration Type:** `Interactive Educational Simulator`
* **JSON Schema Validation:** Real compiled Ajv (Draft-07) boundary validation rejecting out-of-spec payloads in $< 0.8\text{ ms}$.
* **RFC 8785 Canonical JSON (JCS):** Lexicographical key normalization and deterministic byte hashing via SubtleCrypto SHA-256.
* **Reproducible Manifest:** Produces downloadable JSON execution artifacts with tamper-proof digest proofs.
* **In-Card Live Preview:** 4-stage pipeline flow with live RFC 8785 hash preview.

---

## 3. Technology Stack

* **Framework:** Next.js 16.4.0 (App Router, Turbopack)
* **Language:** TypeScript 5 (Strict Mode)
* **UI & Styling:** React 19.3.0, Tailwind CSS v4, Motion
* **3D Engine:** Three.js, React Three Fiber v9, React Three Drei
  * Live 5-Node Quorum Cluster (`Node-A` through `Node-E`)
  * Interactive Click-to-Crash: Crashing the leader triggers term increments, candidate election pulses, and majority consensus recovery
  * Mesh, Star, and Ring topology modes with smooth damped lerping
* **Theme System:** Persistent Light/Dark mode via React Context and Tailwind `@custom-variant dark`
* **Validation:** Ajv 8.17 (Draft-07)
* **Testing:** Vitest (11 Unit & Deterministic Simulation Test Suites)
* **Contact API:** Next.js Route Handler (`/api/contact`) with direct email inbox delivery & mailto fallback
* **CI/CD & Hosting:** GitHub Actions & Render Web Service

---

## 4. Verification & Testing

Run all quality gates locally:

```bash
# 1. Strict TypeScript Compiler Check
npm run typecheck

# 2. Run Deterministic Simulation Tests (11 test suites)
npm test

# 3. Production Next.js Compilation & Static Generation
npm run build

# 4. Start Local Production Server
npm start
```

---

## 5. Directory Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root HTML, Geist Sans/Mono, ThemeProvider, Metadata
│   │   ├── page.tsx                # Streamlined Homepage (Work -> Architecture -> Experience -> Skills -> Contact)
│   │   ├── globals.css             # Tailwind v4, Monochrome tokens, Grid textures
│   │   ├── robots.ts               # SEO crawler rules
│   │   ├── sitemap.ts              # Dynamic sitemap
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts        # Server-side email delivery handler
│   │   └── projects/
│   │       ├── blackbox-x/page.tsx # Case study & simulation sandbox
│   │       ├── quorum-lab/page.tsx # Case study & consensus sandbox
│   │       └── system-x/page.tsx   # Case study & validation pipeline
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── ObservatoryCanvas.tsx # Lazy-loaded R3F canvas + Quorum telemetry HUD + Crash reset
│   │   │   ├── DistributedMesh.tsx   # Live 5-node cluster (Leader Node-C, Followers A, B, D, E), click-to-crash, election
│   │   │   └── FallbackSvgMesh.tsx   # Accessible 2D vector fallback
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Sticky monospace header, navigation & ThemeToggle
│   │   │   ├── Footer.tsx            # Architecture metadata & links
│   │   │   ├── ThemeContext.tsx      # Persistent light/dark mode context provider
│   │   │   └── ThemeToggle.tsx       # Sun/Moon theme toggle button
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx       # Core positioning & 3D Quorum cluster
│   │   │   ├── FeaturedProjects.tsx  # Flagship projects with mini animated previews & Vitest proof badges
│   │   │   ├── SystemArch.tsx        # Request lifecycle inspector (5 sequential stages)
│   │   │   ├── ExperienceTimeline.tsx# PractmoMind role with quantified metrics & Education
│   │   │   ├── SkillsMatrix.tsx      # 3 Evidence-grounded skill categories
│   │   │   └── ContactSection.tsx    # Direct contact invitation & dispatch form
│   │   └── simulators/
│   │       ├── BlackboxSimulator.tsx # Deterministic discrete-event capacity engine
│   │       ├── QuorumSimulator.tsx   # Quorum math & Raft split-brain environment
│   │       └── SystemXPipeline.tsx   # RFC 8785 canonical JSON & SHA-256 validation
│   └── content/
│       ├── experience.ts             # Quantified experience metrics & education
│       ├── projects.ts               # Implemented engines, concepts modelled & tested invariants
│       └── skills.ts                 # Evidence-based skill inventory
├── tests/
│   └── simulators.test.ts            # Vitest suite covering scheduling, quorums & canonicalization
├── render.yaml                       # Render web service configuration
└── package.json
```

---

## 6. License

MIT License — Built by Soumyashree Rout.
