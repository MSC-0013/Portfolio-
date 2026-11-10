'use client';

import React from 'react';
import { WORK_EXPERIENCE, EDUCATION, ExperienceRole } from '@/content/experience';
import { Briefcase, GraduationCap, ArrowUpRight } from 'lucide-react';

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#080808] py-20 text-neutral-900 dark:text-white transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between border-b border-neutral-200 dark:border-neutral-800 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              03 / Trajectory & Track Record
            </div>
            <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Professional Experience
            </h2>
          </div>
          <p className="mt-4 max-w-md font-mono text-xs text-neutral-600 dark:text-neutral-400 sm:mt-0">
            Production backend engineering, database query optimization, and idempotent distributed messaging.
          </p>
        </div>

        {/* Work Experience */}
        <div className="mt-12 space-y-12">
          {WORK_EXPERIENCE.map((exp: ExperienceRole, index: number) => (
            <div
              key={index}
              className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/60 p-6 sm:p-10 transition-colors"
            >
              {/* Role Header */}
              <div className="flex flex-col justify-between gap-3 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-6 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                    <h3 className="font-sans text-2xl font-bold text-neutral-900 dark:text-white">
                      {exp.role} —{' '}
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                        {exp.company}
                      </span>
                    </h3>
                  </div>
                  <div className="mt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {exp.location} · {exp.period}
                  </div>
                </div>

                <span className="self-start rounded-xs border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                  Current Role
                </span>
              </div>

              {/* Summary */}
              <p className="mt-6 text-base leading-relaxed text-neutral-700 dark:text-neutral-300 font-sans">
                {exp.summary}
              </p>

              {/* Quantified Engineering Impact List */}
              <div className="mt-8 space-y-3.5">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Quantified Production Achievements:
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {exp.highlights.map((h, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 transition-colors hover:border-neutral-400 dark:hover:border-neutral-700"
                    >
                      <div className="text-xs sm:text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 font-sans flex-1">
                        {h.bullet}
                      </div>
                      <div className="shrink-0 self-start sm:self-center font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-1 rounded-xs">
                        {h.metric}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Production Stack */}
              <div className="mt-8 border-t border-neutral-200/80 dark:border-neutral-800/80 pt-6">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  Production Technologies:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {exp.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-xs border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 font-mono text-[11px] text-neutral-800 dark:text-neutral-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Education Subsection — Clean Single Line */}
        <div className="mt-12 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/60 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2 text-neutral-700 dark:text-neutral-300">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <div className="font-sans text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                  {EDUCATION.degree}
                </div>
                <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {EDUCATION.institution}
                </div>
              </div>
            </div>

            <div className="font-mono text-xs font-semibold text-neutral-600 dark:text-neutral-400 self-start sm:self-center">
              {EDUCATION.period}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
