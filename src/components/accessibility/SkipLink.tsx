'use client';

import { useEffect, useState } from 'react';
import { createLogger } from '@/lib/logging';

const logger = createLogger('SkipLink');

interface SkipLinkProps {
  targetId: string;
  label?: string;
}

/**
 * Accessible skip link component that allows keyboard users to bypass navigation
 * and jump directly to the main content. This component is visually hidden
 * until it receives focus.
 */
export default function SkipLink({ 
  targetId, 
  label = 'Skip to main content' 
}: SkipLinkProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    try {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.focus();
        targetElement.scrollIntoView({ behavior: 'smooth' });
        logger.debug(`Skipped to element with id: ${targetId}`);
      } else {
        logger.warn(`Skip link target with id "${targetId}" not found`);
      }
    } catch (error) {
      logger.error(`Error using skip link:`, error);
    }
  };

  // Reset focus state when user tabs away
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && isFocused) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);
  
  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`
        skip-to-content 
        ${isFocused ? 'focus:block' : ''}
        focus:z-50
      `}
    >
      {label}
    </a>
  );
} 