import React from 'react';
import { Metadata } from 'next';
import { isSupportedLocale, getSafeLocale } from '@/lib/i18n';
import { getTranslations } from '@/lib/i18n';
import { LanguageProvider } from '@/contexts/LanguageContext';

export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
  // Validate and get safe locale
  const locale = getSafeLocale(params.locale);
  const translations = await getTranslations(locale);
  
  return {
    title: translations.common?.siteTitle || 'My Portfolio',
    description: translations.common?.siteDescription || 'A professional portfolio website',
  };
}

export default async function LocaleLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate the locale from the URL
  const locale = getSafeLocale(params.locale);
  
  // Pre-load the translations on the server
  const initialTranslations = await getTranslations(locale);
  
  return (
    <LanguageProvider 
      locale={locale} 
      initialTranslations={initialTranslations}
      initialNamespaces={['common']}
    >
      {children}
    </LanguageProvider>
  );
}

// Generate static pages for each supported locale
export function generateStaticParams() {
  // This will be used for static generation at build time
  return ['en', 'ja'].filter(isSupportedLocale).map(locale => ({
    locale,
  }));
}
