 'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales, Locale } from '@/config/i18n';
import { createLogger } from '@/lib/logging';

const logger = createLogger('TranslationDebugger');

interface TranslationDebuggerProps {
  initialKey?: string;
}

export default function TranslationDebugger({ initialKey = '' }: TranslationDebuggerProps) {
  const { locale, translations, activeNamespaces, t } = useLanguage();
  const [key, setKey] = useState(initialKey);
  const [keyPath, setKeyPath] = useState<string[]>([]);
  const [results, setResults] = useState<Record<Locale, { value: any; exists: boolean }>>({} as any);
  const [isExpanded, setIsExpanded] = useState(true);
  
  useEffect(() => {
    if (!key) {
      setResults({} as any);
      setKeyPath([]);
      return;
    }
    
    // Split the key by dots to navigate the nested structure
    const path = key.split('.');
    setKeyPath(path);
    
    // Check the value across all locales
    const newResults: Record<Locale, { value: any; exists: boolean }> = {} as any;
    
    locales.forEach((loc) => {
      try {
        // Get the value for this locale using the t function
        const value = t(key);
        
        // Determine if the key exists (not just returning the key itself)
        const exists = value !== key;
        
        newResults[loc as Locale] = {
          value,
          exists
        };
      } catch (error) {
        logger.error(`Error getting translation for ${loc}.${key}:`, error);
        newResults[loc as Locale] = {
          value: `Error: ${error instanceof Error ? error.message : String(error)}`,
          exists: false
        };
      }
    });
    
    setResults(newResults);
  }, [key, locale, t]);
  
  return (
    <div className="w-full">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-white p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">Enter a Translation Key</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white"
            >
              {isExpanded ? '▼' : '▲'}
            </button>
            <button
              onClick={() => setKey('')}
              className="text-gray-400 hover:text-white"
              title="Clear"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="translationKey" className="block text-sm mb-1">
            Translation Key:
          </label>
          <input
            id="translationKey"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="common.buttons.submit"
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
          />
        </div>
        
        {key && (
          <div className="mb-3">
            <div className="text-sm text-gray-400 mb-1">Active Namespaces:</div>
            <div className="flex flex-wrap gap-1">
              {activeNamespaces.map((ns) => (
                <span key={ns} className="bg-gray-700 text-xs px-2 py-1 rounded">
                  {ns}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {key && keyPath.length > 0 && isExpanded && (
          <>
            <div className="mb-3">
              <div className="text-sm text-gray-400 mb-1">Key Path:</div>
              <div className="flex items-center space-x-1">
                {keyPath.map((part, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <span className="text-gray-500">.</span>}
                    <span className="bg-gray-700 text-xs px-2 py-1 rounded">
                      {part}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">Values by Locale:</div>
              <div className="bg-gray-900 rounded-lg p-3 max-h-60 overflow-y-auto">
                {Object.entries(results).map(([loc, result]) => (
                  <div key={loc} className="mb-2 last:mb-0">
                    <div className="flex items-center gap-2">
                      <span 
                        className={`font-medium ${
                          loc === locale ? 'text-emerald-400' : 'text-white'
                        }`}
                      >
                        {loc}:
                      </span>
                      <span 
                        className={`text-sm px-2 py-0.5 rounded ${
                          result.exists 
                            ? 'bg-emerald-900/50 text-emerald-100' 
                            : 'bg-red-900/50 text-red-100'
                        }`}
                      >
                        {result.exists ? 'Found' : 'Missing'}
                      </span>
                    </div>
                    <div className="pl-4 mt-1 text-sm">
                      {typeof result.value === 'object' 
                        ? <pre>{JSON.stringify(result.value, null, 2)}</pre>
                        : <span>{String(result.value)}</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {key && !isExpanded && (
          <div className="text-center text-gray-400 text-sm">
            Click ▲ to expand and see detailed results
          </div>
        )}
      </div>
    </div>
  );
}