import { cookies } from 'next/headers';
import { locales, defaultLocale, Locale } from '@/config/i18n';

/**
 * Get the user's preferred locale from cookies or navigator
 * @returns The detected preferred locale
 */
export function getPreferredLocale(): Locale {
  // Check for locale in cookie
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }
  
  // Default to first locale
  return locales[0] as Locale;
} 