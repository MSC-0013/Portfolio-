'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Work', href: '#projects' },
    { label: 'Engineering', href: '#engineering' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-[#080808]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Position */}
        <Link href="/" className="group flex flex-col space-y-0.5">
          <span className="font-mono text-xs font-semibold tracking-wider text-neutral-900 dark:text-neutral-100 uppercase transition-colors group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
            Soumyashree Rout
          </span>
          <span className="font-mono text-[10px] tracking-tight text-neutral-500 dark:text-neutral-400">
            Junior Software Engineer · PractmoMind
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-mono text-xs text-neutral-600 dark:text-neutral-400 transition-colors hover:text-black dark:hover:text-neutral-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Button, Theme Toggle & Resume */}
        <div className="hidden md:flex md:items-center md:space-x-3">
          <ThemeToggle />

          <a
            href="/resume/soumyashree-rout-cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center space-x-1.5 rounded-sm border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 px-3 py-1.5 font-mono text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-all hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <span>Resume</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-sm p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#080808] px-4 pt-2 pb-6 md:hidden">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-mono text-sm text-neutral-700 dark:text-neutral-300 py-1 transition-colors hover:text-black dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <a
                href="/resume/soumyashree-rout-cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center space-x-1.5 rounded-sm border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 py-2 font-mono text-xs font-medium text-neutral-800 dark:text-neutral-200"
              >
                <span>Download Resume</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
