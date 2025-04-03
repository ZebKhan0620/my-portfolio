'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Namespace } from './translationPreloader';

/**
 * Return value of the useNamespace hook
 */
interface UseNamespaceResult {
  /** Whether all the specified namespaces are loaded */
  isLoaded: boolean;
  
  /** Whether namespaces are currently loading */
  isLoading: boolean;
  
  /** Any error that occurred during loading */
  error: string | null;
  
  /** Manually trigger a reload of the namespaces */
  reload: () => Promise<void>;
}

/**
 * Hook to load translation namespaces for functional components
 *
 * @param namespaces The namespace(s) to load
 * @returns Object with loading state and methods
 */
export function useNamespace(
  namespaces: Namespace | Namespace[]
): UseNamespaceResult {
  // Get language context data
  const { activeNamespaces, loadNamespace, error } = useLanguage();
  
  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);

  // Convert to array for consistent handling
  const namespacesToLoad = Array.isArray(namespaces) ? namespaces : [namespaces];

  // Check if all namespaces are already loaded
  const isLoaded = namespacesToLoad.every(ns => activeNamespaces.includes(ns));

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Load the namespaces if needed
  useEffect(() => {
    if (!isLoaded && !isLoading) {
      loadNamespaces();
    }
  }, [isLoaded, activeNamespaces]);

  // Function to load required namespaces
  const loadNamespaces = async () => {
    try {
      setIsLoading(true);
      
      // Load each namespace in parallel
      await Promise.all(
        namespacesToLoad
          .filter(ns => !activeNamespaces.includes(ns))
          .map(ns => loadNamespace(ns))
      );
    } catch (err) {
      // Error is handled by the LanguageContext
      console.error('Error loading namespaces:', err);
    } finally {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  // Function to manually reload namespaces
  const reload = async () => {
    await loadNamespaces();
  };

  return {
    isLoaded,
    isLoading,
    error,
    reload
  };
} 