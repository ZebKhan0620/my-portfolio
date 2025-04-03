/**
 * Hook for lazy loading translations that aren't part of the core translations
 * This is useful for components that have a lot of text but aren't critical
 * to the initial render, such as modals, detailed descriptions, etc.
 */

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Locale, defaultLocale } from '@/config/i18n';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import { translationOptimizer } from '@/lib/translationOptimizer';
import { createLogger } from '@/lib/logging';
import { performanceMonitor } from '@/lib/performance';

const logger = createLogger('useLazyTranslation');

// Cache for lazy loaded translations to avoid redundant fetches
const lazyCache = new Map<string, Record<string, any>>();

interface UseLazyTranslationOptions {
  namespace: string;
  fallback?: Record<string, string>;
  onError?: (error: Error) => void;
}

interface UseLazyTranslationResult {
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoaded: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

/**
 * Hook for lazily loading additional translations
 * @param options Configuration options 
 * @returns Translation function and loading state
 */
export function useLazyTranslation(
  options: UseLazyTranslationOptions
): UseLazyTranslationResult {
  const { locale, t: globalT } = useLanguage();
  const [translations, setTranslations] = useState<Record<string, any>>(options.fallback || {});
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const cacheKey = `${locale}:${options.namespace}`;
  
  // Load translations for the given namespace
  const loadTranslations = useCallback(async () => {
    // Check cache first
    if (lazyCache.has(cacheKey)) {
      setTranslations(lazyCache.get(cacheKey) || {});
      setIsLoaded(true);
      return;
    }
    
    // Start performance tracking
    const perfId = performanceMonitor.startOperation('loadLazyTranslations', { 
      locale,
      namespace: options.namespace
    });
    
    try {
      setIsLoaded(false);
      setError(null);
      
      const url = `/locales/${locale}/${options.namespace}.json`;
      logger.debug(`Loading lazy translations for ${options.namespace} in ${locale}`);
      
      try {
        const data = await fetchWithRetry<Record<string, any>>(url, undefined, {
          maxRetries: 1
        });
        
        // Optimize the translations
        const { optimized } = translationOptimizer.optimize(data);
        
        // Store in cache and state
        lazyCache.set(cacheKey, optimized);
        setTranslations(optimized);
        setIsLoaded(true);
        
        performanceMonitor.endOperation(perfId, {
          status: 'success',
          size: JSON.stringify(optimized).length
        });
      } catch (loadError) {
        // If the current locale isn't the default, try to load the default locale
        if (locale !== defaultLocale) {
          logger.debug(`Attempting to load fallback translations for ${options.namespace}`);
          
          try {
            const fallbackUrl = `/locales/${defaultLocale}/${options.namespace}.json`;
            const fallbackData = await fetchWithRetry<Record<string, any>>(fallbackUrl, undefined, {
              maxRetries: 1
            });
            
            // Optimize the translations
            const { optimized } = translationOptimizer.optimize(fallbackData);
            
            // Store in cache and state
            lazyCache.set(cacheKey, optimized);
            setTranslations(optimized);
            setIsLoaded(true);
            
            const fallbackError = new Error(
              `Using fallback translations for ${options.namespace}. Original error: ${
                loadError instanceof Error ? loadError.message : String(loadError)
              }`
            );
            setError(fallbackError);
            if (options.onError) options.onError(fallbackError);
            
            performanceMonitor.endOperation(perfId, {
              status: 'fallback-success',
              size: JSON.stringify(optimized).length
            });
          } catch (fallbackError) {
            logger.error(`Failed to load fallback translations for ${options.namespace}`, fallbackError);
            const combinedError = new Error(
              `Failed to load translations for ${options.namespace} in ${locale} and fallback ${defaultLocale}`
            );
            setError(combinedError);
            if (options.onError) options.onError(combinedError);
            performanceMonitor.endOperation(perfId, { status: 'error' });
          }
        } else {
          logger.error(`Failed to load translations for ${options.namespace}`, loadError);
          const newError = new Error(
            `Failed to load translations for ${options.namespace} in ${locale}`
          );
          setError(newError);
          if (options.onError) options.onError(newError);
          performanceMonitor.endOperation(perfId, { status: 'error' });
        }
      }
    } catch (error) {
      logger.error(`Unexpected error loading lazy translations`, error);
      const newError = error instanceof Error ? error : new Error(String(error));
      setError(newError);
      if (options.onError) options.onError(newError);
      performanceMonitor.endOperation(perfId, { status: 'error' });
    } finally {
      setIsLoaded(true);
    }
  }, [locale, options.namespace, options.onError, cacheKey]);
  
  // Load translations when the locale or namespace changes
  useEffect(() => {
    loadTranslations();
  }, [loadTranslations]);
  
  // Translation function that uses the lazy loaded translations
  // Falls back to global translations if not found
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      // Helper to get nested properties
      const getNestedValue = (obj: Record<string, any>, path: string): string | undefined => {
        const value = path.split('.').reduce((prev, curr) => {
          return prev && typeof prev === 'object' ? prev[curr] : undefined;
        }, obj as any);
        
        return typeof value === 'string' ? value : undefined;
      };
      
      // Try to get from lazy loaded translations first
      const localValue = getNestedValue(translations, key);
      
      if (localValue !== undefined) {
        // Handle parameter replacement
        if (params) {
          return Object.entries(params).reduce(
            (result, [paramKey, paramValue]) => 
              result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue)),
            localValue
          );
        }
        return localValue;
      }
      
      // Fall back to global translations
      return globalT(key, params);
    },
    [translations, globalT]
  );
  
  return {
    t,
    isLoaded,
    error,
    reload: loadTranslations
  };
} 