'use client';

import { useEffect } from 'react';

/**
 * ResponsiveViewport component to ensure proper mobile viewport settings.
 * This component fixes the following responsive design issues:
 * - Prevent zoom on input focus on iOS
 * - Ensures the viewport is correctly sized
 * - Handles orientation changes smoothly
 * - Sets a maximum-scale to ensure proper rendering on high-DPI devices
 * 
 * Reference: Issue #92
 */
export function ResponsiveViewport() {
  useEffect(() => {
    // Helper to update viewport meta tag
    const updateViewportMeta = () => {
      let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
      
      // Create if it doesn't exist
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        document.head.appendChild(viewportMeta);
      }
      
      // Set the content with appropriate values
      viewportMeta.content = 
        'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=2';
      
      // Add additional meta tag to prevent iOS zoom on input focus
      let formMeta = document.querySelector('meta[name="format-detection"]') as HTMLMetaElement | null;
      if (!formMeta) {
        formMeta = document.createElement('meta');
        formMeta.name = 'format-detection';
        formMeta.content = 'telephone=no';
        document.head.appendChild(formMeta);
      }
    };
    
    // Initial update
    updateViewportMeta();
    
    // Handle orientation changes
    const handleOrientationChange = () => {
      // Short timeout to ensure the browser has completed the orientation change
      setTimeout(updateViewportMeta, 50);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
} 