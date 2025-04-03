/**
 * This file defines the available translation namespaces and provides
 * utility functions for preloading translations
 */

/**
 * All available translation namespaces in the application
 * Add new namespaces here when creating new translation files
 */
export type Namespace = 
  | 'common'    // General translations used throughout the app
  | 'admin'     // Admin panel translations
  | 'settings'  // Settings page translations
  | 'errors'    // Error messages
  | 'forms'     // Form related translations (labels, validation messages)
  | 'blog'      // Blog related translations
  | 'auth';     // Authentication related translations

/**
 * List of all available namespaces - must match the type definition
 */
export const availableNamespaces: Namespace[] = [
  'common',
  'admin',
  'settings',
  'errors',
  'forms',
  'blog',
  'auth'
];

/**
 * Map of page paths to namespaces they require
 * Used for automatic preloading of translations
 */
export const pageNamespaces: Record<string, Namespace[]> = {
  // Default for all pages
  '_app': ['common'],
  
  // Admin pages
  'admin': ['common', 'admin'],
  'admin/dashboard': ['common', 'admin'],
  'admin/settings': ['common', 'admin', 'settings'],
  
  // User-facing pages
  'settings': ['common', 'settings'],
  'login': ['common', 'auth'],
  'register': ['common', 'auth'],
  'blog': ['common', 'blog']
};

/**
 * Determine which namespaces should be loaded for a given path
 * 
 * @param path The current path
 * @returns Array of namespaces to load
 */
export function getNamespacesForPath(path: string): Namespace[] {
  // Strip locale prefix and query params
  const cleanPath = path
    .replace(/^\/[a-z]{2}(-[A-Z]{2})?\//, '/')  // Remove locale prefix
    .replace(/\?.+$/, '')                      // Remove query params
    .replace(/^\//, '');                       // Remove leading slash
  
  // Look for exact match
  if (pageNamespaces[cleanPath]) {
    return pageNamespaces[cleanPath];
  }
  
  // Look for parent path matches
  const pathParts = cleanPath.split('/');
  while (pathParts.length > 0) {
    const parentPath = pathParts.join('/');
    if (pageNamespaces[parentPath]) {
      return pageNamespaces[parentPath];
    }
    pathParts.pop();
  }
  
  // Default to common namespace
  return ['common'];
} 