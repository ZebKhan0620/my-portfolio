/**
 * Logging utility for the application
 * Provides structured logging with different levels
 */

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';

// Check if server-side tracing is enabled (for production diagnostics)
const isServerTracing = process.env.NEXT_PUBLIC_ENABLE_TRACING === 'true';

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Format a date in a performant ISO-like format
 * This is more efficient than using toISOString()
 */
function formatDate(date: Date): string {
  const pad = (num: number): string => (num < 10 ? `0${num}` : `${num}`);
  
  return (
    date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    '.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5)
  );
}

/**
 * Logger class for structured logging
 */
export class Logger {
  private source: string;
  private logToServer: boolean;

  constructor(source: string, logToServer = false) {
    this.source = source;
    this.logToServer = logToServer && isServerTracing;
  }

  /**
   * Format a log message with metadata
   */
  private formatLog(level: LogLevel, message: string, data?: any): string {
    const timestamp = formatDate(new Date());
    const dataStr = data ? ` :: ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${this.source}] ${message}${dataStr}`;
  }

  /**
   * Log a debug message (development only)
   */
  debug(message: string, data?: any): void {
    if (isDevelopment || this.logToServer) {
      console.debug(this.formatLog(LogLevel.DEBUG, message, data));
    }
  }

  /**
   * Log an info message (development or server tracing only)
   */
  info(message: string, data?: any): void {
    if (isDevelopment || this.logToServer) {
      console.info(this.formatLog(LogLevel.INFO, message, data));
    }
  }

  /**
   * Log a warning message (development or server tracing only)
   */
  warn(message: string, data?: any): void {
    if (isDevelopment || this.logToServer) {
      console.warn(this.formatLog(LogLevel.WARN, message, data));
    }
  }

  /**
   * Log an error message (always logged)
   */
  error(message: string, error?: any, data?: any): void {
    const errorData = error 
      ? { message: error.message, stack: error.stack, ...data }
      : data;
    console.error(this.formatLog(LogLevel.ERROR, message, errorData));
    
    // If you're using an error monitoring service like Sentry,
    // you would log errors there as well
  }
}

/**
 * Create a new logger for a specific source
 * @param source The source identifier for the logger
 * @param logToServer Whether to log to server in production when tracing is enabled
 */
export function createLogger(source: string, logToServer = false): Logger {
  return new Logger(source, logToServer);
} 