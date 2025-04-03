/**
 * Enhanced fetch function with retry capabilities for robust network requests
 */
import { createLogger } from './logging';

const logger = createLogger('fetchWithRetry');

/**
 * Options for fetch with retry
 */
interface FetchWithRetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  
  /** Initial delay between retries in ms (default: 500) */
  initialDelay?: number;
  
  /** Backoff factor to increase delay between retries (default: 1.5) */
  backoffFactor?: number;
  
  /** Maximum delay between retries in ms (default: 5000) */
  maxDelay?: number;
  
  /** Whether to use exponential backoff (default: true) */
  useExponentialBackoff?: boolean;
  
  /** HTTP status codes that should trigger a retry (default: 429, 503, 504) */
  retryStatusCodes?: number[];
  
  /** Callback for retry attempts */
  onRetry?: (attempt: number, error: Error | null, response: Response | null) => void;
}

/**
 * Fetch with retry logic for more robust network requests
 * 
 * @param url URL to fetch
 * @param fetchOptions Standard fetch options
 * @param retryOptions Configuration for retry behavior
 * @returns Promise with the parsed response
 */
export async function fetchWithRetry<T>(
  url: string,
  fetchOptions?: RequestInit,
  retryOptions?: FetchWithRetryOptions
): Promise<T> {
  // Default retry options
  const options = {
    maxRetries: 3,
    initialDelay: 500,
    backoffFactor: 1.5,
    maxDelay: 5000,
    useExponentialBackoff: true,
    retryStatusCodes: [429, 503, 504],
    ...retryOptions
  };
  
  let attempt = 0;
  let delay = options.initialDelay;
  
  while (true) {
    attempt++;
    
    try {
      logger.debug(`Fetch attempt ${attempt} for ${url}`);
      const response = await fetch(url, fetchOptions);
      
      // Check if response is OK or if we should retry based on status code
      if (response.ok) {
        // Parse response based on content type
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
          return await response.json() as T;
        } else if (contentType.includes('text/')) {
          return await response.text() as unknown as T;
        } else {
          // Default to returning the response object for other content types
          return response as unknown as T;
        }
      }
      
      // Check if we should retry based on status code
      if (options.retryStatusCodes.includes(response.status) && attempt <= options.maxRetries) {
        logger.warn(`Received status ${response.status} from ${url}, attempt ${attempt}/${options.maxRetries}`);
        
        // Call onRetry callback if provided
        if (options.onRetry) {
          options.onRetry(attempt, null, response);
        }
        
        // Wait before retrying
        await sleep(delay);
        
        // Calculate next delay with backoff
        if (options.useExponentialBackoff) {
          delay = Math.min(delay * options.backoffFactor, options.maxDelay);
        }
        
        continue;
      }
      
      // If we get here, the response was not ok and we're not retrying
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    } catch (error) {
      logger.error(`Error fetching ${url}`, error);
      
      // Retry on network errors if we haven't exceeded maxRetries
      if (attempt <= options.maxRetries) {
        // Call onRetry callback if provided
        if (options.onRetry) {
          options.onRetry(attempt, error instanceof Error ? error : new Error(String(error)), null);
        }
        
        // Wait before retrying
        await sleep(delay);
        
        // Calculate next delay with backoff
        if (options.useExponentialBackoff) {
          delay = Math.min(delay * options.backoffFactor, options.maxDelay);
        }
        
        continue;
      }
      
      // If we get here, we've exceeded maxRetries
      throw error;
    }
  }
}

/**
 * Simple promise-based sleep function
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
} 