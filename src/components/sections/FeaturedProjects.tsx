'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Play, CheckCircle2, ShieldCheck, Database, Layers, Cpu, AlertTriangle } from 'lucide-react';
import { Github } from '@/components/ui/Icons';
import { FEATURED_PROJECTS, ProjectCaseStudy } from '@/content/projects';
import BlackboxSimulator from '@/components/simulators/BlackboxSimulator';
import QuorumSimulator from '@/components/simulators/QuorumSimulator';
import SystemXPipeline from '@/components/simulators/SystemXPipeline';

// Mini looping interactive visualizer for BLACKBOX-X
function BlackboxMiniPreview() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => (t + 1) % 12);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  const queueSlots = 6;
  const filledSlots = Math.min(queueSlots, (tick % 5) + 1);

  return (
    <div className="rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-2 mb-3">
        <div className="flex items-center space-x-2 text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">
          <Cpu className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
          <span>Queue Contention & Saturation Model</span>
        </div>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
          ● Engine Active
        </span>
      </div>

      <div className="space-y-3">
        {/* Arrival -> Bounded Buffer -> Worker Pool */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded border border-neutral-200/60 dark:border-neutral-800/60">
          {/* Arrival Ingress */}
          <div className="flex items-center space-x-1.5 text-[11px] text-neutral-700 dark:text-neutral-300">
            <span className="h-2 w-2 rounded-full bg-neutral-900 dark:bg-neutral-100 animate-ping" />
            <span>λ = 480 req/s</span>
          </div>

          {/* Bounded Buffer Slots */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-neutral-500 mr-1">FIFO Buffer:</span>
            {Array.from({ length: queueSlots }).map((_, i) => (
              <div
                key={i}
                className={`h-5 w-4 rounded-xs border transition-colors duration-300 flex items-center justify-center text-[9px] ${
                  i < filledSlots
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black font-bold'
                    : 'border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-400'
                }`}
              >
                {i < filledSlots ? '•' : ''}
              </div>
            ))}
          </div>

          {/* Workers */}
          <div className="flex items-center space-x-1.5 text-[10px] text-neutral-600 dark:text-neutral-400">
            <span className="rounded bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5">k=12 workers</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">μ=20ms</span>
          </div>
        </div>

        {/* Live Mathematical Boundary Indicators */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="rounded border border-neutral-200/60 dark:border-neutral-800/60 p-1.5 bg-neutral-50/50 dark:bg-neutral-950/40">
            <div className="text-neutral-500">Capacity Ceiling</div>
            <div className="font-bold text-neutral-800 dark:text-neutral-200">k · μ = 600 req/s</div>
          </div>
          <div className="rounded border border-neutral-200/60 dark:border-neutral-800/60 p-1.5 bg-neutral-50/50 dark:bg-neutral-950/40">
            <div className="text-neutral-500">Offered Load</div>
            <div className="font-bold text-neutral-800 dark:text-neutral-200">ρ = 0.80</div>
          </div>
          <div className="rounded border border-neutral-200/60 dark:border-neutral-800/60 p-1.5 bg-neutral-50/50 dark:bg-neutral-950/40">
            <div className="text-neutral-500">Simulated P99</div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400">108.4 ms</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini interactive Quorum Visualizer for QUORUM LAB
function QuorumMiniPreview() {
  const [mode, setMode] = useState<'safe' | 'weak'>('safe');
  const replicas = ['A', 'B', 'C', 'D', 'E'];

  // Safe mode: W=3 {A,B,C}, R=3 {C,D,E} -> Intersection is {C}
  // Weak mode: W=2 {A,B}, R=2 {C,D} -> Intersection is empty
  const writeSet = mode === 'safe' ? ['A', 'B', 'C'] : ['A', 'B'];
  const readSet = mode === 'safe' ? ['C', 'D', 'E'] : ['C', 'D'];
  const intersection = writeSet.filter((r) => readSet.includes(r));
  const hasIntersection = intersection.length > 0;

  return (
    <div className="rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-2 mb-3 gap-2">
        <div className="flex items-center space-x-2 text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">
          <Database className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
          <span>Quorum Set Overlap Visualizer (N=5)</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setMode('safe')}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
              mode === 'safe'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            W=3, R=3 (Quorum)
          </button>
          <button
            type="button"
            onClick={() => setMode('weak')}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
              mode === 'weak'
                ? 'bg-red-600 text-white font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            W=2, R=2 (Disjoint Risk)
          </button>
        </div>
      </div>

      {/* 5 Replicas Visual Row */}
      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-2">
          {replicas.map((rep) => {
            const inWrite = writeSet.includes(rep);
            const inRead = readSet.includes(rep);
            const inIntersect = intersection.includes(rep);

            return (
              <div
                key={rep}
                className={`flex flex-col items-center justify-center p-2 rounded border text-center transition-all ${
                  inIntersect
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                    : inWrite && inRead
                    ? 'border-neutral-800 bg-neutral-200 dark:border-neutral-200 dark:bg-neutral-800'
                    : inWrite
                    ? 'border-neutral-400 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100'
                    : inRead
                    ? 'border-neutral-400 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-400'
                }`}
              >
                <div className="font-bold text-sm">Node-{rep}</div>
                <div className="text-[9px] mt-1 space-x-1">
                  {inWrite && <span className="text-neutral-700 dark:text-neutral-300 font-semibold">[W]</span>}
                  {inRead && <span className="text-neutral-700 dark:text-neutral-300 font-semibold">[R]</span>}
                </div>
                {inIntersect && (
                  <span className="mt-1 text-[8px] bg-emerald-500 text-white px-1 rounded-xs">
                    OVERLAP
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Intersection Status Banner */}
        <div
          className={`flex items-center justify-between p-2 rounded border text-[11px] ${
            hasIntersection
              ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300'
              : 'border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {hasIntersection ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
            )}
            <span>
              {hasIntersection
                ? `W + R = 6 > 5: Intersection = {${intersection.join(', ')}} guarantees latest version.`
                : 'W + R = 4 < 5: Intersection = Ø (30% disjoint probability, stale read returned).'}
            </span>
          </div>
          <span className="text-[10px] font-bold">
            {hasIntersection ? 'CONSISTENT' : 'STALE READ RISK'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Mini looping pipeline flow for SYSTEM-X
function SystemXMiniPreview() {
  const stages = [
    { label: '01 Ingress JSON', note: 'Arbitrary key order' },
    { label: '02 Ajv Draft-07', note: 'Validated in <0.8ms' },
    { label: '03 RFC 8785 JCS', note: 'Deterministic sort' },
    { label: '04 SHA-256 Digest', note: 'SubtleCrypto' },
  ];

  return (
    <div className="rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-2 mb-3">
        <div className="flex items-center space-x-2 text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">
          <Layers className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
          <span>Verifiable Ingress & Provenance Pipeline</span>
        </div>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
          ● SubtleCrypto Verified
        </span>
      </div>

      <div className="space-y-3">
        {/* 4 Stage Sequence */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {stages.map((st, i) => (
            <div
              key={i}
              className="p-2.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-center relative"
            >
              <div className="font-bold text-neutral-900 dark:text-neutral-100 text-[11px]">{st.label}</div>
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 mt-1">{st.note}</div>
            </div>
          ))}
        </div>

        {/* Canonicalized Output Example Preview */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-neutral-100 dark:bg-neutral-950 p-2 rounded border border-neutral-200/80 dark:border-neutral-800 text-[10px]">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-neutral-500">RFC 8785 Hash:</span>
            <span className="font-mono text-neutral-800 dark:text-neutral-200 font-semibold truncate">
              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </span>
          </div>
          <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[9px]">
            100% REPRODUCIBLE
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProjects() {
  const [activeSimulator, setActiveSimulator] = useState<string | null>(null);

  return (
    <section id="projects" className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#080808] py-20 text-neutral-900 dark:text-white transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between border-b border-neutral-200 dark:border-neutral-800 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              01 / Core Systems Projects
            </div>
            <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Featured Engineering Projects
            </h2>
          </div>
          <div className="mt-4 font-mono text-xs text-neutral-500 dark:text-neutral-400 sm:mt-0">
            03 Interactive Systems Engines
          </div>
        </div>

        {/* Project Editorial List */}
        <div className="mt-12 space-y-16">
          {FEATURED_PROJECTS.map((project: ProjectCaseStudy) => {
            const isSimulatorOpen = activeSimulator === project.slug;

            return (
              <div
                key={project.id}
                className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/60 p-6 sm:p-10 transition-colors hover:border-neutral-400 dark:hover:border-neutral-700"
              >
                {/* Project Header Bar */}
                <div className="flex flex-col justify-between gap-4 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-6 lg:flex-row lg:items-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-bold text-neutral-400">
                        {project.id}
                      </span>
                      <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
                        {project.title}
                      </h3>
                    </div>
                    <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
                      {project.subtitle}
                    </p>
                  </div>

                  {/* Taxonomy Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-xs border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1 font-mono text-[10px] text-neutral-700 dark:text-neutral-300">
                      {project.demonstrationType}
                    </span>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 rounded-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1 font-mono text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>Source Code ↗</span>
                    </a>
                  </div>
                </div>

                {/* Narrative Summary & Visual Mini Preview */}
                <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
                  <div className="space-y-5 lg:col-span-7">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {project.summary}
                    </p>

                    {/* Integrated Mini Visual Preview right on the card */}
                    <div className="pt-1">
                      {project.slug === 'blackbox-x' && <BlackboxMiniPreview />}
                      {project.slug === 'quorum-lab' && <QuorumMiniPreview />}
                      {project.slug === 'system-x' && <SystemXMiniPreview />}
                    </div>

                    <div className="rounded border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/40 p-4">
                      <div className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                        Problem Statement & Architectural Focus:
                      </div>
                      <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {project.problemStatement}
                      </p>
                    </div>

                    {/* Verified System Invariants with Test Proof Badge */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center space-x-2 font-mono text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span>Enforced System Invariants (Vitest Verified):</span>
                      </div>
                      <ul className="space-y-2 text-xs font-mono text-neutral-800 dark:text-neutral-300">
                        {project.systemInvariants.map((inv, idx) => (
                          <li
                            key={idx}
                            className="rounded border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/30 p-2.5 space-y-1"
                          >
                            <div className="flex items-start space-x-2 font-semibold">
                              <span className="text-emerald-500">•</span>
                              <span>{inv.rule}</span>
                            </div>
                            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 pl-3">
                              Proof: {inv.testProof}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Quantitative Metrics & Stack Distinction */}
                  <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                      {project.metrics.map((m, idx) => (
                        <div
                          key={idx}
                          className="rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-3 font-mono"
                        >
                          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase">{m.label}</div>
                          <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{m.value}</div>
                          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-snug">{m.context}</div>
                        </div>
                      ))}
                    </div>

                    {/* Stack Distinction: Implemented Engine vs Concepts Modelled */}
                    <div className="space-y-4 pt-2">
                      <div>
                        <div className="font-mono text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                          Implemented Simulation Engine:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.implementedEngine.map((s) => (
                            <span
                              key={s}
                              className="rounded-xs border border-neutral-900 dark:border-neutral-700 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black px-2 py-0.5 font-mono text-[10px] font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="font-mono text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                          Distributed Concepts Modelled:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.conceptsModelled.map((s) => (
                            <span
                              key={s}
                              className="rounded-xs border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 font-mono text-[10px] text-neutral-700 dark:text-neutral-400"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions & Live Interactive Sandbox Toggle */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 dark:border-neutral-800/80 pt-6">
                  <button
                    type="button"
                    onClick={() => setActiveSimulator(isSimulatorOpen ? null : project.slug)}
                    className="inline-flex items-center space-x-2 rounded-sm bg-neutral-900 dark:bg-neutral-100 px-4 py-2 font-mono text-xs font-semibold text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-white transition-colors"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{isSimulatorOpen ? 'Collapse Interactive Sandbox' : 'Launch Full Interactive Sandbox'}</span>
                  </button>

                  <Link
                    href={project.demoPath}
                    className="inline-flex items-center space-x-1.5 font-mono text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Embedded Interactive Sandbox (When toggled open) */}
                {isSimulatorOpen && (
                  <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    {project.slug === 'blackbox-x' && <BlackboxSimulator />}
                    {project.slug === 'quorum-lab' && <QuorumSimulator />}
                    {project.slug === 'system-x' && <SystemXPipeline />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
