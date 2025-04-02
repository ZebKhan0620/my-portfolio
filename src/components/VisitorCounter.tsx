"use client"

import { useState, useEffect, useRef } from 'react';
import { useVisitorCounter } from '@/hooks/useVisitorCounter';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

export default function VisitorCounter() {
  const { count, isMilestone, loading, error } = useVisitorCounter();
  const [showMilestone, setShowMilestone] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const controls = useAnimation();
  const countRef = useRef<number | null>(null);
  
  // Animate count when it changes
  useEffect(() => {
    if (countRef.current !== null && count !== countRef.current) {
      controls.start({
        scale: [1, 1.2, 1],
        color: ['#ffffff', '#10b981', '#ffffff'],
        transition: { duration: 0.5 }
      });
    }
    countRef.current = count;
  }, [count, controls]);
  
  // Handle milestone display and auto-hide
  useEffect(() => {
    if (isMilestone) {
      setShowMilestone(true);
      const timer = setTimeout(() => {
        setShowMilestone(false);
      }, 12000); // Hide milestone message after 12 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isMilestone]);
  
  if (loading) {
    return (
      <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-50 bg-gray-800/80 backdrop-blur-sm px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg shadow-lg border border-gray-700/50">
        <div className="text-xs sm:text-sm text-gray-400 flex items-center">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 mr-1.5 sm:mr-2 animate-pulse"></div>
          Loading visitors...
        </div>
      </div>
    );
  }
  
  if (error) {
    return null; // Don't show anything if there's an error
  }

  return (
    <>
      {/* Enhanced visitor counter with expand/collapse functionality */}
      <motion.div 
        className={`fixed bottom-3 left-3 sm:bottom-6 sm:left-4 md:bottom-8 md:left-4 z-50 bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 transition-all duration-300 overflow-hidden ${isExpanded ? 'px-3 py-2.5 sm:px-4 sm:py-3' : 'px-2.5 py-1.5 sm:px-3 sm:py-2'}`}
        whileHover={{ scale: 1.03 }}
        layout
      >
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex-shrink-0 relative">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            {isExpanded && (
              <div className="absolute top-0 left-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
            )}
          </div>
          <div className="ml-1.5 sm:ml-2 flex items-center">
            <span className="text-xs sm:text-sm text-gray-300">Visitors: </span>
            <motion.span 
              className="ml-1 font-bold text-white text-xs sm:text-sm"
              animate={controls}
            >
              {count.toLocaleString()}
            </motion.span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-1.5 sm:ml-2 text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </div>
        </div>
        
        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-1.5 mt-1.5 sm:pt-2 sm:mt-2 border-t border-gray-700/50"
            >
              <div className="text-[10px] sm:text-xs text-gray-400 space-y-1 sm:space-y-1.5">
                <p className="flex items-center">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-400 mr-1 sm:mr-1.5"></span>
                  Updated in real-time
                </p>
                <p className="flex items-center">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 mr-1 sm:mr-1.5"></span>
                  Next milestone: {
                    MILESTONES.find(milestone => milestone > count) || 'Coming soon'
                  }
                </p>
                <p className="flex items-center">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-amber-400 mr-1 sm:mr-1.5"></span>
                  Thanks for visiting!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Enhanced milestone celebration popup */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: -100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 10, x: -50 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="fixed bottom-14 sm:bottom-16 md:bottom-20 left-3 sm:left-4 z-50 w-full max-w-[250px] sm:max-w-[280px] md:max-w-[320px] overflow-hidden"
          >
            <div className="relative">
              {/* Confetti overlay */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                    initial={{ 
                      x: Math.random() * 260, 
                      y: Math.random() * 100 + 50,
                      backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
                      opacity: 1,
                      scale: 0
                    }}
                    animate={{ 
                      y: [null, -40 - Math.random() * 60],
                      opacity: [null, 0],
                      scale: [null, 1 + Math.random()]
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
              
              <div className="bg-gradient-to-br from-emerald-600 to-blue-600 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl shadow-lg border border-emerald-500/50">
                <div className="flex items-start">
                  <div className="text-xl sm:text-2xl mr-2">🎉</div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white font-serif">Congratulations!</h3>
                    <p className="text-xs sm:text-sm text-white/90">
                      You are visitor number {count}! You're officially part of this journey.
                    </p>
                    <div className="mt-1.5 sm:mt-2 bg-white/10 p-1.5 sm:p-2 rounded text-[10px] sm:text-xs text-white/80 italic border-l-2 border-yellow-400 pl-1.5 sm:pl-2">
                      "Every visitor counts and makes this portfolio special!"
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMilestone(false)}
                  className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-white/80 hover:text-white"
                  aria-label="Close milestone message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Milestone values
const MILESTONES = [10, 20, 30, 50, 100, 200, 500, 1000]; 