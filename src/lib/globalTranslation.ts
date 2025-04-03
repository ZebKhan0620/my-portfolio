/**
 * Provides a global translation system that can be used outside of React components
 * 
 * This is useful for error messages, logging, and other utilities
 * that don't have access to the React context
 */

import { Locale, defaultLocale } from '@/config/i18n';
import { createLogger } from './logging';

const logger = createLogger('globalTranslation');

// Store the current locale and translations
let currentLocale: Locale = defaultLocale;
let translations: Record<string, any> = {};

/**
 * Connect the language context to the global translation system
 * @param locale The current locale
 * @param currentTranslations The current translations
 */
export function connectLanguageContext(
  locale: Locale, 
  currentTranslations: Record<string, any>
): void {
  currentLocale = locale;
  translations = currentTranslations;
}

/**
 * Get the current globally available locale
 */
export function getGlobalLocale(): Locale {
  return currentLocale;
}

/**
 * Helper function to get nested properties
 */
function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  const value = path.split('.').reduce((prev, curr) => {
    return prev && typeof prev === 'object' ? prev[curr] : undefined;
  }, obj);
  
  return typeof value === 'string' ? value : undefined;
}

/**
 * Translate a key using the global translations
 * @param key The translation key to use
 * @param params Optional parameters to substitute in the translation
 * @returns The translated string, or the key if not found
 */
export function t(key: string, params?: Record<string, string | number>): string {
  // Get the translation value
  let text = getNestedValue(translations, key);
  
  // Handle missing translations
  if (text === undefined) {
    logger.warn(`Missing translation key: ${key} for locale: ${currentLocale}`);
    text = key;
  } else {
    // Handle parameter replacement
    if (params) {
      text = Object.entries(params).reduce(
        (result, [paramKey, paramValue]) => 
          result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue)),
        text
      );
    }
  }
  
  return text;
}

/**
 * Check if a translation key exists
 * @param key The translation key to check
 * @returns True if the key exists
 */
export function hasTranslation(key: string): boolean {
  return getNestedValue(translations, key) !== undefined;
}

/**
 * Get all available translations
 * @returns The current translations object
 */
export function getAllTranslations(): Record<string, any> {
  return { ...translations };
} 