'use client';

import Image, { ImageProps } from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  lowQualityPlaceholder?: boolean;
  withBlurEffect?: boolean;
  loadPriority?: 'high' | 'low' | 'auto';
}

/**
 * An optimized image component that enhances Next.js Image with:
 * - Automatic lazy loading based on viewport visibility
 * - Loading priority management based on importance
 * - Low quality image placeholders
 * - Loading states with blur effects
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  lowQualityPlaceholder = false,
  withBlurEffect = false,
  loadPriority = 'auto',
  sizes = '100vw',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px', // Start loading 200px before it appears in viewport
  });

  // Determine if this image should be prioritized
  const shouldPrioritize = 
    loadPriority === 'high' || 
    (loadPriority === 'auto' && (
      // Auto-prioritize images at the top of the page
      typeof window !== 'undefined' && 
      typeof height === 'number' && 
      window.innerHeight * 1.5 > height
    ));

  // Calculate the quality based on device DPR and image size
  const getQuality = () => {
    if (typeof window === 'undefined') return 75; // Default on server
    
    // Higher quality for larger images and higher DPR
    const dpr = window.devicePixelRatio || 1;
    const viewportWidth = window.innerWidth;
    
    if (dpr > 1 && viewportWidth > 1024) return 85;
    if (viewportWidth < 640) return 70; // Lower quality on mobile
    return 75; // Default quality
  };
  
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className || ''}`}
      style={{ 
        opacity: isLoaded ? 1 : 0.8,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      {(inView || shouldPrioritize) && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          quality={getQuality()}
          priority={shouldPrioritize}
          loading={shouldPrioritize ? 'eager' : 'lazy'}
          onLoadingComplete={() => setIsLoaded(true)}
          placeholder={lowQualityPlaceholder ? 'blur' : undefined}
          className={`
            ${withBlurEffect && !isLoaded ? 'blur-sm' : 'blur-0'}
            transition-all duration-300
          `}
          {...props}
        />
      )}
    </div>
  );
} 