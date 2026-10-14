import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import EngineeringFocus from '@/components/sections/EngineeringFocus';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import SystemArch from '@/components/sections/SystemArch';
import ExperienceTimeline from '@/components/sections/ExperienceTimeline';
import SkillsMatrix from '@/components/sections/SkillsMatrix';
import ContactSection from '@/components/sections/ContactSection';

export const metadata = {
  title: 'Soumyashree Rout — Backend & Distributed Systems Engineer',
  description:
    'Engineering portfolio of Soumyashree Rout. High-throughput backend systems, distributed consensus, discrete-event simulation, and robust API contracts.',
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#080808] text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <EngineeringFocus />
        <FeaturedProjects />
        <SystemArch />
        <ExperienceTimeline />
        <SkillsMatrix />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
