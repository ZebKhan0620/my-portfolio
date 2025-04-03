'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createLogger } from '@/lib/logging';
import { locales, defaultLocale } from '@/config/i18n';
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

const logger = createLogger('RootPage', true);

/**
 * Detect if the request is from a bot or search engine crawler
 */
function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  
  const botPatterns = [
    'bot', 'crawler', 'spider', 'slurp', 'baiduspider',
    'yandex', 'googlebot', 'bingbot', 'semrushbot',
    'lighthouse', 'chrome-lighthouse', 'screaming frog',
    'ahrefsbot', 'bytespider', 'facebookexternalhit',
    'whatsapp', 'telegrambot', 'discordbot', 'twitterbot',
    'applebot', 'pintbot'
  ];
  
  const lowerUserAgent = userAgent.toLowerCase();
  return botPatterns.some(pattern => lowerUserAgent.includes(pattern));
}

/**
 * Try to detect the preferred language from Accept-Language header
 */
function detectLanguageFromHeader(): string {
  try {
    const headersList = headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const userAgent = headersList.get('user-agent');
    
    // Log user agent for debugging
    if (isBot(userAgent)) {
      logger.info('Bot detected', { userAgent, acceptLanguage });
    }
    
    // Extract language preferences
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        const [language, quality = 'q=1.0'] = lang.trim().split(';');
        const q = parseFloat(quality.replace('q=', ''));
        return { language: language.split('-')[0], q };
      })
      .filter(({ language }) => locales.includes(language as any))
      .sort((a, b) => b.q - a.q);
    
    if (languages.length > 0) {
      // Return the language with highest quality score
      return languages[0].language;
    }
  } catch (error) {
    logger.error('Error detecting language from header', error);
  }
  
  return defaultLocale;
}

/**
 * Root page that redirects to the appropriate language page
 */
export default async function RootPage() {
  const preferredLocale = detectLanguageFromHeader();
  logger.info('Redirecting to language page', { preferredLocale });
  
  // Redirect to the appropriate language page
  redirect(`/${preferredLocale}`);
  
  // This component will never render
  return null;
}

export async function Home() {
  return (
    <div className="relative">
      {/* Skip link for keyboard users to bypass navigation */}
      <SkipLink targetId="main-content" />
      
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
          <Link 
            href="/admin" 
            className="group flex items-center px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 transition-all duration-300 hover:bg-gray-700/90 hover:border-emerald-500/30"
            aria-label="Admin login"
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
          </Link>
        </div>
      </footer>
    </div>
  );
}
