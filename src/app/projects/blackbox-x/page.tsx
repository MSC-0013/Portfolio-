import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlackboxSimulator from '@/components/simulators/BlackboxSimulator';
import { ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Github } from '@/components/ui/Icons';
import { FEATURED_PROJECTS } from '@/content/projects';

const project = FEATURED_PROJECTS[0]; // BLACKBOX-X

export const metadata = {
  title: 'BLACKBOX-X Case Study — Soumyashree Rout',
  description: 'Deterministic discrete-event simulation engine modeling virtual clock queues, backpressure, and fault injection.',
};

export default function BlackboxCaseStudy() {
  return (
    <div className="flex min-h-screen flex-col bg-[#080808] text-white">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 font-mono text-xs text-neutral-400">
            <Link href="/" className="hover:text-white transition-colors flex items-center space-x-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/#projects" className="hover:text-white transition-colors">
              Work
            </Link>
            <span>/</span>
            <span className="text-neutral-200">BLACKBOX-X</span>
          </div>

          {/* Header */}
          <div className="space-y-4 border-b border-neutral-800 pb-8">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="rounded bg-neutral-800 px-2.5 py-1 text-neutral-300">
                {project.demonstrationType}
              </span>
              <span className="text-neutral-500">|</span>
              <span className="text-neutral-400">{project.category}</span>
            </div>

            <h1 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              {project.title}
            </h1>
            <p className="font-mono text-sm sm:text-base text-neutral-400">
              {project.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 rounded-sm border border-neutral-700 bg-neutral-900 px-4 py-2 text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>Source Repository ↗</span>
              </a>
            </div>
          </div>

          {/* Demonstration Notice */}
          <div className="rounded border border-neutral-800/80 bg-neutral-950 p-4 font-mono text-xs text-neutral-400 leading-relaxed">
            <span className="text-neutral-200 font-semibold mr-2">DEMONSTRATION DISCLOSURE:</span>
            {project.demonstrationNotice}
          </div>

          {/* Interactive Simulation Sandbox */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
              01 / Reproducible Deterministic Simulation Sandbox
            </h2>
            <BlackboxSimulator />
          </div>

          {/* Problem Statement */}
          <div className="space-y-4 rounded-sm border border-neutral-800 bg-neutral-950/60 p-6 sm:p-8">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
              02 / The Engineering Problem
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-neutral-300 font-sans">
              {project.problemStatement}
            </p>
          </div>

          {/* Architecture Overview */}
          <div className="space-y-4 rounded-sm border border-neutral-800 bg-neutral-950/60 p-6 sm:p-8">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
              03 / System Architecture & Scheduling Engine
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-neutral-300 font-sans">
              {project.architectureOverview}
            </p>

            {/* Invariants */}
            <div className="mt-4 space-y-2">
              <div className="font-mono text-xs font-semibold text-neutral-400 uppercase">
                Enforced Mathematical Invariants:
              </div>
              <ul className="space-y-1.5 font-mono text-xs text-neutral-300">
                {project.systemInvariants.map((inv, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{inv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Technical Decisions Grid */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400">
              04 / Technical Decisions & Engineered Trade-offs
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {project.technicalDecisions.map((dec, idx) => (
                <div key={idx} className="rounded border border-neutral-800 bg-neutral-950 p-5 space-y-3 font-mono text-xs">
                  <div className="text-sm font-bold text-neutral-100">{dec.decision}</div>
                  <div className="text-neutral-400 leading-relaxed font-sans">{dec.rationale}</div>
                  <div className="rounded bg-neutral-900 p-2.5 text-[11px] text-amber-300/90 font-mono">
                    <span className="font-bold text-amber-400">Trade-off:</span> {dec.tradeoff}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Limitations & Future Roadmap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
            <div className="rounded border border-neutral-800 bg-neutral-950 p-5 space-y-2 font-mono text-xs">
              <div className="text-neutral-400 font-bold uppercase">Current Limitations:</div>
              <ul className="space-y-1 text-neutral-400">
                {project.limitations.map((lim, idx) => (
                  <li key={idx}>• {lim}</li>
                ))}
              </ul>
            </div>

            <div className="rounded border border-neutral-800 bg-neutral-950 p-5 space-y-2 font-mono text-xs">
              <div className="text-neutral-400 font-bold uppercase">Future Improvements:</div>
              <ul className="space-y-1 text-neutral-400">
                {project.futureWork.map((fw, idx) => (
                  <li key={idx}>• {fw}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
