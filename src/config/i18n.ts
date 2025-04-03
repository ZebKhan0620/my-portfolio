/**
 * Internationalization configuration
 * Central location for all i18n-related settings
 */

// Supported locales in the application
export const locales = ['en', 'ja'] as const;

// Define the locale type based on the supported locales
export type Locale = typeof locales[number];

// Text direction types for HTML dir attribute
export type TextDirection = 'ltr' | 'rtl';

// Default locale to use if none is specified
export const defaultLocale = 'en';

/**
 * Direction of text for each locale (ltr or rtl)
 * This will be useful if we add RTL languages like Arabic or Hebrew in the future
 */
export const localeDirections: Record<Locale, TextDirection> = {
  en: 'ltr',
  ja: 'ltr'
};

/**
 * Check if a locale uses RTL (right-to-left) text direction
 */
export function isRTL(locale: Locale): boolean {
  return localeDirections[locale] === 'rtl';
}

/**
 * Get the text direction for a locale
 */
export function getTextDirection(locale: Locale): TextDirection {
  return localeDirections[locale];
}

/**
 * Get RTL CSS class for directional styling
 * This helper adds appropriate classes for RTL content
 */
export function getRTLClass(locale: Locale): string {
  return isRTL(locale) ? 'rtl-content' : '';
}

/**
 * Get all RTL specific styles for a given locale
 * This is useful for conditional styling based on text direction
 */
export function getRTLStyles(locale: Locale): Record<string, string> {
  if (!isRTL(locale)) return {};
  
  return {
    direction: 'rtl',
    textAlign: 'right'
  };
}

// Locale metadata for display purposes
export const localeMetadata: Record<Locale, { 
  flag: string; 
  label: string;
  name: { en: string; ja: string };
}> = {
  en: { 
    flag: '🇺🇸', 
    label: 'EN', 
    name: { en: 'English', ja: '英語' }
  },
  ja: { 
    flag: '🇯🇵', 
    label: 'JA', 
    name: { en: 'Japanese', ja: '日本語' }
  }
}; 