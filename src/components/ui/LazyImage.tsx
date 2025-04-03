'use client';

import { useState, useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';

interface LazyImageProps extends Omit<ImageProps, 'onLoad'> {
  threshold?: number;
  rootMargin?: string;
  fallback?: React.ReactNode;
  loadingAnimation?: boolean;
  withBlurEffect?: boolean;
}

/**
 * A fully featured lazy loading image component using Intersection Observer.
 * This component implements Issue #96 by providing:
 * - True lazy loading for performance optimization
 * - Customizable placeholder while loading
 * - Configurable IntersectionObserver options
 * - Loading animations with fade-in effects
 * - Blur-up effect for image loading
 */
export default function LazyImage({
  src,
  alt,
  width,
  height,
  sizes,
  quality,
  priority,
  placeholder,
  className,
  style,
  threshold = 0.1,
  rootMargin = '100px 0px',
  fallback,
  loadingAnimation = true,
  withBlurEffect = false,
  ...props
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Skip if image is marked as priority
    if (priority) {
      setIsVisible(true);
      return;
    }
    
    // Set up the intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    
    // Start observing the image container
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    // Clean up on unmount
    return () => {
      observer.disconnect();
    };
  }, [priority, threshold, rootMargin]);
  
  // Handle image load complete
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  // Set up the animation classes
  const animationClass = loadingAnimation && !isLoaded
    ? 'opacity-0'
    : 'opacity-100 transition-opacity duration-500';
  
  const blurClass = withBlurEffect && !isLoaded
    ? 'blur-sm'
    : 'blur-0 transition-all duration-500';
  
  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className || ''}`}
      style={style}
    >
      {/* Show a spinner or placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/20">
          {fallback || (
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      )}
      
      {/* Only render the image when it's visible */}
      {(isVisible || priority) && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          sizes={sizes}
          onLoad={handleImageLoad}
          priority={priority}
          placeholder={placeholder}
          className={`${animationClass} ${blurClass}`}
          {...props}
        />
      )}
    </div>
  );
} 