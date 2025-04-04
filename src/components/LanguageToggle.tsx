'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Only show component after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with same dimensions to avoid layout shift
    return (
      <div className="h-8 w-[72px] md:w-[76px] rounded-full bg-white/10 backdrop-blur-sm opacity-0">
        <span className="sr-only">Language toggle</span>
      </div>
    );
  }

  return (
    <motion.button
      onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
      className="relative h-8 w-[72px] md:w-[76px] flex items-center rounded-full bg-gray-800/80 hover:bg-gray-800/90 border border-white/15 backdrop-blur-sm transition-all duration-300 group p-1"
      aria-label={`Switch to ${language === 'en' ? 'Japanese' : 'English'}`}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      title={language === 'en' ? 'Switch to Japanese' : '英語に切り替える'}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-sky-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Slider pill */}
      <motion.div 
        className="absolute h-6 w-[34px] bg-white rounded-full shadow-sm z-10"
        initial={false}
        animate={{ 
          x: language === 'en' ? 2 : 36
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      
      {/* Language labels */}
      <div className="relative flex justify-between w-full px-2 z-20">
        <span className={`text-xs font-medium transition-colors ${language === 'en' ? 'text-gray-900' : 'text-white/80'}`}>
          EN
        </span>
        <span className={`text-xs font-medium transition-colors ${language === 'ja' ? 'text-gray-900' : 'text-white/80'}`}>
          JP
        </span>
      </div>
      
      {/* Tooltip */}
      <div className="absolute top-full mt-2 right-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg border border-white/10">
          {language === 'en' ? '日本語に切り替える' : 'Switch to English'}
        </div>
      </div>
    </motion.button>
  );
}; 