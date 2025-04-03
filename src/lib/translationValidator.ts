import { locales, defaultLocale, Locale } from '@/config/i18n';
import { createLogger } from './logging';

const logger = createLogger('translationValidator');

/**
 * Comparison result between two translation objects
 */
export interface ComparisonResult {
  missingKeys: string[];
  extraKeys: string[];
  isValid: boolean;
}

/**
 * Recursively finds all keys in an object using dot notation
 */
function getAllKeys(obj: Record<string, any>, prefix = ''): string[] {
  return Object.keys(obj).reduce<string[]>((acc, key) => {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      return [...acc, ...getAllKeys(obj[key], newPrefix)];
    }
    
    return [...acc, newPrefix];
  }, []);
}

/**
 * Compare translations against the default locale to find missing keys
 */
export function compareTranslations(
  reference: Record<string, any>,
  target: Record<string, any>
): ComparisonResult {
  const referenceKeys = getAllKeys(reference).sort();
  const targetKeys = getAllKeys(target).sort();
  
  const missingKeys = referenceKeys.filter(key => !targetKeys.includes(key));
  const extraKeys = targetKeys.filter(key => !referenceKeys.includes(key));
  
  return {
    missingKeys,
    extraKeys,
    isValid: missingKeys.length === 0 && extraKeys.length === 0
  };
}

/**
 * Validate all translation files against the default locale
 * Returns a mapping of locale to validation results
 */
export async function validateTranslations(): Promise<Record<Locale, ComparisonResult>> {
  try {
    // Load the default locale translations as reference
    const defaultTranslations = await import(`../../public/locales/${defaultLocale}/common.json`)
      .then(module => module.default || module);
    
    // Check each non-default locale
    const results: Partial<Record<Locale, ComparisonResult>> = {};
    
    for (const locale of locales) {
      // Skip the default locale
      if (locale === defaultLocale) {
        results[locale] = {
          missingKeys: [],
          extraKeys: [],
          isValid: true
        };
        continue;
      }
      
      try {
        // Load translations for this locale
        const translations = await import(`../../public/locales/${locale}/common.json`)
          .then(module => module.default || module);
        
        // Compare with default
        const result = compareTranslations(defaultTranslations, translations);
        
        // Log issues in development
        if (!result.isValid && process.env.NODE_ENV === 'development') {
          if (result.missingKeys.length > 0) {
            logger.warn(`Missing translation keys in ${locale}:`, result.missingKeys);
          }
          
          if (result.extraKeys.length > 0) {
            logger.warn(`Extra translation keys in ${locale}:`, result.extraKeys);
          }
        }
        
        results[locale] = result;
      } catch (error) {
        logger.error(`Failed to validate translations for ${locale}:`, error);
        results[locale] = {
          missingKeys: ['Failed to load translation file'],
          extraKeys: [],
          isValid: false
        };
      }
    }
    
    return results as Record<Locale, ComparisonResult>;
  } catch (error) {
    logger.error('Failed to validate translations:', error);
    
    // Return an empty result for all locales
    return locales.reduce((result, locale) => {
      result[locale] = {
        missingKeys: ['Failed to load default translation file'],
        extraKeys: [],
        isValid: false
      };
      return result;
    }, {} as Record<Locale, ComparisonResult>);
  }
} 