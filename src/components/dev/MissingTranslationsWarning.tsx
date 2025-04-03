'use client';
/**
 * A development-only component that displays warnings for missing translations
 * This is helpful for developers to identify and fix missing translations
 */

import React, { useState } from 'react';
import { useTranslationValidator } from '@/hooks/useTranslationValidator';
import { Locale } from '@/config/i18n';

interface MissingTranslationsWarningProps {
  /** Whether to initially show the detailed view */
  initiallyExpanded?: boolean;
}

export default function MissingTranslationsWarning({ initiallyExpanded = false }: MissingTranslationsWarningProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const { totalMissing, byLocale, results, isValidating } = useTranslationValidator();
  
  // Don't render anything if there are no missing translations or if we're still validating
  if ((totalMissing === 0 && !isValidating) || process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  // Get locales with missing translations
  const localesWithMissing = Object.entries(byLocale)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]); // Sort by count, descending
  
  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-red-900/95 backdrop-blur-md border border-red-700/50 text-white rounded-md shadow-xl">
      <div className="flex items-center justify-between p-3 border-b border-red-800/60">
        <h3 className="font-semibold text-base flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {isValidating ? 'Validating translations...' : `${totalMissing} Missing Translations`}
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-red-800/50 rounded-md transition-colors"
          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {isExpanded && !isValidating && (
        <div className="p-3 text-sm max-h-80 overflow-y-auto">
          {localesWithMissing.length > 0 ? (
            <>
              <div className="mb-2 font-medium text-gray-200">Missing by locale:</div>
              
              <div className="space-y-3">
                {localesWithMissing.map(([locale, count]) => (
                  <div key={locale} className="border-l-2 border-red-700 pl-3">
                    <div className="flex items-center justify-between text-gray-200">
                      <span className="font-medium">{locale}:</span>
                      <span className="text-red-400">{count} missing</span>
                    </div>
                    
                    {results && results[locale as Locale]?.missingKeys.length > 0 && (
                      <div className="mt-1 text-xs text-gray-300">
                        <div className="mb-1">Missing keys:</div>
                        <ul className="ml-2 space-y-1">
                          {results[locale as Locale].missingKeys.slice(0, 5).map(key => (
                            <li key={key} className="font-mono text-red-400">
                              {key}
                            </li>
                          ))}
                          
                          {results[locale as Locale].missingKeys.length > 5 && (
                            <li className="text-gray-400">
                              ...and {results[locale as Locale].missingKeys.length - 5} more
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-xs text-gray-400">
                <p>These missing translations are only shown in development mode.</p>
                <p>Add the missing keys to the appropriate translation files.</p>
              </div>
            </>
          ) : (
            <div className="text-gray-300">No missing translations found.</div>
          )}
        </div>
      )}
    </div>
  );
} 