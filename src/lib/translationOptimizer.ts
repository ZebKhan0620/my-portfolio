/**
 * Utilities for optimizing translation data to reduce memory usage
 */
import { createLogger } from './logging';

const logger = createLogger('translationOptimizer');

/**
 * Statistics about optimization results
 */
interface OptimizationStats {
  originalSize: number;
  optimizedSize: number;
  originalKeys: number;
  optimizedKeys: number;
  savings: number;
  savingsPercent: number;
  duplicatesRemoved: number;
  emptyValuesRemoved: number;
}

/**
 * Options for the optimization process
 */
interface OptimizationOptions {
  removeEmptyValues?: boolean;
  removeDuplicates?: boolean;
  trimValues?: boolean;
  normalizePlaceholders?: boolean;
}

/**
 * Optimizer for translation data
 */
export class TranslationOptimizer {
  private defaultOptions: OptimizationOptions = {
    removeEmptyValues: true,
    removeDuplicates: true,
    trimValues: true,
    normalizePlaceholders: true
  };
  
  /**
   * Optimize a translation object to reduce memory usage
   * @param translations The translation object to optimize
   * @param options Optimization options
   * @returns The optimized translation object and optimization statistics
   */
  optimize(
    translations: Record<string, any>,
    options: OptimizationOptions = {}
  ): { optimized: Record<string, any>; stats: OptimizationStats } {
    // Merge options with defaults
    const opts = { ...this.defaultOptions, ...options };
    
    // Clone the original translations to avoid modifying the input
    const originalJson = JSON.stringify(translations);
    const originalSize = originalJson.length;
    
    // Count original keys
    const originalKeys = this.countKeys(translations);
    
    // Get list of all keys with their values
    const keyValues = this.flattenObject(translations);
    
    // Track optimization metrics
    let duplicatesRemoved = 0;
    let emptyValuesRemoved = 0;
    
    // Process key-value pairs according to options
    const processedKeyValues = new Map<string, string>();
    const seen = new Set<string>();
    
    for (const [key, value] of keyValues) {
      if (typeof value !== 'string') continue;
      
      // Handle empty values
      if (opts.removeEmptyValues && (!value || value.trim() === '')) {
        emptyValuesRemoved++;
        continue;
      }
      
      // Process the value
      let processedValue = value;
      
      // Trim whitespace if enabled
      if (opts.trimValues) {
        processedValue = processedValue.trim();
      }
      
      // Normalize placeholders if enabled (e.g., {{ name }} -> {{name}})
      if (opts.normalizePlaceholders) {
        processedValue = processedValue.replace(/\{\{\s+([^}]+)\s+\}\}/g, '{{$1}}');
      }
      
      // Check for duplicates if enabled
      if (opts.removeDuplicates) {
        if (seen.has(processedValue)) {
          duplicatesRemoved++;
          continue;
        }
        seen.add(processedValue);
      }
      
      // Add the processed key-value pair
      processedKeyValues.set(key, processedValue);
    }
    
    // Rebuild the object structure
    const optimized = this.rebuildObject(processedKeyValues);
    
    // Calculate statistics
    const optimizedJson = JSON.stringify(optimized);
    const optimizedSize = optimizedJson.length;
    const optimizedKeys = this.countKeys(optimized);
    const savings = originalSize - optimizedSize;
    const savingsPercent = (savings / originalSize) * 100;
    
    const stats: OptimizationStats = {
      originalSize,
      optimizedSize,
      originalKeys,
      optimizedKeys,
      savings,
      savingsPercent,
      duplicatesRemoved,
      emptyValuesRemoved
    };
    
    logger.debug(`Optimized translations: ${savingsPercent.toFixed(2)}% saved`, stats);
    
    return { optimized, stats };
  }
  
  /**
   * Flatten a nested object into key-value pairs with dot notation
   */
  private flattenObject(obj: Record<string, any>, prefix = ''): Array<[string, any]> {
    return Object.entries(obj).reduce<Array<[string, any]>>((acc, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return [...acc, ...this.flattenObject(value, newKey)];
      }
      
      return [...acc, [newKey, value]];
    }, []);
  }
  
  /**
   * Rebuild a nested object from flattened key-value pairs
   */
  private rebuildObject(flattenedMap: Map<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [path, value] of flattenedMap.entries()) {
      const parts = path.split('.');
      let current = result;
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      
      current[parts[parts.length - 1]] = value;
    }
    
    return result;
  }
  
  /**
   * Count the total number of keys in a nested object
   */
  private countKeys(obj: Record<string, any>): number {
    return this.flattenObject(obj).length;
  }
}

// Export a singleton instance
export const translationOptimizer = new TranslationOptimizer(); 