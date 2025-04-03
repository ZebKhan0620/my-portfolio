import { Locale } from '@/config/i18n';
import { createLogger } from './logging';

const logger = createLogger('translationCache');

// Key structure for cache lookups
type CacheKey = `${Locale}:${string}`;

/**
 * A simple in-memory cache for translations
 * This is a singleton that persists for the lifetime of the application
 */
class TranslationCache {
  private cache: Map<CacheKey, Record<string, any>> = new Map();
  private expiry: Map<CacheKey, number> = new Map();
  private readonly MAX_AGE = 3600000; // 1 hour in milliseconds
  
  /**
   * Generate a cache key for a locale and namespace
   * @param locale Locale to use
   * @param namespace Namespace to use (default: 'common')
   */
  private getCacheKey(locale: Locale, namespace: string = 'common'): CacheKey {
    return `${locale}:${namespace}`;
  }
  
  /**
   * Get translations for a locale and namespace from the cache
   * @param locale The locale to get translations for
   * @param namespace The namespace to get translations for (default: 'common')
   * @returns The cached translations or null if not found
   */
  get(locale: Locale, namespace: string = 'common'): Record<string, any> | null {
    const key = this.getCacheKey(locale, namespace);
    
    // Check if translations exist and are not expired
    if (this.cache.has(key)) {
      const expiryTime = this.expiry.get(key) || 0;
      
      if (Date.now() < expiryTime) {
        logger.debug(`Cache hit for ${locale}/${namespace} translations`);
        return this.cache.get(key) || null;
      } else {
        // Expired cache entry
        logger.debug(`Cache expired for ${locale}/${namespace} translations`);
        this.cache.delete(key);
        this.expiry.delete(key);
      }
    }
    
    logger.debug(`Cache miss for ${locale}/${namespace} translations`);
    return null;
  }
  
  /**
   * Set translations for a locale and namespace in the cache
   * @param locale The locale to set translations for
   * @param translations The translations to cache
   * @param namespace The namespace to set translations for (default: 'common')
   * @param maxAge Optional custom max age in milliseconds
   */
  set(
    locale: Locale, 
    translations: Record<string, any>, 
    namespace: string = 'common',
    maxAge?: number
  ): void {
    const key = this.getCacheKey(locale, namespace);
    logger.debug(`Caching translations for ${locale}/${namespace}`);
    this.cache.set(key, translations);
    this.expiry.set(key, Date.now() + (maxAge || this.MAX_AGE));
  }
  
  /**
   * Clear the cache for a specific locale and optional namespace
   * @param locale Optional locale to clear, if not provided all locales are cleared
   * @param namespace Optional namespace to clear, if not provided all namespaces for the locale are cleared
   */
  clear(locale?: Locale, namespace?: string): void {
    if (!locale) {
      logger.debug('Clearing entire translation cache');
      this.cache.clear();
      this.expiry.clear();
      return;
    }
    
    if (namespace) {
      // Clear specific locale and namespace
      const key = this.getCacheKey(locale, namespace);
      logger.debug(`Clearing cache for ${locale}/${namespace}`);
      this.cache.delete(key);
      this.expiry.delete(key);
    } else {
      // Clear all namespaces for this locale
      logger.debug(`Clearing all namespaces for ${locale}`);
      
      const keysToDelete: CacheKey[] = [];
      this.cache.forEach((_, key) => {
        if (key.startsWith(`${locale}:`)) {
          keysToDelete.push(key);
        }
      });
      
      // Delete the keys
      keysToDelete.forEach(key => {
        this.cache.delete(key);
        this.expiry.delete(key);
      });
    }
  }
  
  /**
   * Check if a locale and namespace is cached
   * @param locale The locale to check
   * @param namespace The namespace to check (default: 'common')
   * @returns True if the locale and namespace is cached and not expired
   */
  has(locale: Locale, namespace: string = 'common'): boolean {
    const key = this.getCacheKey(locale, namespace);
    
    if (!this.cache.has(key)) {
      return false;
    }
    
    const expiryTime = this.expiry.get(key) || 0;
    return Date.now() < expiryTime;
  }
  
  /**
   * Get all available namespaces for a locale
   * @param locale The locale to get namespaces for
   * @returns Array of namespace strings
   */
  getNamespaces(locale: Locale): string[] {
    const namespaces: string[] = [];
    const prefix = `${locale}:`;
    
    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        const [, namespace] = key.split(':');
        if (namespace) {
          namespaces.push(namespace);
        }
      }
    });
    
    return namespaces;
  }
  
  /**
   * Get information about the current cache state
   */
  getStats(): { 
    size: number; 
    entries: Array<{ locale: string; namespace: string; expires: Date }>;
    byLocale: Record<string, { namespaces: string[]; total: number }>;
  } {
    const entries: Array<{ locale: string; namespace: string; expires: Date }> = [];
    const byLocale: Record<string, { namespaces: string[]; total: number }> = {};
    
    this.cache.forEach((_, key) => {
      const [locale, namespace] = key.split(':') as [string, string];
      const expires = new Date(this.expiry.get(key) || 0);
      
      entries.push({ locale, namespace, expires });
      
      // Update byLocale stats
      if (!byLocale[locale]) {
        byLocale[locale] = { namespaces: [], total: 0 };
      }
      
      byLocale[locale].namespaces.push(namespace);
      byLocale[locale].total++;
    });
    
    return {
      size: this.cache.size,
      entries,
      byLocale
    };
  }
}

// Export a singleton instance
export const translationCache = new TranslationCache(); 