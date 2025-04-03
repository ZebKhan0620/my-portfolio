import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingIndicator from './LoadingIndicator';
import { Namespace } from '@/lib/translationPreloader';

interface NamespaceLoaderProps {
  namespace: Namespace;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingMessage?: string;
}

/**
 * Component that ensures a specific translation namespace is loaded
 * before rendering its children
 */
const NamespaceLoader: React.FC<NamespaceLoaderProps> = ({
  namespace,
  children,
  fallback,
  loadingMessage = `Loading ${namespace} translations...`
}) => {
  const { activeNamespaces, loadNamespace } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Check if the namespace is already loaded
  const isNamespaceLoaded = activeNamespaces.includes(namespace);
  
  useEffect(() => {
    // Skip if namespace is already loaded or loading is in progress
    if (isNamespaceLoaded || isLoading) return;
    
    const loadTranslations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await loadNamespace(namespace);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load translations'));
        console.error(`Failed to load namespace: ${namespace}`, err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTranslations();
  }, [namespace, isNamespaceLoaded, loadNamespace, isLoading]);
  
  // If we have an error, render fallback or error message
  if (error) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="text-red-500 p-2 bg-red-500/10 rounded border border-red-600/20">
        Failed to load translations for {namespace}
      </div>
    );
  }
  
  // If we're loading or namespace is not yet loaded, show loading indicator
  if (isLoading || !isNamespaceLoaded) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex justify-center py-4">
        <LoadingIndicator message={loadingMessage} size="small" color="primary" />
      </div>
    );
  }
  
  // Namespace is loaded, render children
  return <>{children}</>;
};

export default NamespaceLoader; 