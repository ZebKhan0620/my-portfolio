import type { Metric } from 'web-vitals';
import { createLogger } from './logging';

const logger = createLogger('WebVitals');

/**
 * Send web vitals metrics to our analytics endpoint
 * Implementation for Issue #100: Web Vitals Monitoring
 */
const reportWebVitals = (metric: Metric, logOnly: boolean = false) => {
  // Log the metric to console in development
  if (process.env.NODE_ENV === 'development') {
    const color = 
      metric.rating === 'good' ? '#0CCE6B' :
      metric.rating === 'needs-improvement' ? '#FFA400' : 
      '#FF4E42';
    
    logger.info(`Web Vital: ${metric.name}`, {
      value: Math.round(metric.value * 100) / 100,
      rating: metric.rating,
      id: metric.id,
      delta: metric.delta
    });
  }
  
  // Skip sending to backend if logOnly is true
  if (logOnly) {
    return;
  }
  
  // Report to backend analytics
  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      page: window.location.pathname,
      navigationType: metric.navigationType
    });
    
    // Use the Beacon API when available
    navigator.sendBeacon('/api/analytics/vitals', body);
  } else {
    // Fall back to fetch for older browsers
    fetch('/api/analytics/vitals', {
      method: 'POST',
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        page: typeof window !== 'undefined' ? window.location.pathname : '',
        navigationType: metric.navigationType
      }),
      keepalive: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(err => 
      logger.error('Error reporting web vitals', err)
    );
  }
};

/**
 * Initialize web vitals monitoring in a browser environment
 * @param logOnly If true, only log metrics to console and don't send to endpoint
 */
export function initWebVitalsMonitoring(logOnly: boolean = false) {
  if (typeof window !== 'undefined') {
    // Only load web-vitals in the browser
    import('web-vitals').then((webVitals) => {
      // Create a wrapped reporter function that includes the logOnly parameter
      const reporter = (metric: Metric) => reportWebVitals(metric, logOnly);
      
      // Use onCLS, onFID etc. from web-vitals v2.0.0 and above
      webVitals.onCLS(reporter);  // Cumulative Layout Shift
      webVitals.onFID(reporter);  // First Input Delay
      webVitals.onLCP(reporter);  // Largest Contentful Paint
      webVitals.onFCP(reporter);  // First Contentful Paint
      webVitals.onTTFB(reporter); // Time to First Byte
    });
  }
}

/**
 * Helper to interpret vitals values
 */
export function getWebVitalRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  switch (name) {
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'needs-improvement';
  }
}

/**
 * Get human-readable interpretation of web vitals values
 */
export function getWebVitalInterpretation(name: string, value: number): string {
  const rating = getWebVitalRating(name, value);
  
  switch (name) {
    case 'CLS':
      return `Cumulative Layout Shift: ${value.toFixed(2)} - ${rating === 'good' ? 'Good stability' : rating === 'needs-improvement' ? 'Some visible layout shifts' : 'Poor stability with significant layout shifts'}`;
    case 'FID':
      return `First Input Delay: ${value.toFixed(0)}ms - ${rating === 'good' ? 'Good responsiveness' : rating === 'needs-improvement' ? 'Moderate input delay' : 'Poor responsiveness with significant delay'}`;
    case 'LCP':
      return `Largest Contentful Paint: ${(value / 1000).toFixed(1)}s - ${rating === 'good' ? 'Good load speed' : rating === 'needs-improvement' ? 'Moderate load speed' : 'Slow load speed'}`;
    case 'FCP':
      return `First Contentful Paint: ${(value / 1000).toFixed(1)}s - ${rating === 'good' ? 'Fast initial render' : rating === 'needs-improvement' ? 'Moderate initial render' : 'Slow initial render'}`;
    case 'TTFB':
      return `Time to First Byte: ${(value / 1000).toFixed(1)}s - ${rating === 'good' ? 'Fast server response' : rating === 'needs-improvement' ? 'Moderate server response' : 'Slow server response'}`;
    default:
      return `${name}: ${value}`;
  }
}

export default reportWebVitals; 