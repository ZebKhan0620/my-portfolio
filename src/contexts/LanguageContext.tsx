'use client';

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { formatLocalePathname, getLocaleFromCookie } from '@/lib/i18n';
import { setCookie, getCookie } from 'cookies-next';
import { locales, Locale, defaultLocale } from '@/config/i18n';
import { createLogger } from '@/lib/logging';
import { validateTranslations, ComparisonResult } from '@/lib/translationValidator';
import { translationCache } from '@/lib/translationCache';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { performanceMonitor } from '@/lib/performance';
import { translationOptimizer } from '@/lib/translationOptimizer';
import { connectLanguageContext } from '@/lib/globalTranslation';
import { availableNamespaces, Namespace } from '@/lib/translationPreloader';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorNotification from '@/components/ErrorNotification';

// Create a logger for the language context
const logger = createLogger('LanguageContext');

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Define types for the context
interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: Record<string, any>;
  isLoaded: boolean;
  error: string | null;
  validationResults: Record<Locale, ComparisonResult> | null;
  loadNamespace: (namespace: Namespace) => Promise<boolean>;
  activeNamespaces: Namespace[];
}

// Create context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested properties
const getNestedValue = (obj: Record<string, any>, path: string): string | undefined => {
  const value = path.split('.').reduce((prev, curr) => {
    return prev && typeof prev === 'object' ? prev[curr] : undefined;
  }, obj);
  
  return typeof value === 'string' ? value : undefined;
};

// Get preferred locale from client-side cookie
function getClientPreferredLocale(): Locale {
  const cookieLocale = getCookie('NEXT_LOCALE');
  
  return getLocaleFromCookie();
}

interface LanguageProviderProps {
  children: ReactNode;
  locale: Locale;
  initialTranslations?: Record<string, any>;
  initialNamespaces?: Namespace[];
}

