'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { locales, Locale, localeMetadata } from '@/config/i18n';
import { setCookie, getCookie } from 'cookies-next';

/**
 * A modal prompt for first-time visitors to select their preferred language
 */
export default function LanguageSelectionPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has seen the language prompt before
    const hasSelectedLanguage = getCookie('LANGUAGE_PROMPT_SEEN');
    
    // Only show prompt if user hasn't seen it before
    if (!hasSelectedLanguage) {
      // Slight delay to avoid immediate popup when page loads
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle language selection
  const selectLanguage = (locale: Locale) => {
    // Set cookie to remember user selected language
    setCookie('NEXT_LOCALE', locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Set cookie to remember user has seen the prompt
    setCookie('LANGUAGE_PROMPT_SEEN', 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Hide the prompt
    setIsVisible(false);
    
    // Redirect to the selected language
    router.push(`/${locale}`);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative max-w-md w-full bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 animate-fade-in">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Please select your preferred language</h2>
          <p className="text-gray-300 mb-6">
            Welcome to my portfolio! Please select your preferred language for the best experience.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {locales.map(locale => {
              const metadata = localeMetadata[locale];
              return (
                <button
                  key={locale}
                  onClick={() => selectLanguage(locale as Locale)}
                  className="flex items-center justify-center gap-2 p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {metadata.flag}
                  </span>
                  <span className="font-medium text-white">{metadata.name.en}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="bg-gray-900 px-6 py-4 text-center text-xs text-gray-400">
          You can change your language at any time using the language switcher in the top right.
        </div>
      </div>
    </div>
  );
}

// Add some helpful animations
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
`;
