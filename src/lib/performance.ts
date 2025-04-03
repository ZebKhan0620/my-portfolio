/**
 * Performance monitoring utilities for tracking and measuring application performance
 */
import { createLogger } from './logging';

const logger = createLogger('Performance');

// Enable detailed metrics only in development or when performance tracing is enabled
const shouldTrackDetailed = 
  process.env.NODE_ENV === 'development' || 
  process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_TRACING === 'true';

// Maximum number of metrics to store to prevent memory issues
const MAX_METRICS = 1000;

interface PerformanceMetric {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private activeOperations: Map<string, PerformanceMetric> = new Map();
  
  /**
   * Start tracking an operation
   * @param operation Name of the operation to track
   * @param metadata Additional data to store with the metric
   * @returns A unique identifier for the operation
   */
  startOperation(operation: string, metadata?: Record<string, any>): string {
    const id = `${operation}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const metric: PerformanceMetric = {
      operation,
      startTime: performance.now(),
      metadata
    };
    
    this.activeOperations.set(id, metric);
    
    if (shouldTrackDetailed) {
      logger.debug(`Started operation: ${operation}`, metadata);
    }
    
    return id;
  }
  
  /**
   * End tracking an operation and record its duration
   * @param id The operation identifier returned from startOperation
   * @param additionalMetadata Additional metadata to add to the operation
   * @returns The duration of the operation in milliseconds, or -1 if not found
   */
  endOperation(id: string, additionalMetadata?: Record<string, any>): number {
    const metric = this.activeOperations.get(id);
    if (!metric) {
      logger.warn(`Attempted to end unknown operation with id: ${id}`);
      return -1;
    }
    
    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    
    // Merge any additional metadata
    if (additionalMetadata) {
      metric.metadata = {
        ...(metric.metadata || {}),
        ...additionalMetadata
      };
    }
    
    // Store the completed metric, but limit the size to prevent memory issues
    this.metrics.push(metric);
    if (this.metrics.length > MAX_METRICS) {
      this.metrics = this.metrics.slice(-MAX_METRICS);
      if (shouldTrackDetailed) {
        logger.debug(`Pruned metrics array to ${MAX_METRICS} items to prevent memory issues`);
      }
    }
    
    this.activeOperations.delete(id);
    
    if (shouldTrackDetailed || metric.duration > 1000) {
      logger.info(
        `Operation complete: ${metric.operation} took ${metric.duration.toFixed(2)}ms`, 
        metric.metadata
      );
    }
    
    return metric.duration;
  }
  
  /**
   * Get metrics for a specific operation
   * @param operation Name of the operation to get metrics for
   * @returns Array of metrics for the operation
   */
  getMetricsForOperation(operation: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.operation === operation);
  }
  
  /**
   * Get all recorded metrics
   */
  getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
  
  /**
   * Clear all recorded metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }
  
  /**
   * Get performance statistics
   */
  getStatistics(): Record<string, { 
    count: number; 
    totalDuration: number; 
    averageDuration: number;
    minDuration: number;
    maxDuration: number;
  }> {
    const stats: Record<string, {
      count: number;
      totalDuration: number;
      averageDuration: number;
      minDuration: number;
      maxDuration: number;
    }> = {};
    
    this.metrics.forEach(metric => {
      if (!metric.duration) return;
      
      if (!stats[metric.operation]) {
        stats[metric.operation] = {
          count: 0,
          totalDuration: 0,
          averageDuration: 0,
          minDuration: Infinity,
          maxDuration: -Infinity
        };
      }
      
      const opStats = stats[metric.operation];
      opStats.count++;
      opStats.totalDuration += metric.duration;
      opStats.minDuration = Math.min(opStats.minDuration, metric.duration);
      opStats.maxDuration = Math.max(opStats.maxDuration, metric.duration);
      opStats.averageDuration = opStats.totalDuration / opStats.count;
    });
    
    return stats;
  }
}

// Export a singleton instance
export const performanceMonitor = new PerformanceMonitor(); 