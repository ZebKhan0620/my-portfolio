'use client';

import { useEffect, useState } from 'react';

export const Header = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobile, setIsMobile] = useState(false);

  // Handle smooth scrolling when clicking navigation links
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    const sectionId = id.replace('#', '');
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScrollPosition = () => {
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
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkScreenSize();

    window.addEventListener('scroll', handleScrollPosition);
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('scroll', handleScrollPosition);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <div className="flex justify-center items-center fixed left-[50%] translate-x-[-50%] top-2 sm:top-3 z-10">
      <nav className="flex gap-0.5 sm:gap-1 p-0.5 backdrop-blur border border-white/15 rounded-full bg-white/10 overflow-hidden">
        <a 
          href="#home" 
          onClick={(e) => handleScroll(e, 'home')}
          className={`nav-item px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm ${activeSection === 'home' ? 'bg-white text-gray-900 hover:bg-white/70 hover:text-gray-900' : ''}`}
          aria-current={activeSection === 'home' ? 'page' : undefined}
        >
          Home
        </a>
        <a 
          href="#projects" 
          onClick={(e) => handleScroll(e, 'projects')}
          className={`nav-item px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm ${activeSection === 'projects' ? 'bg-white text-gray-900 hover:bg-white/70 hover:text-gray-900' : ''}`}
          aria-current={activeSection === 'projects' ? 'page' : undefined}
        >
          Projects
        </a>
        <a 
          href="#about" 
          onClick={(e) => handleScroll(e, 'about')}
          className={`nav-item px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm ${activeSection === 'about' ? 'bg-white text-gray-900 hover:bg-white/70 hover:text-gray-900' : ''}`}
          aria-current={activeSection === 'about' ? 'page' : undefined}
        >
          About
        </a>
        <a 
          href="#advice" 
          onClick={(e) => handleScroll(e, 'advice')}
          className={`nav-item px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm ${activeSection === 'advice' ? 'bg-white text-gray-900 hover:bg-white/70 hover:text-gray-900' : ''}`}
          aria-current={activeSection === 'advice' ? 'page' : undefined}
        >
          Advice
        </a>
        <a 
          href="#contact" 
          onClick={(e) => handleScroll(e, 'contact')}
          className={`nav-item px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm ${activeSection === 'contact' ? 'bg-white text-gray-900 hover:bg-white/70 hover:text-gray-900' : ''}`}
          aria-current={activeSection === 'contact' ? 'page' : undefined}
        >
          Contact
        </a>
      </nav>
    </div>
  );
};
