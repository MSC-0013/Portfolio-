'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowDown, ArrowUpRight, Mail } from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/Icons';
import FallbackSvgMesh from '@/components/3d/FallbackSvgMesh';

// Lazy-load 3D Observatory Canvas to protect LCP and avoid SSR mismatches
const ObservatoryCanvas = dynamic(() => import('@/components/3d/ObservatoryCanvas'), {
  ssr: false,
  loading: () => <FallbackSvgMesh />,
});

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] border-b border-neutral-800 bg-[#080808] text-white flex flex-col justify-center overflow-hidden">
      {/* Background Technical Grid */}
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 w-full">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Editorial Positioning & Headline */}
          <div className="space-y-6 lg:col-span-7">
            {/* Monospace Position Header */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-neutral-400">
              <span className="font-semibold text-neutral-200">SOUMYASHREE ROUT</span>
              <span>—</span>
              <span className="text-neutral-400">BACKEND & DISTRIBUTED SYSTEMS</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              I build backend systems designed to handle complexity.
            </h1>

            {/* Supporting Positioning */}
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-neutral-400 font-sans">
              Software engineer focused on distributed systems, replication invariants,
              concurrency contention, and high-throughput API architecture. Building resilient
              software from APIs to multi-node consensus topologies.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <Link
                href="#projects"
                className="inline-flex items-center space-x-2 rounded-sm bg-neutral-100 px-5 py-3 font-semibold text-black transition-all hover:bg-white"
              >
                <span>Explore Case Studies</span>
                <ArrowDown className="h-4 w-4" />
              </Link>

              <a
                href="/resume/soumyashree-rout-cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 rounded-sm border border-neutral-700 bg-neutral-900 px-5 py-3 font-medium text-neutral-200 transition-all hover:border-neutral-500 hover:bg-neutral-800"
              >
                <span>Download Resume</span>
                <ArrowUpRight className="h-4 w-4 text-neutral-400" />
              </a>
            </div>

            {/* Social Links & Monospace Handles */}
            <div className="flex items-center space-x-6 pt-4 font-mono text-xs text-neutral-400">
              <a
                href="https://github.com/SoumyashreeRout"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 transition-colors hover:text-white"
              >
                <Github className="h-4 w-4" />
                <span>GitHub ↗</span>
              </a>
              <a
                href="https://linkedin.com/in/soumyashree-rout"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 transition-colors hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn ↗</span>
              </a>
              <a
                href="mailto:soumyashree.rout.dev@gmail.com"
                className="inline-flex items-center space-x-1.5 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4" />
                <span>Email ↗</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3D Distributed Systems Observatory */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="w-full h-[380px] sm:h-[460px] rounded-sm border border-neutral-800/80 bg-neutral-950/40 backdrop-blur-xs overflow-hidden shadow-2xl">
              <ObservatoryCanvas />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
