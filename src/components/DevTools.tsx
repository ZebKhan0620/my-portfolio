'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales, Locale } from '@/config/i18n';
import { translationCache } from '@/lib/translationCache';
import { translationOptimizer } from '@/lib/translationOptimizer';
import { performanceMonitor } from '@/lib/performance';
import { availableNamespaces, Namespace } from '@/lib/translationPreloader';
import MissingTranslationsWarning from './dev/MissingTranslationsWarning';
import TranslationDebugger from './dev/TranslationDebugger';
import I18nHelperDemo from './dev/I18nHelperDemo';
import DevOnly from './dev/DevOnly';

// Only show in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Type definitions for the cache stats
interface CacheEntry {
  locale: string;
  namespace: string;
  expires: Date;
}

// Type definition for performance data entry
interface PerformanceDataEntry {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface DevToolsProps {
  show?: boolean;
}

function DevTools({ show = false }: DevToolsProps) {
  const { locale, translations, validationResults, error } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'i18n' | 'performance'>('i18n');
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([]);
  const [showMissingTranslations, setShowMissingTranslations] = useState(false);
  const [debugTranslationKey, setDebugTranslationKey] = useState('');
  
  // Only show if forced via show prop
  if (!show && process.env.NODE_ENV !== 'development') return null;
  
  // Refresh stats every 2 seconds when open
  useEffect(() => {
    if (!isOpen) return;
    
    const getStats = () => {
      setCacheStats(translationCache.getStats());
      setPerformanceStats(performanceMonitor.getStatistics());
      setPerformanceMetrics(performanceMonitor.getAllMetrics());
    };
    
    getStats(); // Get stats immediately
    
    const interval = setInterval(getStats, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);
  
  const togglePanel = () => setIsOpen(!isOpen);
  
  const handleTabChange = (tab: 'i18n' | 'performance') => {
    setActiveTab(tab);
  };
  
  const styles = {
    container: `
      fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg
      shadow-lg text-white z-50 transition-all duration-300 ease-in-out
      ${isOpen ? 'w-96 h-96' : 'w-10 h-10'}
      overflow-hidden
    `,
    header: `
      flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700
    `,
    toggleButton: `
      w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center
      cursor-pointer transition-colors
    `,
    contentArea: `
      p-4 overflow-auto h-[calc(100%-3rem)]
    `,
    tabButton: (active: boolean) => `
      px-3 py-1 text-sm font-medium rounded-md mr-2
      ${active ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
    `,
  };
  
  return (
    <div className={styles.container}>
      {isOpen ? (
        <>
          <div className={styles.header}>
            <div className="flex items-center space-x-2">
              <button 
                className={styles.tabButton(activeTab === 'i18n')}
                onClick={() => handleTabChange('i18n')}
              >
                i18n
              </button>
              <button 
                className={styles.tabButton(activeTab === 'performance')}
                onClick={() => handleTabChange('performance')}
              >
                Perf
              </button>
            </div>
            <div className={styles.toggleButton} onClick={togglePanel}>×</div>
          </div>
          <div className={styles.contentArea}>
            {activeTab === 'i18n' && (
              <div>
                {error && (
                  <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-lg">
                    <div className="font-bold text-red-400">Error:</div>
                    <div className="text-sm">{error}</div>
                  </div>
                )}
                
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                  <div className="font-bold mr-1">Current Locale:</div>
                  <div className="bg-gray-900 px-2 py-1 rounded text-emerald-400">{locale}</div>
                  
                  <div className="font-bold mx-2">Active Namespaces:</div>
                  <div className="flex flex-wrap gap-1">
                    {useLanguage().activeNamespaces.map(ns => (
                      <span key={ns} className="bg-gray-900 px-2 py-1 rounded text-emerald-400">
                        {ns}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="font-bold mb-2">Load Namespace:</div>
                  <div className="flex flex-wrap gap-2">
                    {availableNamespaces.map(ns => (
                      <button
                        key={ns}
                        onClick={() => useLanguage().loadNamespace(ns)}
                        className={`px-3 py-1.5 rounded text-sm ${
                          useLanguage().activeNamespaces.includes(ns)
                            ? 'bg-emerald-900 text-emerald-100 cursor-default'
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                        disabled={useLanguage().activeNamespaces.includes(ns)}
                      >
                        {ns}
                      </button>
                    ))}
                  </div>
                </div>
                
                {validationResults && (
                  <div className="mb-4">
                    <div className="font-bold mb-2">Validation Results:</div>
                    <div className="grid gap-2">
                      {locales.map((loc) => {
                        const result = validationResults[loc as Locale];
                        
                        if (!result) return null;
                        
                        return (
                          <div 
                            key={loc} 
                            className={`p-2 rounded-lg ${
                              result.isValid 
                                ? 'bg-emerald-900/30 border border-emerald-800/50' 
                                : 'bg-red-900/30 border border-red-800/50'
                            }`}
                          >
                            <div className="flex justify-between">
                              <span>{loc}</span>
                              <span>
                                {result.isValid ? '✅ Valid' : '❌ Invalid'}
                              </span>
                            </div>
                            
                            {!result.isValid && (
                              <div className="mt-2 text-sm">
                                {result.missingKeys.length > 0 && (
                                  <div>
                                    <div className="text-red-400">
                                      Missing keys ({result.missingKeys.length}):
                                    </div>
                                    <ul className="list-disc pl-4 mt-1 text-gray-300">
                                      {result.missingKeys.slice(0, 5).map((key) => (
                                        <li key={key}>{key}</li>
                                      ))}
                                      {result.missingKeys.length > 5 && (
                                        <li>...and {result.missingKeys.length - 5} more</li>
                                      )}
                                    </ul>
                                  </div>
                                )}
                                
                                {result.extraKeys.length > 0 && (
                                  <div className="mt-2">
                                    <div className="text-yellow-400">
                                      Extra keys ({result.extraKeys.length}):
                                    </div>
                                    <ul className="list-disc pl-4 mt-1 text-gray-300">
                                      {result.extraKeys.slice(0, 5).map((key) => (
                                        <li key={key}>{key}</li>
                                      ))}
                                      {result.extraKeys.length > 5 && (
                                        <li>...and {result.extraKeys.length - 5} more</li>
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="font-bold mb-2">Current Translations:</div>
                  <pre className="bg-gray-900 p-3 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(translations, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {activeTab === 'performance' && (
              <div>
                <h3 className="font-bold mb-3">Performance Monitoring</h3>
                <div className="space-y-6">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-emerald-400 font-medium mb-2">Operation Statistics</h4>
                    {performanceStats && Object.keys(performanceStats).length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-400 border-b border-gray-700">
                              <th className="pb-2 pr-6">Operation</th>
                              <th className="pb-2 pr-6">Count</th>
                              <th className="pb-2 pr-6">Avg (ms)</th>
                              <th className="pb-2 pr-6">Min (ms)</th>
                              <th className="pb-2 pr-6">Max (ms)</th>
                              <th className="pb-2">Total (ms)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(performanceStats).map(([operation, stats]: [string, any]) => (
                              <tr key={operation} className="border-b border-gray-800">
                                <td className="py-2 pr-6">{operation}</td>
                                <td className="py-2 pr-6">{stats.count}</td>
                                <td className="py-2 pr-6">{stats.averageDuration.toFixed(2)}</td>
                                <td className="py-2 pr-6">{stats.minDuration.toFixed(2)}</td>
                                <td className="py-2 pr-6">{stats.maxDuration.toFixed(2)}</td>
                                <td className="py-2">{stats.totalDuration.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-gray-400">No operations recorded yet</div>
                    )}
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-emerald-400 font-medium mb-2">Recent Operations</h4>
                    {performanceMetrics && performanceMetrics.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-400 border-b border-gray-700">
                              <th className="pb-2 pr-6">Operation</th>
                              <th className="pb-2 pr-6">Duration (ms)</th>
                              <th className="pb-2">Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {performanceMetrics.slice(-20).reverse().map((metric, idx) => (
                              <tr key={idx} className="border-b border-gray-800">
                                <td className="py-2 pr-6">{metric.operation}</td>
                                <td className="py-2 pr-6">
                                  {metric.duration ? metric.duration.toFixed(2) : 'Pending'}
                                </td>
                                <td className="py-2">
                                  {metric.metadata ? (
                                    <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                                      {JSON.stringify(metric.metadata, null, 2)}
                                    </pre>
                                  ) : 'No metadata'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-gray-400">No operations recorded yet</div>
                    )}
                  </div>
                  
                  <div>
                    <button
                      onClick={() => performanceMonitor.clearMetrics()}
                      className="bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded"
                    >
                      Clear Performance Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {isDevelopment && !isOpen && (
            <div className="w-full h-full flex items-center justify-center cursor-pointer" onClick={togglePanel}>
              <span className="text-xs">DEV</span>
            </div>
          )}
          {isDevelopment && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          )}
        </>
      )}
    </div>
  );
}

// Export the component wrapped in DevOnly
export default function DevToolsWrapper(props: DevToolsProps) {
  return (
    <DevOnly>
      <DevTools {...props} />
    </DevOnly>
  );
} 