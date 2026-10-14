'use client';

import React, { useState } from 'react';
import { Mail, ArrowUpRight, Send, CheckCircle2 } from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/Icons';

export default function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderEmail || !message) return;
    
    const subject = encodeURIComponent(`Engineering Inquiry from ${senderName || 'Recruiter/Engineer'}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${senderName} (${senderEmail})`);
    window.location.href = `mailto:soumyashree.rout.dev@gmail.com?subject=${subject}&body=${body}`;
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-[#080808] py-20 text-neutral-900 dark:text-white transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Direct Invitation & Socials */}
          <div className="space-y-6 lg:col-span-6">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              07 / Direct Connection
            </div>

            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
              Have an interesting engineering problem?
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 font-sans">
              I am open to discussions regarding backend engineering, distributed systems,
              concurrency challenges, and full-stack software development. Whether you want to discuss
              a production architecture or discuss an engineering role, let&apos;s connect.
            </p>

            {/* Quick Contact Links */}
            <div className="space-y-3 pt-4 font-mono text-xs">
              <a
                href="mailto:soumyashree.rout.dev@gmail.com"
                className="flex items-center space-x-3 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3.5 text-neutral-800 dark:text-neutral-200 transition-colors hover:border-black dark:hover:border-neutral-600"
              >
                <Mail className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <span className="font-semibold">soumyashree.rout.dev@gmail.com</span>
                <span className="text-neutral-400 dark:text-neutral-500 ml-auto">Direct Email ↗</span>
              </a>

              <a
                href="https://github.com/SoumyashreeRout"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3.5 text-neutral-800 dark:text-neutral-200 transition-colors hover:border-black dark:hover:border-neutral-600"
              >
                <Github className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <span className="font-semibold">github.com/SoumyashreeRout</span>
                <span className="text-neutral-400 dark:text-neutral-500 ml-auto">Repositories ↗</span>
              </a>

              <a
                href="https://linkedin.com/in/soumyashree-rout"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3.5 text-neutral-800 dark:text-neutral-200 transition-colors hover:border-black dark:hover:border-neutral-600"
              >
                <Linkedin className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <span className="font-semibold">linkedin.com/in/soumyashree-rout</span>
                <span className="text-neutral-400 dark:text-neutral-500 ml-auto">Profile ↗</span>
              </a>
            </div>

            <div className="pt-2">
              <a
                href="/resume/soumyashree-rout-cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 rounded-sm bg-neutral-900 dark:bg-neutral-100 px-5 py-3 font-mono text-xs font-semibold text-white dark:text-black transition-all hover:bg-neutral-800 dark:hover:bg-white"
              >
                <span>Download Verified Resume (PDF)</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Clean Inquiry Form */}
          <div className="lg:col-span-6">
            <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 sm:p-8 shadow-sm">
              <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 pb-4 font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-300 uppercase tracking-wider">
                Send an Engineering Dispatch
              </div>

              {formSubmitted ? (
                <div className="py-12 text-center space-y-3 font-mono text-xs">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                  <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Email Client Dispatched</div>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
                    Your message was prepared in your local client. You can also reach me directly at{' '}
                    <span className="text-black dark:text-white font-bold">soumyashree.rout.dev@gmail.com</span>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4 font-mono text-xs">
                  <div>
                    <label htmlFor="contact-name" className="block text-neutral-600 dark:text-neutral-400 mb-1.5">Name / Company</label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="e.g. Alex (Engineering Manager)"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full rounded border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2.5 text-neutral-900 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-neutral-600 dark:text-neutral-400 mb-1.5">Your Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full rounded border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2.5 text-neutral-900 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-neutral-600 dark:text-neutral-400 mb-1.5">Technical Context / Inquiry</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      placeholder="Describe the engineering role, distributed systems problem, or project collaboration..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2.5 text-neutral-900 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center space-x-2 rounded-sm bg-neutral-900 dark:bg-neutral-100 py-3 font-mono text-xs font-semibold text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-white transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
