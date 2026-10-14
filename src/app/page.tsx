import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ExperienceTimeline from '@/components/sections/ExperienceTimeline';
import EngineeringFocus from '@/components/sections/EngineeringFocus';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import SystemArch from '@/components/sections/SystemArch';
import SkillsMatrix from '@/components/sections/SkillsMatrix';
import ContactSection from '@/components/sections/ContactSection';

export const metadata = {
  title: 'Soumyashree Rout — Backend & Distributed Systems Engineer',
  description:
    'Junior Software Engineer at PractmoMind. Distributed systems, Quorum consistency, discrete-event simulation, and production API architecture.',
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#080808] text-neutral-900 dark:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ExperienceTimeline />
        <EngineeringFocus />
        <FeaturedProjects />
        <SystemArch />
        <SkillsMatrix />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
