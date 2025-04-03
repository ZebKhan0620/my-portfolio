import { Metadata } from 'next';
import { locales, Locale } from '@/config/i18n';

/**
 * Language-specific SEO metadata
 */
export interface LocalizedMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogImageAlt?: string;
}

/**
 * Interface defining the parameters for generating alternate language tags
 */
export interface LanguageAlternatesProps {
  path: string;
  locale: string;
  baseUrl?: string;
}

/**
 * Type for alternate language entries
 */
type AlternateLanguage = {
  hrefLang: string;
  href: string;
};

/**
 * Generates alternate language metadata tags for SEO
 * This helps search engines understand the language versions of a page
 */
export function generateLanguageAlternates({
  path,
  locale,
  baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3000')
}: LanguageAlternatesProps): Metadata['alternates'] {
  const pathname = path.startsWith('/') ? path : `/${path}`;
  const cleanPathname = pathname === '/' ? '' : pathname;

  // Generate alternate links for all supported locales
  const alternateLanguages: AlternateLanguage[] = locales.map(supportedLocale => ({
    hrefLang: supportedLocale,
    href: `${baseUrl}/${supportedLocale}${cleanPathname}`,
  }));

  // Add x-default for search engines
  // This indicates the default page when no language matches
  alternateLanguages.push({
    hrefLang: 'x-default',
    href: `${baseUrl}/${locale}${cleanPathname}`,
  });

  // Convert to record format expected by Next.js
  const languagesRecord: Record<string, string> = {};
  
  alternateLanguages.forEach(alt => {
    languagesRecord[alt.hrefLang] = alt.href;
  });

  return {
    languages: languagesRecord,
  };
}

/**
 * Helper to generate common SEO metadata with proper language handling
 */
export function generateSeoMetadata({
  localizedMetadata,
  locale,
  path,
  baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3000'),
  additionalMetadata = {}
}: {
  localizedMetadata: Record<Locale, LocalizedMetadata>;
  locale: string;
  path: string;
  baseUrl?: string;
  additionalMetadata?: Partial<Metadata>;
}): Metadata {
  // Get metadata for the current locale or fallback to first locale
  const validLocale = locales.includes(locale as Locale) ? locale as Locale : locales[0];
  const metadata = localizedMetadata[validLocale];
  
  if (!metadata) {
    throw new Error(`No metadata found for locale: ${validLocale}`);
  }
  
  const alternates = generateLanguageAlternates({
    path,
    locale: validLocale,
    baseUrl
  });
  
  const url = `${baseUrl}/${validLocale}${path === '/' ? '' : path}`;
  
  const openGraph: Metadata['openGraph'] = {
    title: metadata.title,
    description: metadata.description,
    url: url,
    locale: validLocale,
    type: 'website',
    images: metadata.ogImage ? [
      {
        url: metadata.ogImage,
        width: 1200,
        height: 630,
        alt: metadata.ogImageAlt || metadata.title
      }
    ] : undefined,
  };
  
  const twitterCard: Metadata['twitter'] = {
    card: 'summary_large_image',
    title: metadata.title,
    description: metadata.description,
    images: metadata.ogImage ? [metadata.ogImage] : undefined,
  };

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates,
    openGraph,
    twitter: twitterCard,
    ...additionalMetadata
  };
} 