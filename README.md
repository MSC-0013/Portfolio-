# Soumyashree Rout — Engineering Portfolio

> **Backend & Distributed Systems Engineer**  
> Ultra-Minimalist Editorial Black-and-White Design (`#080808` / `#FFFFFF`), 3D Distributed Systems Observatory, and Deterministic Technical Simulators.

---

## 1. Professional Positioning

* **Core Message:** Engineering reliable systems through thoughtful architecture, distributed computing, and production-oriented software development.
* **Competencies:** Distributed Consensus, Discrete-Event Simulation, Fault Injection, Replicated Logs, Concurrency Contention, and High-Throughput API Contracts.

---

## 2. Interactive Demonstrators & Architecture

This portfolio avoids generic portfolio clichés (such as arbitrary skill bars, static screenshots, and unverified claims). It presents working, deterministic engineering simulators:

### 01 — BLACKBOX-X (Capacity & Failure Simulation Engine)
* **Demonstration Type:** `Type A: Interactive Educational Simulator`
* **Mathematical Model:** Discrete-event virtual clock scheduling with Poisson arrival processes ($\lambda$), exponential service times ($\mu$), virtual worker pool ($k$), and bounded queue ($C$) under Drop-Tail vs Backpressure overload policies.
* **Deterministic PRNG:** Mulberry32 generator ensuring 100% reproducible p95/p99 latency distributions.

### 02 — QUORUM LAB (Distributed Consistency & Consensus Environment)
* **Demonstration Type:** `Type A: Interactive Educational Simulator`
* **Quorum Replication:** Mathematically models selection-aware quorum sets where $W + R > N$ guarantees intersection across all pairs, while $W + R \le N$ permits disjoint quorums and stale reads.
* **Raft Replicated Log Lifecycle:** Tracks state progression through `RECEIVED` $\to$ `APPENDED` $\to$ `REPLICATED` $\to$ `COMMITTED` $\to$ `APPLIED`.
* **Split-Brain Comparison:** Compares unsafe multi-master write divergence against linearizable consensus under network partitions.

### 03 — SYSTEM-X (Integration & Experimentation API Layer)
* **Demonstration Type:** `Type A: Interactive Educational Simulator`
* **JSON Schema Validation:** Real Ajv (Draft-07) boundary validation rejecting out-of-spec payloads.
* **RFC 8785 Canonical JSON:** Lexicographical key normalization and deterministic byte hashing via SubtleCrypto SHA-256.
* **Reproducible Manifest:** Produces downloadable JSON execution artifacts.

---

## 3. Technology Stack

* **Framework:** Next.js 16.4.0 (App Router, Turbopack)
* **Language:** TypeScript 5 (Strict Mode)
* **UI & Styling:** React 19.3.0, Tailwind CSS v4, Motion
* **3D Engine:** Three.js, React Three Fiber v9, React Three Drei
* **Validation:** Ajv 8.17 (Draft-07)
* **Testing:** Vitest (Unit & Deterministic Algorithm Tests)
* **CI/CD:** GitHub Actions

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
│   │   ├── layout.tsx              # Root HTML, Geist Sans/Mono, Metadata
│   │   ├── page.tsx                # Complete Editorial Homepage
│   │   ├── globals.css             # Tailwind v4, Monochrome tokens, Grid textures
│   │   ├── robots.ts               # SEO crawler rules
│   │   ├── sitemap.ts              # Dynamic sitemap
│   │   └── projects/
│   │       ├── blackbox-x/page.tsx # Case study & simulation sandbox
│   │       ├── quorum-lab/page.tsx # Case study & consensus sandbox
│   │       └── system-x/page.tsx   # Case study & validation pipeline
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── ObservatoryCanvas.tsx # Lazy-loaded R3F canvas + IntersectionObserver
│   │   │   ├── DistributedMesh.tsx   # 3D nodes & event pulse instanced mesh
│   │   │   └── FallbackSvgMesh.tsx   # Accessible 2D vector fallback
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Sticky monospace header & navigation
│   │   │   └── Footer.tsx            # Architecture metadata & links
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx       # Typography & 3D canvas
│   │   │   ├── EngineeringFocus.tsx  # 4 Core technical capability cards
│   │   │   ├── FeaturedProjects.tsx  # Editorial showcase + simulator toggles
│   │   │   ├── SystemArch.tsx        # Interactive request lifecycle inspector
│   │   │   ├── ExperienceTimeline.tsx# PractmoMind verified experience & education
│   │   │   ├── SkillsMatrix.tsx      # Categorized skills taxonomy
│   │   │   └── ContactSection.tsx    # Direct contact actions & resume download
│   │   ├── simulators/
│   │   │   ├── BlackboxSimulator.tsx # Virtual clock scheduler UI
│   │   │   ├── QuorumSimulator.tsx   # 5-node quorum & Raft UI
│   │   │   └── SystemXPipeline.tsx   # Schema validation & SHA-256 UI
│   │   └── ui/
│   │       └── Icons.tsx             # SVG icons (Github, Linkedin)
│   ├── content/
│   │   ├── projects.ts               # Project case study metadata & invariants
│   │   ├── experience.ts             # PractmoMind achievements & stack
│   │   └── skills.ts                 # Technical skill taxonomy
│   └── lib/
│       └── simulators/
│           ├── blackbox-engine.ts    # Mulberry32 PRNG + virtual clock engine
│           ├── quorum-engine.ts      # Selection-aware Quorum + Raft lifecycle
│           └── systemx-engine.ts     # Ajv validation + RFC 8785 canonical JSON
├── tests/
│   └── simulators.test.ts            # Vitest deterministic test suites
├── public/
│   └── resume/
│       └── soumyashree-rout-cv.pdf   # Verified downloadable resume
└── .github/
    └── workflows/
        └── deploy.yml                # CI typecheck, test, and build pipeline
```

---

## 6. License & Provenance

© 2026 Soumyashree Rout. All rights reserved.

# Portfolio-
