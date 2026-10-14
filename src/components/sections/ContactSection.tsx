'use client';

import React, { useState } from 'react';
import { Mail, ArrowUpRight, Send, CheckCircle2, AlertCircle, Loader2, RotateCcw } from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/Icons';

export default function ContactSection() {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderEmail || !message || !senderName) return;

    setIsSubmitting(true);
    setStatus('idle');
    setStatusMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: senderName,
          email: senderEmail,
          message,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setStatusMessage(
          data.message ||
            'Your dispatch has been delivered directly to soumyashree.rout.dev@gmail.com.'
        );
      } else {
        setStatus('error');
        setStatusMessage(data.error || 'Failed to dispatch message.');
      }
    } catch {
      setStatus('error');
      setStatusMessage('Network connection error. You can use the direct email link below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMailtoFallback = () => {
    const subject = encodeURIComponent(`Engineering Inquiry from ${senderName || 'Recruiter/Engineer'}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${senderName} (${senderEmail})`);
    window.location.href = `mailto:soumyashree.rout.dev@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleResetForm = () => {
    setStatus('idle');
    setSenderName('');
    setSenderEmail('');
    setMessage('');
    setStatusMessage('');
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
                className="flex items-center space-x-3 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3.5 text-neutral-800 dark:text-neutral-200 transition-colors hover:border-black dark:hover:border-neutral-600 shadow-2xs"
              >
                <Mail className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <span className="font-semibold">soumyashree.rout.dev@gmail.com</span>
                <span className="text-neutral-400 dark:text-neutral-500 ml-auto">Direct Email ↗</span>
              </a>

              <a
                href="https://github.com/SoumyashreeRout"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3.5 text-neutral-800 dark:text-neutral-200 transition-colors hover:border-black dark:hover:border-neutral-600 shadow-2xs"
              >
                <Github className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <span className="font-semibold">github.com/SoumyashreeRout</span>
                <span className="text-neutral-400 dark:text-neutral-500 ml-auto">Repositories ↗</span>
              </a>

              <a
                href="https://linkedin.com/in/soumyashree-rout"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3.5 text-neutral-800 dark:text-neutral-200 transition-colors hover:border-black dark:hover:border-neutral-600 shadow-2xs"
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
              <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 pb-4 font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                <span>Send an Engineering Dispatch</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                  Delivered to Inbox
                </span>
              </div>

              {status === 'success' ? (
                <div className="py-10 text-center space-y-4 font-mono text-xs">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Engineering Dispatch Transmitted!
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                    {statusMessage}
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="inline-flex items-center space-x-1.5 rounded-sm border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 px-4 py-2 font-mono text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Send Another Dispatch</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4 font-mono text-xs">
                  {status === 'error' && (
                    <div className="rounded border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-3 text-red-700 dark:text-red-300 flex flex-col gap-2">
                      <div className="flex items-center space-x-2 font-semibold">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                        <span>{statusMessage}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleMailtoFallback}
                        className="text-[11px] underline text-left hover:text-red-900 dark:hover:text-red-100"
                      >
                        Click here to send directly via your local email client →
                      </button>
                    </div>
                  )}

                  <div>
                    <label htmlFor="contact-name" className="block text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Name / Company
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Alex (Engineering Manager)"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full rounded border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2.5 text-neutral-900 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Your Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full rounded border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2.5 text-neutral-900 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Technical Context / Inquiry
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      placeholder="Describe the engineering role, distributed systems problem, or project collaboration..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full rounded border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2.5 text-neutral-900 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center space-x-2 rounded-sm bg-neutral-900 dark:bg-neutral-100 py-3 font-mono text-xs font-semibold text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-white transition-colors disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Transmitting Dispatch to Inbox...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
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
