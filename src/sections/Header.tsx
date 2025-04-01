'use client';

import { useEffect, useState } from 'react';

export const Header = () => {
  const [activeSection, setActiveSection] = useState('home');

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

    window.addEventListener('scroll', handleScrollPosition);
    return () => window.removeEventListener('scroll', handleScrollPosition);
  }, []);

  return (
    <div className="flex justify-center items-center fixed left-[50%] translate-x-[-50%] top-3 z-10">
      <nav className="flex gap-1 p-0.5 backdrop-blur border border-white/15 rounded-full bg-white/10">
        <a 
          href="#home" 
          onClick={(e) => handleScroll(e, 'home')}
          className={`nav-item ${activeSection === 'home' ? 'bg-white text-gray-900 hover:bg-white/70 hover:text-gray-900' : ''}`}
        >
          Home
        </a>
        <a 
          href="#projects" 
          onClick={(e) => handleScroll(e, 'projects')}
          className={`nav-item ${activeSection === 'projects' ? 'bg-white text-gray-900 hover:bg-white/70 hover:text-gray-900' : ''}`}
        >
          Projects
        </a>
        <a 
          href="#about" 
          onClick={(e) => handleScroll(e, 'about')}
          className={`nav-item ${activeSection === 'about' ? 'bg-white text-gray-900 hover:bg-white/70 hover:text-gray-900' : ''}`}
        >
          About
        </a>
        <a 
          href="#advice" 
          onClick={(e) => handleScroll(e, 'advice')}
          className={`nav-item ${activeSection === 'advice' ? 'bg-white text-gray-900 hover:bg-white/70 hover:text-gray-900' : ''}`}
        >
          Advice
        </a>
        <a 
          href="#contact" 
          onClick={(e) => handleScroll(e, 'contact')}
          className={`nav-item ${activeSection === 'contact' ? 'bg-white text-gray-900 hover:bg-white/70 hover:text-gray-900' : ''}`}
        >
          Contact
        </a>
      </nav>
    </div>
  );
};