export function LanguageProvider({ 
  children, 
  locale,
  initialTranslations = {},
  initialNamespaces = ['common']
}: LanguageProviderProps) {
  const params = useParams();
  const urlLocale = params?.locale as Locale;
  const router = useRouter();
  const pathname = usePathname();
  
  // Initialize with the prop locale or URL locale from params
  const [localeState, setLocaleState] = useState<Locale>(urlLocale || locale);
  const [translations, setTranslations] = useState<Record<string, any>>(initialTranslations);
  const [isLoaded, setIsLoaded] = useState(Object.keys(initialTranslations).length > 0);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(false);
  const [validationResults, setValidationResults] = useState<Record<Locale, ComparisonResult> | null>(null);
  const [activeNamespaces, setActiveNamespaces] = useState<Namespace[]>(initialNamespaces);
  const [namespaceData, setNamespaceData] = useState<Record<Namespace, Record<string, any>>>({
    common: initialTranslations
  } as Record<Namespace, Record<string, any>>);
  
  // Validate translations on initial load
  useEffect(() => {
    const runValidation = async () => {
      // Skip validation in production to save resources
      if (process.env.NODE_ENV !== 'development') return;
      
      try {
        logger.debug('Validating translations');
        const results = await validateTranslations();
        setValidationResults(results);
        
        // Log a summary of validation results
        const invalidLocales = Object.entries(results)
          .filter(([_, result]) => !result.isValid)
          .map(([locale]) => locale);
        
        if (invalidLocales.length > 0) {
          logger.warn(`Translation validation failed for: ${invalidLocales.join(', ')}`);
        } else {
          logger.info('All translations are valid');
        }
      } catch (error) {
        logger.error('Translation validation failed', error);
      }
    };
    
    runValidation();
  }, []);
  
  // Load translations for the current locale if they change
  useEffect(() => {
    if (urlLocale && urlLocale !== localeState) {
      setLocaleState(urlLocale);
    }
  }, [localeState, urlLocale]);
  
  // Combine all active namespace data into a single translations object
  useEffect(() => {
    // Merge all namespace data into a single object
    const mergedTranslations = activeNamespaces.reduce((merged, namespace) => {
      if (namespaceData[namespace]) {
        return { ...merged, ...namespaceData[namespace] };
      }
      return merged;
    }, {});
    
    setTranslations(mergedTranslations);
    
    // Connect to global translation system when translations are available
    if (Object.keys(mergedTranslations).length > 0) {
      connectLanguageContext(localeState, mergedTranslations);
    }
  }, [namespaceData, activeNamespaces, localeState]);
  
  // Update translations when locale changes
  useEffect(() => {
    // Reset the namespace data when locale changes
    setNamespaceData({} as Record<Namespace, Record<string, any>>);
    
    // Load the common namespace by default
    loadNamespaceInternal('common');
  }, [localeState]);
  
  // Function to load a specific namespace
  const loadNamespaceInternal = async (namespace: Namespace): Promise<boolean> => {
    // Start performance tracking
    const perfId = performanceMonitor.startOperation('loadNamespace', { 
      locale: localeState, 
      namespace 
    });
    
    try {
      // Check cache first
      const cachedTranslations = translationCache.get(localeState, namespace);
      if (cachedTranslations) {
        logger.debug(`Using cached translations for ${localeState}/${namespace}`);
        
        // Update namespace data
        setNamespaceData(prev => ({
          ...prev,
          [namespace]: cachedTranslations
        }));
        
        // Add to active namespaces if not already there
        setActiveNamespaces(prev => 
          prev.includes(namespace) ? prev : [...prev, namespace]
        );
        
        // End performance tracking with cache hit result
        performanceMonitor.endOperation(perfId, { 
          source: 'cache',
          status: 'success'
        });
        
        return true;
      }
      
      // First try to load the requested namespace with retry mechanism
      logger.debug(`Loading ${namespace} translations for ${localeState}`);
      
      const translationUrl = `/locales/${localeState}/${namespace}.json`;
      const fetchStartTime = performance.now();
      const data = await fetchWithRetry<Record<string, any>>(translationUrl, undefined, {
        maxRetries: 2,
        onRetry: (attempt) => {
          logger.info(`Retry ${attempt} loading ${namespace} translations for ${localeState}`);
        }
      });
      const fetchEndTime = performance.now();
      
      // Optimize translations to reduce memory usage
      const optimizationStartTime = performance.now();
      const { optimized, stats } = translationOptimizer.optimize(data);
      const optimizationEndTime = performance.now();
      
      logger.debug(`Optimized ${namespace} translations for ${localeState}`, {
        savingsPercent: stats.savingsPercent.toFixed(2) + '%',
        originalSize: stats.originalSize,
        optimizedSize: stats.optimizedSize,
        optimizationTime: (optimizationEndTime - optimizationStartTime).toFixed(2) + 'ms'
      });
      
      // Store optimized translations in cache
      translationCache.set(localeState, optimized, namespace);
      
      // Update namespace data
      setNamespaceData(prev => ({
        ...prev,
        [namespace]: optimized
      }));
      
      // Add to active namespaces if not already there
      setActiveNamespaces(prev => 
        prev.includes(namespace) ? prev : [...prev, namespace]
      );
      
      // End performance tracking with success result
      performanceMonitor.endOperation(perfId, { 
        source: 'network',
        status: 'success',
        size: stats.optimizedSize,
        fetchTime: fetchEndTime - fetchStartTime,
        optimizationTime: optimizationEndTime - optimizationStartTime,
        optimizationSavings: stats.savingsPercent
      });
      
      return true;
    } catch (error) {
      logger.error(`Error loading ${namespace} translations for ${localeState}`, error);
      
      // End performance tracking with error result
      performanceMonitor.endOperation(perfId, { 
        source: 'network',
        status: 'error',
        error: error instanceof Error ? error.message : String(error)
      });
      
      return false;
    }
  };
  
  // Exposed method to load a namespace
  const loadNamespace = useCallback(async (namespace: Namespace): Promise<boolean> => {
    return loadNamespaceInternal(namespace);
  }, [localeState]);
  
  // Update locale and navigate to the new locale path
  const setLocale = useCallback((newLocale: Locale) => {
    if (newLocale === localeState) return;
    
    // Update the cookie with more persistent settings
    setCookie('NEXT_LOCALE', newLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year instead of 1 week
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    });
    
    // Log the locale change
    logger.info(`Changed locale from ${localeState} to ${newLocale}`);
    
    // Navigate to the new locale version of the current path
    const newPath = formatLocalePathname(pathname, newLocale);
    router.push(newPath);
    
    // Update state
    setLocaleState(newLocale);
    setNamespaceData({} as Record<Namespace, Record<string, any>>); // Reset translations to trigger reload
    setActiveNamespaces(['common']); // Reset to just the common namespace
  }, [localeState, pathname, router]);
  
  // Translation function with memoization for repeated keys
  const keyMemoizationCache = useMemo(() => new Map<string, string>(), [localeState]);
  
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    // Check cache first for keys without params
    if (!params && keyMemoizationCache.has(key)) {
      return keyMemoizationCache.get(key) as string;
    }
    
    // Get the translation value
    let text = getNestedValue(translations, key);
    
    // Handle missing translations
    if (text === undefined) {
      // Log missing translation in development
      if (isDevelopment) {
        logger.warn(`Missing translation key: ${key} for locale: ${localeState}`);
        // In development, show a visual marker around missing translations
        text = `⚠️ ${key} ⚠️`;
      } else {
        // In production, use the key as fallback
        text = key;
      }
    } else {
      // Handle parameter replacement
      if (params) {
        text = Object.entries(params).reduce(
          (result, [paramKey, paramValue]) => 
            result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue)),
          text
        );
      }
      
      // Cache the result for pure translations (without params)
      if (!params) {
        keyMemoizationCache.set(key, text);
      }
    }
    
    return text;
  }, [translations, keyMemoizationCache, localeState]);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo<LanguageContextType>(() => ({
    locale: localeState,
    setLocale,
    t,
    translations,
    isLoaded,
    error,
    validationResults,
    loadNamespace,
    activeNamespaces
  }), [
    localeState, 
    setLocale, 
    t, 
    translations, 
    isLoaded, 
    error, 
    validationResults, 
    loadNamespace,
    activeNamespaces
  ]);
  
  // Check if common namespace is loaded
  const isCommonLoaded = Boolean(namespaceData.common);
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {!isCommonLoaded ? (
        <>
          <LoadingIndicator 
            size="medium" 
            message={`Loading ${localeState} translations...`}
          />
          <div className="invisible">{children}</div>
        </>
      ) : (
        <>
          {error && (
            <ErrorNotification 
              message={error} 
              severity="warning" 
              timeout={10000}
              onDismiss={() => setError(null)}
            />
          )}
          {children}
        </>
      )}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 