'use client';

import React, { ReactNode } from 'react';
import { useLazyTranslation } from '@/hooks/useLazyTranslation';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorNotification from '@/components/ErrorNotification';

interface LazyTranslatedContentProps {
  /** The translation namespace to load */
  namespace: string;
  
  /** Content render function with access to the t function */
  children: (t: (key: string, params?: Record<string, string | number>) => string) => ReactNode;
  
  /** Optional fallback content to show while loading */
  fallback?: ReactNode;
  
  /** Optional fallback translations to use before loading completes */
  fallbackTranslations?: Record<string, string>;
  
  /** Loading text to show (default: "Loading content...") */
  loadingText?: string;
  
  /** Whether to show error notifications (default: true) */
  showErrors?: boolean;
  
  /** Error timeout in milliseconds (default: 5000) */
  errorTimeout?: number;
}

/**
 * Component for rendering content that requires lazily loaded translations
 * Uses the useLazyTranslation hook to load translations for a specific namespace
 */
export default function LazyTranslatedContent({
  namespace,
  children,
  fallback,
  fallbackTranslations,
  loadingText = "Loading content...",
  showErrors = true,
  errorTimeout = 5000
}: LazyTranslatedContentProps) {
  const { t, isLoaded, error, reload } = useLazyTranslation({
    namespace,
    fallback: fallbackTranslations,
  });
  
  // If loading and no fallback is provided, show loading indicator
  if (!isLoaded && !fallbackTranslations && !fallback) {
    return (
      <div className="flex justify-center items-center p-4">
        <LoadingIndicator size="sm" message={loadingText} />
      </div>
    );
  }
  
  return (
    <>
      {/* Show error notification if there was an error and showErrors is true */}
      {error && showErrors && (
        <ErrorNotification
          message={`Failed to load translations: ${error.message}`}
          severity="warning"
          timeout={errorTimeout}
          onDismiss={() => {}} // Keep the ErrorNotification component API consistent
        />
      )}
      
      {/* 
        Render the content with the t function
        Even if there's an error, we'll still render with whatever translations we have
      */}
      <div className={!isLoaded ? "opacity-80" : undefined}>
        {/* If we're still loading and a fallback is provided, render the fallback */}
        {!isLoaded && fallback ? fallback : children(t)}
      </div>
      
      {/* If there was an error, offer a retry button */}
      {error && (
        <div className="mt-2 flex justify-center">
          <button
            onClick={() => reload()}
            className="text-sm px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded"
          >
            Retry loading translations
          </button>
        </div>
      )}
    </>
  );
} 