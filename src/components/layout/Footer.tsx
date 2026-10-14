'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, ArrowUpRight } from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/Icons';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#080808] text-neutral-600 dark:text-neutral-400 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Identity & Core Philosophy */}
          <div className="space-y-3">
            <div className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              SOUMYASHREE ROUT
            </div>
            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-sm">
              Junior Software Engineer at PractmoMind. Backend & Distributed Systems Engineer specializing
              in reliable architectures, concurrency contention, consensus protocols, and production APIs.
            </p>
            <div className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              Bhubaneswar, Odisha, India
            </div>
          </div>

          {/* Core Projects Navigation */}
          <div className="space-y-3">
            <div className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
              Flagship Case Studies
            </div>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link
                  href="/projects/blackbox-x"
                  className="inline-flex items-center space-x-1 transition-colors hover:text-black dark:hover:text-neutral-100"
                >
                  <span>01 — BLACKBOX-X (Simulation Engine)</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/quorum-lab"
                  className="inline-flex items-center space-x-1 transition-colors hover:text-black dark:hover:text-neutral-100"
                >
                  <span>02 — QUORUM LAB (Consensus & Quorums)</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/system-x"
                  className="inline-flex items-center space-x-1 transition-colors hover:text-black dark:hover:text-neutral-100"
                >
                  <span>03 — SYSTEM-X (Integration API)</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification & Socials */}
          <div className="space-y-3">
            <div className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
              Connect & Source
            </div>
            <div className="flex flex-col space-y-2 font-mono text-xs">
              <a
                href="https://github.com/SoumyashreeRout"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-neutral-100 transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                <span>github.com/SoumyashreeRout</span>
              </a>
              <a
                href="https://linkedin.com/in/soumyashree-rout"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-neutral-100 transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span>linkedin.com/in/soumyashree-rout</span>
              </a>
              <a
                href="mailto:soumyashree.rout.dev@gmail.com"
                className="inline-flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-neutral-100 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>soumyashree.rout.dev@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="mt-12 flex flex-col items-start justify-between border-t border-neutral-200 dark:border-neutral-800/80 pt-6 font-mono text-[11px] text-neutral-500 dark:text-neutral-400 sm:flex-row sm:items-center">
          <div>
            Built with Next.js 16.4 · React 19 · Three.js · Tailwind CSS
          </div>
          <div className="mt-2 sm:mt-0">
            Precision Monochrome Architecture © 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
