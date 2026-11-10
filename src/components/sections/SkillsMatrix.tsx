'use client';

import React from 'react';
import { EVIDENCE_SKILLS, EvidenceSkillGroup } from '@/content/skills';
import { ShieldCheck, Terminal, Compass } from 'lucide-react';

export default function SkillsMatrix() {
  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Terminal className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 1:
        return <ShieldCheck className="h-4 w-4 text-neutral-800 dark:text-neutral-200" />;
      default:
        return <Compass className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />;
    }
  };

  return (
    <section id="skills" className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#080808] py-20 text-neutral-900 dark:text-white transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between border-b border-neutral-200 dark:border-neutral-800 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              04 / Technical Evidence
            </div>
            <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Skills & Engineering Taxonomy
            </h2>
          </div>
          <p className="mt-4 max-w-md font-mono text-xs text-neutral-600 dark:text-neutral-400 sm:mt-0">
            Categorized technical capabilities grounded in verifiable production code and deterministic test suites.
          </p>
        </div>

        {/* 3 Evidence-Based Cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {EVIDENCE_SKILLS.map((group: EvidenceSkillGroup, index: number) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/60 p-6 sm:p-8 transition-colors hover:border-neutral-400 dark:hover:border-neutral-700 shadow-2xs"
            >
              <div>
                {/* Group Header */}
                <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {getIcon(index)}
                      <h3 className="font-sans text-lg font-bold text-neutral-900 dark:text-white">
                        {group.groupTitle}
                      </h3>
                    </div>
                  </div>
                  <span className="inline-block mt-2 rounded-xs border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 font-mono text-[10px] text-neutral-700 dark:text-neutral-300">
                    {group.badge}
                  </span>
                  <p className="mt-2 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {group.description}
                  </p>
                </div>

                {/* Skills List with Context */}
                <div className="mt-4 space-y-2.5">
                  {group.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="rounded border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-2.5 space-y-1 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700"
                    >
                      <div className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {skill.name}
                      </div>
                      <div className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
                        {skill.context}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
