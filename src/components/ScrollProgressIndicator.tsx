'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export const ScrollProgressIndicator = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Apply smoothing to the scrollYProgress value
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Transform scroll progress to control the scroll-to-top button visibility
  const topButtonOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.9, 1],
    [0, 0, 0, 1]
  );
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // Update scroll-to-top button visibility based on scroll position
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setShowScrollToTop(latest > 0.9);
    });
    
    return () => unsubscribe();
  }, [scrollYProgress]);
  
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  };
  
  // Don't render the indicator if user prefers reduced motion
  if (prefersReducedMotion) return null;
  
  return (
    <>
      {/* Progress bar - simple thin line without markers */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 relative">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-300 to-sky-400 origin-left"
          style={{ scaleX }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          aria-hidden="true" // Hide from screen readers as it's decorative
        />
      </div>
      
      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-6 right-6 p-3 rounded-full bg-gray-950 border border-gray-800 text-white shadow-lg hover:bg-emerald-600 transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        style={{ opacity: topButtonOpacity }}
        onClick={handleScrollToTop}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: showScrollToTop ? 1 : 0.8,
          opacity: showScrollToTop ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </motion.button>
    </>
  );
}; 