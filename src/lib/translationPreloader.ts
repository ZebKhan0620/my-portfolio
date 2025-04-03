/**
 * Translation preloader utility
 * This module provides functions to preload translations for locales
 * to improve application performance and user experience.
 */

import { Locale, locales, defaultLocale } from '@/config/i18n';
import { createLogger } from './logging';
import { translationCache } from './translationCache';
import { fetchWithRetry } from './fetchWithRetry';
import { translationOptimizer } from './translationOptimizer';
import { performanceMonitor } from './performance';

const logger = createLogger('translationPreloader');

// List of namespaces available for preloading
export const availableNamespaces = ['common', 'admin', 'errors', 'forms'] as const;
export type Namespace = typeof availableNamespaces[number];

/**
 * Options for preloading translations
 */
interface PreloadOptions {
  /** Whether to optimize the translations before caching (default: true) */
  optimize?: boolean;
  
  /** Whether to track performance metrics (default: true) */
  trackPerformance?: boolean;
  
  /** Cache max age in milliseconds (default: 3600000 = 1 hour) */
  cacheMaxAge?: number;
  
  /** Callback when a locale is loaded */
  onLocaleLoaded?: (locale: Locale, namespace: Namespace) => void;
}

/**
 * Result of a preload operation
 */
interface PreloadResult {
  success: boolean;
  locale: Locale;
  namespace: Namespace;
  error?: Error;
  fromCache?: boolean;
  optimizationStats?: {
    originalSize: number;
    optimizedSize: number;
    savingsPercent: number;
  };
}

/**
 * Preload translations for a specific locale and namespace
 * @param locale Locale to preload
 * @param namespace Namespace to preload (default: 'common')
 * @param options Preload options
 */
export async function preloadTranslations(
  locale: Locale,
  namespace: Namespace = 'common',
  options: PreloadOptions = {}
): Promise<PreloadResult> {
  const {
    optimize = true,
    trackPerformance = true,
    cacheMaxAge,
    onLocaleLoaded
  } = options;
  
  let performanceId: string | undefined;
  
  if (trackPerformance) {
    performanceId = performanceMonitor.startOperation('preloadTranslations', {
      locale,
      namespace
    });
  }
  
  try {
    // Check if translations are already cached
    const cached = translationCache.get(locale, namespace);
    if (cached) {
      logger.debug(`Using cached translations for ${locale}/${namespace}`);
      
      if (trackPerformance && performanceId) {
        performanceMonitor.endOperation(performanceId, {
          status: 'success',
          fromCache: true
        });
      }
      
      if (onLocaleLoaded) {
        onLocaleLoaded(locale, namespace);
      }
      
      return {
        success: true,
        locale,
        namespace,
        fromCache: true
      };
    }
    
    logger.info(`Preloading translations for ${locale}/${namespace}`);
    
    // Fetch the translations
    const url = `/locales/${locale}/${namespace}.json`;
    const translations = await fetchWithRetry<Record<string, any>>(
      url,
      undefined,
      { maxRetries: 1 }
    );
    
    // Optimize if needed
    let finalTranslations = translations;
    let optimizationStats;
    
    if (optimize) {
      const { optimized, stats } = translationOptimizer.optimize(translations);
      finalTranslations = optimized;
      optimizationStats = {
        originalSize: stats.originalSize,
        optimizedSize: stats.optimizedSize,
        savingsPercent: stats.savingsPercent
      };
      
      logger.debug(`Optimized translations for ${locale}/${namespace}`, {
        savingsPercent: stats.savingsPercent.toFixed(2) + '%'
      });
    }
    
    // Store in cache
    translationCache.set(locale, finalTranslations, namespace, cacheMaxAge);
    
    if (onLocaleLoaded) {
      onLocaleLoaded(locale, namespace);
    }
    
    if (trackPerformance && performanceId) {
      performanceMonitor.endOperation(performanceId, {
        status: 'success',
        size: JSON.stringify(finalTranslations).length,
        optimizationStats
      });
    }
    
    return {
      success: true,
      locale,
      namespace,
      optimizationStats
    };
  } catch (error) {
    const typedError = error instanceof Error ? error : new Error(String(error));
    logger.error(`Failed to preload translations for ${locale}/${namespace}`, typedError);
    
    if (trackPerformance && performanceId) {
      performanceMonitor.endOperation(performanceId, {
        status: 'error',
        error: typedError.message
      });
    }
    
    return {
      success: false,
      locale,
      namespace,
      error: typedError
    };
  }
}

/**
 * Preload translations for all available locales
 * @param namespace Namespace to preload (default: 'common')
 * @param options Preload options
 */
export async function preloadAllLocales(
  namespace: Namespace = 'common',
  options: PreloadOptions = {}
): Promise<PreloadResult[]> {
  const results: PreloadResult[] = [];
  
  // Always load the default locale first
  results.push(await preloadTranslations(defaultLocale, namespace, options));
  
  // Then load the rest of the locales in parallel
  const otherLocales = locales.filter(locale => locale !== defaultLocale);
  const otherResults = await Promise.all(
    otherLocales.map(locale => preloadTranslations(locale, namespace, options))
  );
  
  return [...results, ...otherResults];
}

/**
 * Preload all namespaces for a specific locale
 * @param locale Locale to preload namespaces for
 * @param options Preload options
 */
export async function preloadAllNamespaces(
  locale: Locale,
  options: PreloadOptions = {}
): Promise<PreloadResult[]> {
  // Load the common namespace first (synchronously)
  const results: PreloadResult[] = [];
  results.push(await preloadTranslations(locale, 'common', options));
  
  // Then load the rest in parallel
  const otherNamespaces = availableNamespaces.filter(ns => ns !== 'common');
  const otherResults = await Promise.all(
    otherNamespaces.map(namespace => 
      preloadTranslations(locale, namespace, options)
    )
  );
  
  return [...results, ...otherResults];
} 