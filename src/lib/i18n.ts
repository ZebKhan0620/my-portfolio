import { Locale, locales, defaultLocale } from '@/config/i18n';
import { getCookie } from 'cookies-next';
import { createLogger } from './logging';

// Create a logger for i18n operations
const logger = createLogger('i18n');

/**
 * Get translations for a specific locale
 * @param locale - The locale to get translations for
 * @returns Translation dictionary
 */
export async function getTranslations(locale: Locale) {
  try {
    // Import the translations dynamically
    const translations = await import(`../../public/locales/${locale}/common.json`);
    return translations.default || translations;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    
    // Fallback to default locale if the requested locale fails
    if (locale !== defaultLocale) {
      try {
        const defaultTranslations = await import(`../../public/locales/${defaultLocale}/common.json`);
        return defaultTranslations.default || defaultTranslations;
      } catch (fallbackError) {
        console.error(`Failed to load fallback translations:`, fallbackError);
      }
    }
    
    // Return an empty object if all loading attempts fail
    return {};
  }
}

/**
 * Validates if a locale is supported by the application
 * @param locale Locale to validate
 * @returns true if the locale is supported, false otherwise
 */
export function isSupportedLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Safely get a valid locale, falling back to the default locale if needed
 * @param locale The locale string to validate
 * @returns A valid locale that is guaranteed to be supported
 */
export function getSafeLocale(locale: string | null | undefined): Locale {
  if (!locale) {
    logger.debug('No locale provided, using default', { defaultLocale });
    return defaultLocale;
  }
  
  if (isSupportedLocale(locale)) {
    return locale;
  }
  
  logger.warn('Unsupported locale requested, using default', { 
    requestedLocale: locale, 
    defaultLocale 
  });
  return defaultLocale;
}

/**
 * Get the user's preferred locale from cookie or default
 */
export function getLocaleFromCookie(): Locale {
  try {
    const cookieLocale = getCookie('NEXT_LOCALE');
    return getSafeLocale(cookieLocale?.toString());
  } catch (error) {
    logger.error('Error getting locale from cookie', error);
    return defaultLocale;
  }
}

/**
 * Format a pathname for a specific locale, taking care of preserving or changing the locale prefix
 * @param pathname Current pathname, potentially with a locale prefix
 * @param locale Target locale to format the pathname for
 * @returns Formatted pathname with the target locale
 */
export function formatLocalePathname(pathname: string, targetLocale: Locale): string {
  const { path, locale: currentLocale } = removeLocalePrefix(pathname);
  
  // If there's no current locale or it's different from the target, we need to format
  if (!currentLocale || currentLocale !== targetLocale) {
    return addLocalePrefix(path, targetLocale);
  }
  
  // If the current locale is already the target locale, just return the original pathname
  return pathname;
}

/**
 * Add a locale prefix to a pathname if it doesn't already have one
 * @param pathname The path to format with locale
 * @param locale The locale to use
 * @returns Pathname with locale prefix
 */
export function addLocalePrefix(pathname: string, locale: Locale = defaultLocale): string {
  // Handle root path specially
  if (pathname === '/') {
    return `/${locale}`;
  }
  
  // If the pathname already has a locale, don't add another
  for (const loc of locales) {
    if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
      return pathname;
    }
  }
  
  // Ensure pathname starts with a slash
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  
  // Add the locale prefix
  return `/${locale}${normalizedPath}`;
}

/**
 * Remove the locale prefix from a pathname
 * @param pathname The path with a potential locale prefix
 * @returns The pathname without the locale prefix and the detected locale
 */
export function removeLocalePrefix(pathname: string): { 
  path: string; 
  locale: Locale | null;
} {
  // Handle the case where pathname is missing or just a slash
  if (!pathname || pathname === '/') {
    return { path: '/', locale: null };
  }
  
  // Split the pathname into segments
  const segments = pathname.split('/');
  
  // The first segment after the initial slash is potentially the locale
  const potentialLocale = segments[1];
  
  // Check if the potential locale is valid
  if (potentialLocale && isSupportedLocale(potentialLocale)) {
    // Remove the locale segment and join the rest
    const pathWithoutLocale = segments.slice(2).join('/');
    return { 
      path: pathWithoutLocale.length > 0 ? `/${pathWithoutLocale}` : '/',
      locale: potentialLocale
    };
  }
  
  // No locale in the pathname
  return { path: pathname, locale: null };
}

/**
 * Format a date according to the given locale
 * @param date The date to format
 * @param locale The locale to use for formatting
 * @param options Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | number,
  locale: Locale = defaultLocale,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  try {
    const formatter = new Intl.DateTimeFormat(
      locale, 
      options || defaultOptions
    );
    
    return formatter.format(date);
  } catch (error) {
    logger.error(`Error formatting date for locale ${locale}`, error);
    // Fallback to ISO string format
    return new Date(date).toISOString().split('T')[0];
  }
}

/**
 * Format a number according to the given locale
 * @param number The number to format
 * @param locale The locale to use for formatting
 * @param options Intl.NumberFormat options
 * @returns Formatted number string
 */
