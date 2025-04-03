'use client';

import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Header = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Handle smooth scrolling when clicking navigation links
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    const sectionId = id.replace('#', '');
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      
      // Close mobile menu if open
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScrollPosition = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
      
      const sections = ['home', 'projects', 'about', 'advice', 'contact'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section is in view (with some buffer for better UX)
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Check screen size for responsive adjustments
    const checkScreenSize = () => {
      // Close mobile menu on resize to larger screen
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    // Initial checks
    checkScreenSize();
    handleScrollPosition();

    window.addEventListener('scroll', handleScrollPosition);
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('scroll', handleScrollPosition);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [mobileMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const navigationItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'about', label: t('nav.about') },
    { id: 'advice', label: t('nav.advice') },
    { id: 'contact', label: t('nav.contact') }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'} bg-transparent`}>
      <div className="container mx-auto px-4 xs:px-4 sm:px-6 md:px-8 flex justify-center">
        {/* Desktop Navigation (md and larger) */}
        <nav className={`hidden md:flex gap-1 p-0.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/15 overflow-hidden transition-all duration-300`}>
          {navigationItems.map(item => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleScroll(e, item.id)}
              className={`relative px-4 py-1.5 text-sm transition-all duration-300 ${
                activeSection === item.id 
                  ? 'text-gray-900 font-medium' 
                  : 'text-white hover:text-white/80'
              }`}
              aria-current={activeSection === item.id ? 'page' : undefined}
            >
              {activeSection === item.id && (
                <span className="absolute inset-0 bg-white rounded-full -z-10"></span>
              )}
              {item.label}
            </a>
          ))}
        </nav>
        
        {/* Tablet Navigation (sm to md) */}
        <nav className={`hidden sm:flex md:hidden gap-0.5 p-0.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/15 overflow-hidden transition-all duration-300`}>
          {navigationItems.map(item => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleScroll(e, item.id)}
              className={`relative px-2 py-1.5 text-xs transition-all duration-300 ${
                activeSection === item.id 
                  ? 'text-gray-900 font-medium' 
                  : 'text-white hover:text-white/80'
              }`}
              aria-current={activeSection === item.id ? 'page' : undefined}
            >
              {activeSection === item.id && (
                <span className="absolute inset-0 bg-white rounded-full -z-10"></span>
              )}
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Navigation (up to sm) */}
        <div className="sm:hidden w-full flex justify-between items-center pr-16">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex flex-col justify-center items-center w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/15 focus:outline-none`}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className={`block w-5 h-0.5 bg-white mb-1 transition-all duration-300 ${mobileMenuOpen ? 'transform rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${mobileMenuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>

          {/* Mobile Menu Dropdown */}
          <div 
            ref={mobileMenuRef}
            className={`absolute top-full left-4 mt-2 w-56 py-2 rounded-lg bg-gray-900/80 backdrop-blur-md border border-white/10 shadow-xl transform transition-all duration-300 sm:hidden ${
              mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            {navigationItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleScroll(e, item.id)}
                className={`block px-4 py-2 text-sm ${
                  activeSection === item.id 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-white/80 hover:bg-white/5'
                }`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
