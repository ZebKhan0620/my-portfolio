'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales, Locale, localeMetadata } from '@/config/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Create refs for each option item
  const createOptionRefs = () => {
    const refs: React.RefObject<HTMLDivElement>[] = [];
    locales.forEach(() => {
      refs.push(useRef<HTMLDivElement>(null));
    });
    return refs;
  };
  
  const optionsRef = useRef<React.RefObject<HTMLDivElement>[]>(createOptionRefs());
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle keyboard navigation within dropdown
  const handleKeyDown = (e: React.KeyboardEvent, index?: number) => {
    // If this is triggered from the button
    if (index === undefined) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setIsOpen(true);
        
        // Focus the first/last option
        const targetIndex = e.key === 'ArrowDown' ? 0 : locales.length - 1;
        optionsRef.current[targetIndex]?.current?.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
      return;
    }
    
    // If this is triggered from an option
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLocaleChange(locales[index] as Locale);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % locales.length;
      optionsRef.current[nextIndex]?.current?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + locales.length) % locales.length;
      optionsRef.current[prevIndex]?.current?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === 'Tab' && !e.shiftKey && index === locales.length - 1) {
      setIsOpen(false);
    } else if (e.key === 'Tab' && e.shiftKey && index === 0) {
      setIsOpen(false);
    }
  };
  
  // Change the locale
  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
    buttonRef.current?.focus();
  };
  
  // Get locale display information
  const getLocaleInfo = (localeCode: Locale) => {
    return {
      flag: localeMetadata[localeCode].flag,
      label: localeMetadata[localeCode].label,
      name: localeMetadata[localeCode].name[locale as Locale] || localeMetadata[localeCode].name.en
    };
  };
  
  const currentLocaleInfo = getLocaleInfo(locale as Locale);
  const switcherId = 'language-switcher';
  const menuId = 'language-menu';
  
  return (
    <div className="relative" ref={switcherRef}>
      <button
        id={switcherId}
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => handleKeyDown(e)}
        className="flex items-center gap-1 px-2 py-1 xs:px-2.5 xs:py-1.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 transition-all duration-300 hover:bg-gray-700/90 hover:border-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={menuId}
        aria-label={t('languageSwitcher.chooseLanguage')}
      >
        <span 
          className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors"
          aria-hidden="true"
        >
          {currentLocaleInfo.flag} <span className="hidden xs:inline sm:hidden md:inline">{locale === 'en' ? 'EN' : 'JA'}</span>
        </span>
        <span className="sr-only">
          {t('languageSwitcher.chooseLanguage')} - {t(`languageSwitcher.${locale}`)}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          id={menuId}
          ref={menuRef}
          className="absolute right-0 mt-1 sm:mt-1 md:mt-2 w-32 sm:w-36 md:w-40 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-700/50 overflow-hidden z-50"
          role="listbox"
          aria-labelledby={switcherId}
          aria-orientation="vertical"
        >
          <div className="py-1">
            <div className="px-2 sm:px-3 py-1.5 sm:py-2 text-2xs xs:text-xs text-gray-400 border-b border-gray-700/50">
              {t('languageSwitcher.chooseLanguage')}
            </div>
            
            {locales.map((localeOption, index) => {
              const info = getLocaleInfo(localeOption as Locale);
              const isSelected = locale === localeOption;
              const optionId = `language-option-${localeOption}`;
              
              return (
                <div
                  key={localeOption}
                  id={optionId}
                  ref={optionsRef.current[index]}
                  onClick={() => handleLocaleChange(localeOption as Locale)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`block px-3 sm:px-4 py-1.5 sm:py-2 text-2xs xs:text-xs sm:text-sm hover:bg-gray-700/60 transition-colors cursor-pointer ${
                    isSelected ? 'text-emerald-400 bg-emerald-900/20' : 'text-white'
                  } focus:outline-none focus:bg-gray-700/70 focus:text-white`}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                >
                  <div className="flex items-center">
                    <span className="mr-1.5 sm:mr-2" aria-hidden="true">{info.flag}</span>
                    <span>{info.name}</span>
                    {isSelected && (
                      <svg 
                        className="ml-auto h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 