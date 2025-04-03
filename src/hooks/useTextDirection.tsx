import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTextDirection, isRTL, TextDirection } from '@/config/i18n';

interface UseTextDirectionResult {
  /**
   * Current text direction based on the active locale
   */
  direction: TextDirection;
  
  /**
   * Whether the direction is right-to-left
   */
  isRtl: boolean;
  
  /**
   * CSS class names for RTL/LTR text direction
   */
  className: string;
  
  /**
   * CSS style object for RTL/LTR text direction
   */
  style: React.CSSProperties;
}

/**
 * Hook to get text direction information based on the current locale
 * 
 * @returns Object with text direction information
 * 
 * @example
 * // Basic usage
 * const { direction, isRtl } = useTextDirection();
 * 
 * // With className
 * const { className } = useTextDirection();
 * return <div className={`my-component ${className}`}>Content</div>;
 * 
 * // With style object
 * const { style } = useTextDirection();
 * return <div style={style}>Content</div>;
 */
export function useTextDirection(): UseTextDirectionResult {
  const { locale } = useLanguage();
  
  return useMemo(() => {
    const direction = getTextDirection(locale);
    const rtl = isRTL(locale);
    
    return {
      direction,
      isRtl: rtl,
      className: rtl ? 'rtl' : 'ltr',
      style: {
        direction,
        textAlign: rtl ? 'right' : 'left',
      }
    };
  }, [locale]);
}

export default useTextDirection; 