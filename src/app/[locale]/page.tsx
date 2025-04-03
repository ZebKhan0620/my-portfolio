import React from 'react';
import { getTranslations, getSafeLocale } from '@/lib/i18n';
import { Metadata } from 'next';
import {Header} from '@/sections/Header';
import {HeroSection} from '@/sections/Hero';
import ProjectsSection from '@/sections/Projects';
import { TapeSection } from '@/sections/Tape';
import { AboutSection } from '@/sections/About';
import { ContactSection } from '@/sections/Contact'
import AdviceWall from '@/sections/AdviceWall';
import { Footer } from '@/sections/Footer';
import { ScrollProgressIndicator } from '@/components/ScrollProgressIndicator';
import Link from 'next/link';
import SkipLink from '@/components/accessibility/SkipLink';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AdminLink from '@/components/AdminLink';
import dynamic from 'next/dynamic';

// Dynamically import VisitorCounter with no SSR to ensure it only counts on client
const VisitorCounter = dynamic(() => import('@/components/VisitorCounter'), { ssr: false });

interface HomePageProps {
  params: {
    locale: string;
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = getSafeLocale(params.locale);
  const translations = await getTranslations(locale);

  return (
    <div className="relative">
      {/* Skip link for keyboard users to bypass navigation */}
      <SkipLink targetId="main-content" />
      
      {/* Language Switcher */}
      <div className="fixed top-3 right-3 xs:top-3.5 xs:right-3.5 sm:top-4 sm:right-4 md:top-6 md:right-6 z-50">
        <LanguageSwitcher />
      </div>
      
      {/* Visitor Counter */}
      <VisitorCounter />
      
      {/* Accessibility landmark for assistive technology */}
      <header>
        <Header />
      </header>
      
      <main id="main-content" tabIndex={-1}>
        {/* Scroll progress indicator */}
        <ScrollProgressIndicator />
        
        {/* Main sections */}
        <section id="home" aria-label="Introduction">
          <HeroSection />
        </section>
        
        <section id="projects" aria-label="My Projects">
          <ProjectsSection />
        </section>
        
        <div aria-hidden="true">
          <TapeSection />
        </div>
        
        <section id="about" aria-label="About Me">
          <AboutSection />
        </section>
        
        <section id="advice" aria-label="Advice Wall">
          <AdviceWall />
        </section>
        
        <section id="contact" aria-label="Contact Information">
          <ContactSection />
        </section>
      </main>
      
      <footer>
        <Footer />
        
        {/* Admin link - subtle but stylish in the corner */}
        <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-4 md:bottom-8 md:right-4 z-40">
          <AdminLink 
            href="/admin"
            className="group flex items-center px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 transition-all duration-300 hover:bg-gray-700/90 hover:border-emerald-500/30"
            ariaLabel="Admin login"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-emerald-400 transition-colors mr-1 sm:mr-1.5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" 
                clipRule="evenodd" 
              />
            </svg>
            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Admin</span>
          </AdminLink>
        </div>
      </footer>
    </div>
  );
}
