'use client';

import React from 'react';
import { TECHNICAL_SKILLS } from '@/content/skills';

export default function SkillsMatrix() {
  return (
    <section id="skills" className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#080808] py-20 text-neutral-900 dark:text-white transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between border-b border-neutral-200 dark:border-neutral-800 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              06 / Technical Inventory
            </div>
            <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Skills & Engineering Taxonomy
            </h2>
          </div>
          <p className="mt-4 max-w-md font-mono text-xs text-neutral-600 dark:text-neutral-400 sm:mt-0">
            Categorized technical capabilities derived from hands-on systems development and production delivery.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {TECHNICAL_SKILLS.map((cat, index) => (
            <div
              key={index}
              className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/60 p-6 sm:p-8 space-y-4 shadow-2xs"
            >
              <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3">
                <h3 className="font-sans text-lg font-bold text-neutral-900 dark:text-white">
                  {cat.category}
                </h3>
                <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {cat.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {cat.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex flex-col justify-between gap-1 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-2.5 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {skill.name}
                      </span>
                      <span
                        className={`rounded-xs px-1.5 py-0.2 font-mono text-[9px] uppercase font-bold ${
                          skill.level === 'Core'
                            ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black'
                            : skill.level === 'Advanced'
                            ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        }`}
                      >
                        {skill.level}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      {skill.notes}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
