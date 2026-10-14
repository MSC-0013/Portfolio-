'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Play, CheckCircle2 } from 'lucide-react';
import { Github } from '@/components/ui/Icons';
import { FEATURED_PROJECTS } from '@/content/projects';
import BlackboxSimulator from '@/components/simulators/BlackboxSimulator';
import QuorumSimulator from '@/components/simulators/QuorumSimulator';
import SystemXPipeline from '@/components/simulators/SystemXPipeline';

export default function FeaturedProjects() {
  const [activeSimulator, setActiveSimulator] = useState<string | null>(null);

  return (
    <section id="projects" className="border-b border-neutral-800 bg-[#080808] py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between border-b border-neutral-800 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-400">
              03 / Selected Case Studies
            </div>
            <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Featured Engineering Projects
            </h2>
          </div>
          <div className="mt-4 font-mono text-xs text-neutral-400 sm:mt-0">
            03 Rigorous Systems Demonstrations
          </div>
        </div>

        {/* Project Editorial List */}
        <div className="mt-12 space-y-16">
          {FEATURED_PROJECTS.map((project) => {
            const isSimulatorOpen = activeSimulator === project.slug;

            return (
              <div
                key={project.id}
                className="rounded-sm border border-neutral-800 bg-neutral-950/60 p-6 sm:p-10 transition-colors hover:border-neutral-700"
              >
                {/* Project Header Bar */}
                <div className="flex flex-col justify-between gap-4 border-b border-neutral-800/80 pb-6 lg:flex-row lg:items-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-bold text-neutral-400">
                        {project.id}
                      </span>
                      <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-white">
                        {project.title}
                      </h3>
                    </div>
                    <p className="font-mono text-xs text-neutral-400">
                      {project.subtitle}
                    </p>
                  </div>

                  {/* Taxonomy Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-xs border border-neutral-700 bg-neutral-900 px-2.5 py-1 font-mono text-[10px] text-neutral-300">
                      {project.demonstrationType}
                    </span>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 rounded-sm border border-neutral-700 bg-neutral-900 px-3 py-1 font-mono text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>Source Code ↗</span>
                    </a>
                  </div>
                </div>

                {/* Narrative Summary & Invariants */}
                <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
                  <div className="space-y-4 lg:col-span-7">
                    <p className="text-sm sm:text-base leading-relaxed text-neutral-300">
                      {project.summary}
                    </p>

                    <div className="rounded border border-neutral-800/80 bg-neutral-900/40 p-4">
                      <div className="font-mono text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-2">
                        Problem Statement & Architectural Focus:
                      </div>
                      <p className="text-xs leading-relaxed text-neutral-400">
                        {project.problemStatement}
                      </p>
                    </div>

                    {/* System Invariants */}
                    <div className="space-y-1.5 pt-2">
                      <div className="font-mono text-[11px] font-semibold text-neutral-400 uppercase">
                        Verified System Invariants:
                      </div>
                      <ul className="space-y-1 text-xs font-mono text-neutral-300">
                        {project.systemInvariants.slice(0, 3).map((inv, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-emerald-400">•</span>
                            <span>{inv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Metrics & Stack */}
                  <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                      {project.metrics.map((m, idx) => (
                        <div
                          key={idx}
                          className="rounded border border-neutral-800 bg-neutral-900/60 p-3 font-mono"
                        >
                          <div className="text-[10px] text-neutral-400 uppercase">{m.label}</div>
                          <div className="text-lg font-bold text-neutral-100">{m.value}</div>
                          <div className="text-[10px] text-neutral-400 truncate">{m.context}</div>
                        </div>
                      ))}
                    </div>

                    {/* Stack Tags */}
                    <div className="space-y-2">
                      <div className="font-mono text-[10px] text-neutral-400 uppercase">Technologies:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-xs border border-neutral-800 bg-neutral-900 px-2 py-0.5 font-mono text-[11px] text-neutral-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions & Live Interactive Sandbox Toggle */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800/80 pt-6">
                  <button
                    type="button"
                    onClick={() => setActiveSimulator(isSimulatorOpen ? null : project.slug)}
                    className="inline-flex items-center space-x-2 rounded-sm bg-neutral-100 px-4 py-2 font-mono text-xs font-semibold text-black hover:bg-white transition-colors"
                  >
                    <Play className="h-3.5 w-3.5 fill-black" />
                    <span>{isSimulatorOpen ? 'Hide Interactive Sandbox' : 'Launch Interactive Sandbox'}</span>
                  </button>

                  <Link
                    href={project.demoPath}
                    className="inline-flex items-center space-x-1.5 font-mono text-xs text-neutral-300 hover:text-white transition-colors"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Embedded Interactive Sandbox (When toggled open) */}
                {isSimulatorOpen && (
                  <div className="mt-8 pt-4 border-t border-neutral-800">
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
