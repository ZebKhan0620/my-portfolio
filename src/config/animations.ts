/**
 * Animation Configuration
 * 
 * This file contains the configuration for animations used across the application.
 */

// Animation Types
export type AnimationDirection = 'clockwise' | 'counter-clockwise';
export type OrbitPath = 'circular' | 'elliptical';
export type Duration = `${number}s` | `${number}ms`;
export type EasingFunction = 
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'cubic-bezier'
  | CustomEasing;

// Custom easing functions as CSS cubic-bezier values
export type CustomEasing = 
  | 'elastic'
  | 'bounce'
  | 'smooth'
  | 'sharp'
  | 'gentle'
  | `cubic-bezier(${number}, ${number}, ${number}, ${number})`;

// Animation Defaults
export const DEFAULT_ANIMATION_CONFIG = {
  // Duration defaults
  durations: {
    orbit: {
      slow: '48s' as Duration,
      medium: '36s' as Duration,
      fast: '24s' as Duration,
    },
    spin: {
      slow: '8s' as Duration,
      medium: '4s' as Duration,
      fast: '2s' as Duration,
    },
    entrance: {
      slow: '1.2s' as Duration,
      medium: '0.8s' as Duration,
      fast: '0.4s' as Duration,
    },
  },
  
  // Easing functions mapped to CSS values
  easings: {
    // Standard easings
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    
    // Custom easings as cubic-bezier
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.45, 0, 0.55, 1)',
    sharp: 'cubic-bezier(0.33, 1, 0.68, 1)',
    gentle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
};

/**
 * Get CSS value for custom easing
 * 
 * @param easing Easing function name
 * @returns CSS easing value
 */
export const getEasingValue = (easing: EasingFunction): string => {
  // If it's a standard CSS easing or starts with cubic-bezier, return as is
  if (
    easing === 'linear' || 
    easing === 'ease' || 
    easing === 'ease-in' || 
    easing === 'ease-out' || 
    easing === 'ease-in-out' ||
    easing.startsWith('cubic-bezier')
  ) {
    return easing;
  }
  
  // Otherwise, look up in our custom easings
  const customEasing = DEFAULT_ANIMATION_CONFIG.easings[easing as keyof typeof DEFAULT_ANIMATION_CONFIG.easings];
  return customEasing || 'ease'; // Fallback to ease if not found
};

/**
 * Get predefined duration value
 * 
 * @param type Animation type (orbit, spin, entrance)
 * @param speed Speed tier (slow, medium, fast)
 * @returns Duration string
 */
export const getDuration = (
  type: 'orbit' | 'spin' | 'entrance',
  speed: 'slow' | 'medium' | 'fast'
): Duration => {
  return DEFAULT_ANIMATION_CONFIG.durations[type][speed];
};

/**
 * Define orbit configuration types to ensure consistency
 */
export interface OrbitConfig {
  size: number;
  rotation: number;
  shouldOrbit: boolean;
  orbitDuration: Duration;
  shouldSpin?: boolean;
  spinDuration?: Duration;
  animationDirection?: AnimationDirection;
  path?: OrbitPath;
  horizontalStretch?: number;
  verticalStretch?: number;
  easing?: EasingFunction;
  spinEasing?: EasingFunction;
  pauseOnHover?: boolean;
  interactive?: boolean;
  opacity?: number;
}

/**
 * Get orbit configurations for different screen sizes
 * 
 * @returns Animation configurations grouped by screen size
 */
export const getResponsiveOrbitConfigs = () => {
  return {
    // Base orbits for all screen sizes
    base: [
      {
        size: 430,
        rotation: -14,
        shouldOrbit: true,
        orbitDuration: "30s" as Duration,
        shouldSpin: true,
        spinDuration: "3s" as Duration,
        easing: 'linear' as EasingFunction,
        spinEasing: 'linear' as EasingFunction,
      } as OrbitConfig,
      {
        size: 550,
        rotation: 20,
        shouldOrbit: true,
        orbitDuration: "38s" as Duration,
        shouldSpin: true,
        spinDuration: "6s" as Duration,
        animationDirection: 'clockwise' as AnimationDirection,
        easing: 'linear' as EasingFunction,
        spinEasing: 'linear' as EasingFunction,
      } as OrbitConfig,
    ],
    
    // Medium-sized screen orbits
    medium: [
      {
        size: 600,
        rotation: -5,
        shouldOrbit: true,
        orbitDuration: "42s" as Duration,
        path: 'elliptical' as OrbitPath,
        horizontalStretch: 1.2,
        verticalStretch: 0.8,
        easing: 'linear' as EasingFunction,
      } as OrbitConfig,
      {
        size: 590,
        rotation: 98,
        shouldOrbit: true,
        orbitDuration: "40s" as Duration,
        shouldSpin: true,
        spinDuration: "6s" as Duration,
        easing: 'linear' as EasingFunction,
        spinEasing: 'linear' as EasingFunction,
      } as OrbitConfig,
    ],
    
    // Large screen orbits
    large: [
      {
        size: 800,
        rotation: -72,
        shouldOrbit: true,
        orbitDuration: "48s" as Duration,
        shouldSpin: true,
        spinDuration: "6s" as Duration,
        easing: 'linear' as EasingFunction,
        spinEasing: 'linear' as EasingFunction,
      } as OrbitConfig,
      {
        size: 720,
        rotation: 144,
        shouldOrbit: true,
        orbitDuration: "46s" as Duration,
        easing: 'linear' as EasingFunction,
      } as OrbitConfig,
      {
        size: 520,
        rotation: -41,
        shouldOrbit: true,
        orbitDuration: "36s" as Duration,
        shouldSpin: true,
        spinDuration: "3s" as Duration,
        easing: 'linear' as EasingFunction,
        spinEasing: 'linear' as EasingFunction,
      } as OrbitConfig,
    ],
  };
}; 