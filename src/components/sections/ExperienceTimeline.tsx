'use client';

import React from 'react';
import { WORK_EXPERIENCE, EDUCATION } from '@/content/experience';
import { Briefcase, GraduationCap, CheckCircle } from 'lucide-react';

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="border-b border-neutral-200 bg-white py-20 text-neutral-900 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between border-b border-neutral-200 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500">
              05 / Trajectory & Track Record
            </div>
            <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              Professional Experience
            </h2>
          </div>
          <p className="mt-4 max-w-md font-mono text-xs text-neutral-600 sm:mt-0">
            Verified responsibilities across production backend services, database migrations, and CI/CD pipelines.
          </p>
        </div>

        {/* Work Experience */}
        <div className="mt-12 space-y-12">
          {WORK_EXPERIENCE.map((exp, index) => (
            <div key={index} className="rounded-sm border border-neutral-200 bg-neutral-50/50 p-6 sm:p-10">
              {/* Role Header */}
              <div className="flex flex-col justify-between gap-2 border-b border-neutral-200/80 pb-6 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-neutral-700" />
                    <h3 className="font-sans text-2xl font-bold text-neutral-900">
                      {exp.role} — <span className="font-semibold text-neutral-700">{exp.company}</span>
                    </h3>
                  </div>
                  <div className="mt-1 font-mono text-xs text-neutral-500">
                    {exp.location} · {exp.period}
                  </div>
                </div>

                <span className="self-start rounded-xs border border-emerald-300 bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-800">
                  Active Role
                </span>
              </div>

              {/* Summary */}
              <p className="mt-6 text-base leading-relaxed text-neutral-700 font-sans">
                {exp.summary}
              </p>

              {/* 4 Grouped Themes Grid */}
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {exp.themes.map((theme, tIdx) => (
                  <div
                    key={tIdx}
                    className="rounded-sm border border-neutral-200 bg-white p-5 space-y-3"
                  >
                    <div className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-800">
                      {theme.title}
                    </div>
                    <div className="text-xs text-neutral-600 font-sans">
                      {theme.description}
                    </div>
                    <ul className="space-y-1.5 pt-1">
                      {theme.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start space-x-2 text-xs leading-relaxed text-neutral-700">
                          <CheckCircle className="h-3.5 w-3.5 text-neutral-900 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Stack Badges */}
              <div className="mt-8 flex flex-wrap gap-1.5 border-t border-neutral-200/80 pt-6">
                {exp.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-xs border border-neutral-300 bg-neutral-100 px-2 py-1 font-mono text-[11px] text-neutral-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Education Subsection */}
        <div className="mt-16 rounded-sm border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8">
          <div className="flex items-center space-x-2 border-b border-neutral-200/80 pb-4">
            <GraduationCap className="h-5 w-5 text-neutral-700" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-neutral-900">
              Education & Academic Grounding
            </h3>
          </div>

          <div className="mt-4 flex flex-col justify-between sm:flex-row sm:items-center">
            <div>
              <div className="font-sans text-lg font-bold text-neutral-900">
                {EDUCATION.degree} in {EDUCATION.field}
              </div>
              <div className="font-mono text-xs text-neutral-600 mt-0.5">
                {EDUCATION.institution} · {EDUCATION.period}
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-neutral-600 font-mono">
            {EDUCATION.details}
          </p>
        </div>
      </div>
    </section>
  );
}
