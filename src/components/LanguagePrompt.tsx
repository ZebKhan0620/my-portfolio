'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export const LanguagePrompt = () => {
  const { setLanguage } = useLanguage();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user has already selected a language
    const hasSelectedLanguage = localStorage.getItem('languageSelected');
    
    if (!hasSelectedLanguage) {
      // Wait a bit before showing the prompt for better UX
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const selectLanguage = (lang: 'en' | 'ja') => {
    setLanguage(lang);
    localStorage.setItem('languageSelected', 'true');
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm mx-4 shadow-xl"
          >
            <h2 className="text-xl font-serif font-medium text-center mb-4">Choose Your Language</h2>
            <p className="text-gray-400 text-center mb-6">言語を選択してください</p>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={() => selectLanguage('en')}
                className="flex items-center justify-center gap-3 bg-white text-gray-900 font-medium px-4 py-3 rounded-lg hover:bg-white/90 transition-colors"
              >
                <span role="img" aria-hidden="true">🇬🇧</span>
                English
              </button>
              
              <button
                onClick={() => selectLanguage('ja')}
                className="flex items-center justify-center gap-3 bg-transparent border border-white/20 text-white font-medium px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span role="img" aria-hidden="true">🇯🇵</span>
                日本語
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 