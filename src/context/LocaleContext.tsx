'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { getSafeLocale } from '@/lib/i18n';

interface LocaleContextType {
  locale: string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en', // Default locale
});

export const useLocale = (): LocaleContextType => {
  return useContext(LocaleContext);
};

interface LocaleProviderProps {
  children: ReactNode;
  locale: string;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ 
  children, 
  locale 
}) => {
  // Ensure we have a valid locale
  const safeLocale = getSafeLocale(locale);
  
  return (
    <LocaleContext.Provider value={{ locale: safeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};
