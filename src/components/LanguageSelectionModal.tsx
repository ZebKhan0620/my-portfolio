'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { locales, Locale } from '@/config/i18n';
import { getCookie } from 'cookies-next';

export default function LanguageSelectionModal() {
  const { locale, setLocale, t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if user has previously selected a language (stored in cookie)
    const hasSelectedLanguage = getCookie('NEXT_LOCALE');
    
    // If no language preference exists, show the modal
    if (!hasSelectedLanguage) {
      // Small delay to allow the page to load first
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Handle language selection
  const selectLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsVisible(false);
  };
  
  // Get locale display information
  const getLocaleInfo = (localeCode: Locale) => {
    const displayInfo: Record<Locale, { flag: string; name: string }> = {
      en: { flag: '🇺🇸', name: 'English' },
      ja: { flag: '🇯🇵', name: '日本語' }
    };
    
    return displayInfo[localeCode];
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50"
            onClick={() => setIsVisible(false)}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-2xl max-w-md w-11/12 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="language-selection-title"
          >
            <h2 
              id="language-selection-title"
              className="text-xl sm:text-2xl font-bold mb-4 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-sky-400"
            >
              {t('languageSwitcher.chooseLanguage')}
            </h2>
            
            <p className="text-gray-300 text-center mb-6">
              Welcome to my portfolio! Please select your preferred language.
              <br />
              ポートフォリオへようこそ！言語を選択してください。
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {locales.map((localeOption) => {
                const info = getLocaleInfo(localeOption as Locale);
                
                return (
                  <button
                    key={localeOption}
                    onClick={() => selectLanguage(localeOption as Locale)}
                    className="flex flex-col items-center justify-center bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg p-4 transition-colors text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <span className="text-2xl mb-2">{info.flag}</span>
                    <span className="font-medium">{info.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 