export function formatNumber(
  number: number,
  locale: Locale = defaultLocale,
  options?: Intl.NumberFormatOptions
): string {
  try {
    const formatter = new Intl.NumberFormat(locale, options);
    return formatter.format(number);
  } catch (error) {
    logger.error(`Error formatting number for locale ${locale}`, error);
    // Fallback to standard number format
    return number.toString();
  }
}

/**
 * Format a currency value according to the given locale and currency code
 * @param value The number value to format
 * @param currencyCode The ISO 4217 currency code (e.g., 'USD', 'EUR', 'JPY')
 * @param locale The locale to use for formatting
 * @param options Additional Intl.NumberFormat options
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  currencyCode: string,
  locale: Locale = defaultLocale,
  options?: Intl.NumberFormatOptions
): string {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      ...options
    });
    
    return formatter.format(value);
  } catch (error) {
    logger.error(`Error formatting currency for locale ${locale} and currency ${currencyCode}`, error);
    // Fallback to basic formatting
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}

/**
 * Format a list of items according to the given locale
 * @param items Array of strings to format as a list
 * @param locale The locale to use for formatting
 * @param options Intl.ListFormat options
 * @returns Formatted list string
 * 
 * @example
 * // Returns "Apple, Banana, and Orange" in English
 * formatList(['Apple', 'Banana', 'Orange'], 'en')
 */
export function formatList(
  items: string[],
  locale: Locale = defaultLocale,
  options?: Intl.ListFormatOptions
): string {
  if (items.length === 0) return '';
  
  try {
    const formatter = new Intl.ListFormat(locale, options || {
      style: 'long',
      type: 'conjunction'
    });
    
    return formatter.format(items);
  } catch (error) {
    logger.error(`Error formatting list for locale ${locale}`, error);
    // Fallback to comma-separated list
    return items.join(', ');
  }
}

/**
 * Format a duration in milliseconds according to the given locale
 * @param milliseconds Duration in milliseconds
 * @param locale The locale to use for formatting
 * @param options Additional options for formatting
 * @returns Formatted duration string
 */
export function formatDuration(
  milliseconds: number,
  locale: Locale = defaultLocale,
  options?: {
    format?: ('years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds')[];
    style?: 'long' | 'short' | 'narrow';
    separator?: string;
  }
): string {
  const defaultOptions = {
    format: ['hours', 'minutes', 'seconds'] as const,
    style: 'long' as const,
    separator: ' '
  };
  
  const opts = { ...defaultOptions, ...options };
  
  try {
    // Convert milliseconds to respective time units
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
    const hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)) % 7;
    const weeks = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 7)) % 4;
    const months = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 30)) % 12;
    const years = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 365));
    
    const timeUnits = {
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds
    };
    
    // Filter units based on options.format and non-zero values
    const parts = opts.format
      .filter(unit => timeUnits[unit] > 0 || 
        // Always include the smallest unit if all specified units are zero
        (unit === opts.format[opts.format.length - 1] && 
         opts.format.every(u => timeUnits[u] === 0)))
      .map(unit => {
        const unitValue = timeUnits[unit];
        
        // Use RelativeTimeFormat to get the correct plural form for the unit
        const rtf = new Intl.RelativeTimeFormat(locale, {
          style: opts.style,
          numeric: 'always'
        });
        
        // Get just the unit part without the number or "in" or "ago"
        // by replacing the number with a placeholder and extracting the unit
        const formatted = rtf.format(unitValue, unit as Intl.RelativeTimeFormatUnit);
        
        // Simple unit extraction - may need improvement for some languages
        const unitLabel = formatted
          .replace(/^[^a-zA-Z]+/, '') // Remove leading non-alphabetic chars
          .replace(/[0-9]/g, '')      // Remove any numbers
          .replace(/in |ago/, '')     // Remove "in" or "ago"
          .trim();
        
        return `${unitValue} ${unitLabel}`;
      });
    
    return parts.join(opts.separator);
  } catch (error) {
    logger.error(`Error formatting duration for locale ${locale}`, error);
    // Fallback to basic formatting
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    
    return [
      hours > 0 ? `${hours}h` : '',
      minutes > 0 ? `${minutes}m` : '',
      seconds > 0 || (hours === 0 && minutes === 0) ? `${seconds}s` : ''
    ].filter(Boolean).join(' ');
  }
}

