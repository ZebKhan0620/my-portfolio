import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ComparisonResult } from '@/lib/translationValidator';
import { Locale } from '@/config/i18n';

interface MissingTranslationsStats {
  /** Total number of missing keys */
  totalMissing: number;
  
  /** Missing keys by locale */
  byLocale: Record<Locale, number>;
  
  /** Missing keys by namespace */
  byNamespace: Record<string, number>;
  
  /** The full validation results */
  results: Record<Locale, ComparisonResult> | null;
  
  /** Whether validation is still in progress */
  isValidating: boolean;
}

/**
 * Hook that provides real-time information about missing translations
 * This is primarily for development use to help identify and fix missing translations
 * 
 * @returns Object with statistics about missing translations
 * 
 * @example
 * const { totalMissing, byLocale, isValidating } = useTranslationValidator();
 * 
 * if (totalMissing > 0) {
 *   return <MissingTranslationsWarning count={totalMissing} details={byLocale} />;
 * }
 */
export function useTranslationValidator(): MissingTranslationsStats {
  const { validationResults, activeNamespaces, isLoaded } = useLanguage();
  const [stats, setStats] = useState<MissingTranslationsStats>({
    totalMissing: 0,
    byLocale: {} as Record<Locale, number>,
    byNamespace: {} as Record<string, number>,
    results: null,
    isValidating: true
  });
  
  // Process validation results whenever they change
  useEffect(() => {
    if (!validationResults || !isLoaded) {
      return;
    }
    
    // Calculate statistics
    let total = 0;
    const byLocale: Record<string, number> = {};
    
    // Count missing keys by locale
    Object.entries(validationResults).forEach(([locale, result]) => {
      const missingCount = result.missingKeys.length;
      byLocale[locale] = missingCount;
      total += missingCount;
    });
    
    // We don't have namespace-specific validation yet
    // This is a placeholder for when we implement more detailed validation
    const byNamespace: Record<string, number> = {};
    activeNamespaces.forEach(ns => {
      byNamespace[ns] = 0;
    });
    
    setStats({
      totalMissing: total,
      byLocale: byLocale as Record<Locale, number>,
      byNamespace,
      results: validationResults,
      isValidating: false
    });
  }, [validationResults, activeNamespaces, isLoaded]);
  
  return stats;
}

export default useTranslationValidator; 