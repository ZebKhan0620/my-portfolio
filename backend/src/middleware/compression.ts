import compression from 'compression';
import { Request, Response } from 'express';

// This function determines whether to compress response based on content type and size
const shouldCompress = (req: Request, res: Response) => {
  // Don't compress responses with this request header
  if (req.headers['x-no-compression']) {
    return false;
  }
  
  // Skip compressing for small payloads
  // For small responses, compression might actually increase the size
  const threshold = 1024; // 1KB threshold
  if (res.getHeader('Content-Length') && 
      parseInt(res.getHeader('Content-Length') as string, 10) < threshold) {
    return false;
  }
  
  // Use compression
  return true;
};

// Export configured compression middleware
export const compressionMiddleware = compression({
  // Compression level (1-9, where 9 is maximum compression)
  level: 6,
  // Only compress responses > ~1KB
  threshold: 1024,
  // Custom filter function
  filter: shouldCompress,
}); 