/**
 * Format a relative time (e.g., "2 days ago", "in 3 hours")
 * @param date The date to format relative to now
 * @param locale The locale to use for formatting
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  date: Date | number,
  locale: Locale = defaultLocale
): string {
  try {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
    
    // Define units and their seconds values
    type TimeUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';
    const units: TimeUnit[] = ['year', 'month', 'day', 'hour', 'minute', 'second'];
    
    const secondsPerUnit: Record<TimeUnit, number> = {
      year: 60 * 60 * 24 * 365,
      month: 60 * 60 * 24 * 30,
      day: 60 * 60 * 24,
      hour: 60 * 60,
      minute: 60,
      second: 1
    };
    
    // Find the appropriate unit
    let unit: TimeUnit = 'second';
    let value = diffInSeconds;
    
    for (const u of units) {
      if (Math.abs(diffInSeconds) >= secondsPerUnit[u] || u === 'second') {
        unit = u;
        value = Math.round(diffInSeconds / secondsPerUnit[u]);
        break;
      }
    }
    
    // Use RelativeTimeFormat to format the relative time
    const formatter = new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto',
      style: 'long'
    });
    
    return formatter.format(value, unit);
  } catch (error) {
    logger.error(`Error formatting relative time for locale ${locale}`, error);
    // Fallback to standard date format
    return formatDate(date, locale);
  }
}

/**
 * Format a message with plural forms according to the count
 * @param count The count to determine which plural form to use
 * @param translations Object containing different plural forms
 * @param locale The locale to use for pluralization rules
 * @param params Additional parameters to substitute in the translation
 * @returns The pluralized string
 * 
 * @example
 * // Translation object: { one: "{{count}} item", other: "{{count}} items" }
 * formatPlural(1, { one: "{{count}} item", other: "{{count}} items" }, 'en')
 * // Returns: "1 item"
 * 
 * formatPlural(5, { one: "{{count}} item", other: "{{count}} items" }, 'en')
 * // Returns: "5 items"
 */
export function formatPlural(
  count: number,
  translations: Record<string, string>,
  locale: Locale = defaultLocale,
  params: Record<string, string | number> = {}
): string {
  try {
    // Create a new Intl.PluralRules instance for the locale
    const pluralRules = new Intl.PluralRules(locale);
    
    // Determine the plural category for the count
    const pluralCategory = pluralRules.select(count);
    
    // Get the appropriate translation for this plural category
    let translation = translations[pluralCategory];
    
    // If the specific plural form doesn't exist, fall back to 'other'
    if (!translation && pluralCategory !== 'other') {
      translation = translations.other;
    }
    
    // If still no translation, return the count as a fallback
    if (!translation) {
      logger.warn(`No plural form found for count ${count} and category '${pluralCategory}'`, {
        locale,
        availableForms: Object.keys(translations)
      });
      return String(count);
    }
    
    // Add the count to params if not already provided
    const allParams = { count, ...params };
    
    // Replace all parameters in the translation
    return Object.entries(allParams).reduce(
      (result, [paramKey, paramValue]) => 
        result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue)),
      translation
    );
  } catch (error) {
    logger.error(`Error formatting plural for locale ${locale}`, error);
    // Fallback to count with basic pluralization
    return count === 1 ? `${count} item` : `${count} items`;
  }
}

/**
 * Generate alternate links for SEO purposes (hreflang tags)
 * @param path The current path
 * @param currentLocale The current locale
 * @param baseUrl The base URL of the site
 * @returns Object containing alternate links for all supported locales
 */
export function getAlternateLinks(
  path: string, 
  currentLocale: Locale = defaultLocale,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : 'http://localhost:3000')
): Record<string, string> {
  try {
    // Remove any existing locale prefix from path
    const { path: cleanPath } = removeLocalePrefix(path);
    const pathWithoutLeadingSlash = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;
    
    // Generate alternate links for all supported locales
    const alternateLinks: Record<string, string> = {};
    
    // Add entries for all supported locales
    for (const locale of locales) {
      alternateLinks[locale] = `${baseUrl}/${locale}/${pathWithoutLeadingSlash}`;
    }
    
    // Add x-default (typically points to the default locale or the current locale)
    alternateLinks['x-default'] = `${baseUrl}/${defaultLocale}/${pathWithoutLeadingSlash}`;
    
    return alternateLinks;
  } catch (error) {
    logger.error(`Error generating alternate links for path: ${path}`, error);
    
    // Return a basic fallback with just the current locale
    return {
      [currentLocale]: `${baseUrl}/${currentLocale}`,
      'x-default': `${baseUrl}/${defaultLocale}`
    };
  }
}

/**
 * Generate HTML meta tags for alternate language versions
 * This can be used directly in the head section of a page
 * @param path The current path
 * @param currentLocale The current locale
 * @param baseUrl The base URL of the site
 * @returns Array of meta tag objects with hreflang attributes
 */
export function getHrefLangMetaTags(
  path: string,
  currentLocale: Locale = defaultLocale,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : 'http://localhost:3000')
): Array<{ rel: string; hrefLang: string; href: string }> {
  const alternateLinks = getAlternateLinks(path, currentLocale, baseUrl);
  
  return Object.entries(alternateLinks).map(([lang, url]) => ({
    rel: 'alternate',
    hrefLang: lang,
    href: url
  }));
} 