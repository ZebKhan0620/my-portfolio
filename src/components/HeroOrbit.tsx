'use client';

import { PropsWithChildren, useEffect, useRef, useState, memo } from "react";
import { twMerge } from "tailwind-merge";
import { 
  AnimationDirection, 
  Duration, 
  EasingFunction, 
  OrbitPath,
  getEasingValue
} from "@/config/animations";

interface HeroOrbitProps {
  // Core props
  size: number;
  rotation: number;
  
  // Animation controls
  shouldOrbit?: boolean;
  shouldSpin?: boolean;
  spinDuration?: Duration;
  orbitDuration?: Duration;
  pauseOnHover?: boolean;
  animateOnVisible?: boolean;
  animationDirection?: AnimationDirection;
  
  // Easing functions
  easing?: EasingFunction;
  spinEasing?: EasingFunction;
  
  // Visual customization
  path?: OrbitPath;
  horizontalStretch?: number;
  verticalStretch?: number;
  opacity?: number;
  
  // Interaction
  interactive?: boolean;
  onClick?: () => void;
  
  // Accessibility
  isDecorative?: boolean;
  description?: string;
}

/**
 * Orbital component that positions elements in an orbital path around a center point.
 * Supports circular and elliptical paths, variable speeds, custom animations, and more.
 * Optimized for performance and accessibility.
 */
const HeroOrbitBase = ({
  children,
  size,
  rotation,
  shouldOrbit = false,
  shouldSpin = false,
  spinDuration = "3s",
  orbitDuration = "30s",
  pauseOnHover = false,
  animateOnVisible = true,
  animationDirection = 'clockwise',
  easing = 'ease',
  spinEasing = 'linear',
  path = 'circular',
  horizontalStretch = 1,
  verticalStretch = 1,
  opacity = 1,
  interactive = false,
  onClick,
  isDecorative = true,
  description = "Decorative orbital element",
}: PropsWithChildren<HeroOrbitProps>) => {
  const orbitRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!animateOnVisible);
  const [isPaused, setIsPaused] = useState(false);
  
  // Setup Intersection Observer to detect when orbit is visible
  useEffect(() => {
    if (!animateOnVisible) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );
    
    if (orbitRef.current) {
      observer.observe(orbitRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [animateOnVisible]);
  
  // Calculate width and height based on path type
  const width = path === 'elliptical' 
    ? size * horizontalStretch
    : size;
    
  const height = path === 'elliptical'
    ? size * verticalStretch
    : size;
  
  // Create animation class based on direction
  const animationClass = shouldOrbit && isVisible && !isPaused
    ? animationDirection === 'clockwise'
      ? 'animate-orbit-clockwise'
      : 'animate-orbit-counter'
    : '';
  
  const spinClass = shouldSpin && isVisible && !isPaused
    ? 'animate-spin'
    : '';
  
  // Get CSS easing values
  const orbitEasingValue = getEasingValue(easing);
  const spinEasingValue = getEasingValue(spinEasing);
    
  // Handle mouse interaction
  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true);
  };
  
  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false);
  };
  
  // Handle click if interactive
  const handleClick = () => {
    if (interactive && onClick) onClick();
  };
  
  // Apply reduced motion settings if user prefers
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsPaused(true);
    }
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsPaused(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  return (
    <div
      ref={orbitRef}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ opacity }}
      aria-hidden={isDecorative}
      role={isDecorative ? undefined : 'img'}
      aria-label={isDecorative ? undefined : description}
    >
      <div 
        className={twMerge(animationClass)} 
        style={{
          animationDuration: orbitDuration,
          animationTimingFunction: orbitEasingValue,
          willChange: 'transform',
          transform: isPaused ? `rotate(${rotation}deg)` : undefined
        }}
      >
        <div
          className="flex justify-start items-start"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `rotate(${rotation}deg) translate3d(0,0,0)`,
          }}
        >
          <div 
            className={twMerge(spinClass)} 
            style={{
              animationDuration: spinDuration,
              animationTimingFunction: spinEasingValue,
              willChange: shouldSpin ? 'transform' : 'auto',
              cursor: interactive ? 'pointer' : 'default'
            }}
          >
            <div
              className="inline-flex"
              style={{ transform: `rotate(${rotation * -1}deg) translate3d(0,0,0)` }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom comparison function for memo
function arePropsEqual(prevProps: PropsWithChildren<HeroOrbitProps>, nextProps: PropsWithChildren<HeroOrbitProps>) {
  // Compare each prop that would visually affect the component
  return (
    prevProps.size === nextProps.size &&
    prevProps.rotation === nextProps.rotation &&
    prevProps.shouldOrbit === nextProps.shouldOrbit &&
    prevProps.shouldSpin === nextProps.shouldSpin &&
    prevProps.spinDuration === nextProps.spinDuration &&
    prevProps.orbitDuration === nextProps.orbitDuration &&
    prevProps.easing === nextProps.easing &&
    prevProps.spinEasing === nextProps.spinEasing &&
    prevProps.path === nextProps.path &&
    prevProps.horizontalStretch === nextProps.horizontalStretch &&
    prevProps.verticalStretch === nextProps.verticalStretch &&
    prevProps.opacity === nextProps.opacity &&
    prevProps.interactive === nextProps.interactive &&
    prevProps.isDecorative === nextProps.isDecorative &&
    prevProps.description === nextProps.description
  );
}

// Export the memoized version of the component
export const HeroOrbit = memo(HeroOrbitBase, arePropsEqual);
