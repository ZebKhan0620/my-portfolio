'use client';

import { useEffect } from 'react';
import { initWebVitalsMonitoring } from '@/lib/webVitals';

/**
 * WebVitalsMonitor component that initializes performance monitoring
 * This is a wrapper around the web-vitals library to track core web vitals
 * Reference: Issue #100 - Web Vitals Monitoring
 */
export default function WebVitalsMonitor() {
  useEffect(() => {
    // Initialize web vitals monitoring
    // In development mode, only log to console and don't try to send to API endpoint
    const logOnly = process.env.NODE_ENV === 'development';
    initWebVitalsMonitoring(logOnly);
    
    return () => {
      // Cleanup if needed (future implementation)
    };
  }, []);

  // This is a utility component with no UI
  return null;
} 