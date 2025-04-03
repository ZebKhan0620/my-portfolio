import React, { ComponentType, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Namespace } from './translationPreloader';
import LoadingIndicator from '@/components/LoadingIndicator';

/**
 * Configuration options for the withNamespace HOC
 */
interface WithNamespaceOptions {
  /** 
   * Show loading indicator when namespace is loading
   * Default: true
   */
  showLoading?: boolean;
  
  /**
   * Custom loading component to show when loading
   * If provided, this overrides showLoading
   */
  LoadingComponent?: ComponentType<any>;
  
  /**
   * If true, will throw errors instead of handling them
   * Default: false
   */
  throwErrors?: boolean;
  
  /**
   * Custom error component to show when loading fails
   */
  ErrorComponent?: ComponentType<{ error: string | null; namespace: Namespace }>;
}

/**
 * Higher-Order Component that ensures required translation namespaces
 * are loaded before rendering the wrapped component
 *
 * @param namespaces Array of namespaces to load
 * @param options Configuration options
 * @returns HOC wrapper function
 */
export function withNamespace<P extends object>(
  namespaces: Namespace | Namespace[],
  options: WithNamespaceOptions = {}
) {
  // Convert single namespace to array for consistent handling
  const namespacesToLoad = Array.isArray(namespaces) ? namespaces : [namespaces];
  
  // Default options
  const {
    showLoading = true,
    LoadingComponent,
    throwErrors = false,
    ErrorComponent
  } = options;
  
  // Return the HOC function
  return function withNamespaceHOC(WrappedComponent: ComponentType<P>) {
    // Return the wrapped component
    const ComponentWithNamespace = (props: P) => {
      const { activeNamespaces, loadNamespace, error } = useLanguage();
      const [isLoading, setIsLoading] = useState(false);
      
      // Check if all required namespaces are loaded
      const allNamespacesLoaded = namespacesToLoad.every(ns => 
        activeNamespaces.includes(ns)
      );
      
      // Load namespaces if needed
      React.useEffect(() => {
        async function loadNamespaces() {
          try {
            setIsLoading(true);
            // Load namespaces concurrently
            await Promise.all(
              namespacesToLoad
                .filter(ns => !activeNamespaces.includes(ns))
                .map(ns => loadNamespace(ns))
            );
          } catch (err) {
            if (throwErrors) {
              throw err;
            }
            // Error handling is managed by the LanguageContext
          } finally {
            setIsLoading(false);
          }
        }
        
        if (!allNamespacesLoaded && !isLoading) {
          loadNamespaces();
        }
      }, [activeNamespaces, isLoading]);
      
      // Handle error state
      if (error && !throwErrors) {
        if (ErrorComponent) {
          return <ErrorComponent error={error} namespace={namespacesToLoad[0]} />;
        }
        
        return (
          <div className="p-4 bg-red-500/10 border border-red-600/20 rounded-md">
            <h3 className="text-red-600 font-medium mb-2">
              Translation Error
            </h3>
            <p className="text-red-700">
              Failed to load translations: {error}
            </p>
          </div>
        );
      }
      
      // Handle loading state
      if (!allNamespacesLoaded || isLoading) {
        if (LoadingComponent) {
          return <LoadingComponent />;
        }
        
        if (showLoading) {
          return (
            <div className="flex justify-center py-8">
              <LoadingIndicator 
                size="medium"
                color="primary"
                message={`Loading translations...`}
              />
            </div>
          );
        }
        
        // If showLoading is false and no custom component, render nothing
        return null;
      }
      
      // All namespaces loaded, render the component
      return <WrappedComponent {...props} />;
    };
    
    // Copy display name for better debugging
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    ComponentWithNamespace.displayName = `withNamespace(${displayName})`;
    
    return ComponentWithNamespace;
  };
} 