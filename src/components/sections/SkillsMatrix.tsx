'use client';

import React from 'react';
import { TECHNICAL_SKILLS } from '@/content/skills';
import { Code, Terminal, Layers, Cloud } from 'lucide-react';

export default function SkillsMatrix() {
  return (
    <section id="skills" className="border-b border-neutral-200 bg-neutral-50/70 py-20 text-neutral-900 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between border-b border-neutral-200 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500">
              06 / Technical Inventory
            </div>
            <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              Skills & Engineering Taxonomy
            </h2>
          </div>
          <p className="mt-4 max-w-md font-mono text-xs text-neutral-600 sm:mt-0">
            Categorized technical capabilities derived from hands-on systems development and production delivery.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {TECHNICAL_SKILLS.map((cat, index) => (
            <div
              key={index}
              className="rounded-sm border border-neutral-200 bg-white p-6 sm:p-8 space-y-4 shadow-2xs"
            >
              <div className="border-b border-neutral-200/80 pb-3">
                <h3 className="font-sans text-lg font-bold text-neutral-900">
                  {cat.category}
                </h3>
                <p className="mt-1 font-mono text-xs text-neutral-500">
                  {cat.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {cat.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex flex-col justify-between gap-1 rounded border border-neutral-100 bg-neutral-50/60 p-2.5 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-semibold text-neutral-900">
                        {skill.name}
                      </span>
                      <span
                        className={`rounded-xs px-1.5 py-0.2 font-mono text-[9px] uppercase font-bold ${
                          skill.level === 'Core'
                            ? 'bg-neutral-900 text-white'
                            : skill.level === 'Advanced'
                            ? 'bg-neutral-200 text-neutral-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {skill.level}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] text-neutral-500">
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
