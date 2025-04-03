'use client';

import React from 'react';

interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'light';
  className?: string;
  message?: string;
}

/**
 * Loading indicator component to display during async operations
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'medium',
  color = 'primary',
  className = '',
  message
}) => {
  // Calculate spinner size
  const spinnerSize = {
    small: 'w-4 h-4 border-2',
    medium: 'w-6 h-6 border-2',
    large: 'w-8 h-8 border-3'
  }[size];
  
  // Calculate color styles
  const spinnerColor = {
    primary: 'border-t-emerald-500',
    secondary: 'border-t-indigo-500',
    light: 'border-t-white'
  }[color];
  
  const textColor = {
    primary: 'text-emerald-500',
    secondary: 'text-indigo-500',
    light: 'text-white'
  }[color];
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className={`rounded-full border-gray-300/30 ${spinnerSize} ${spinnerColor} animate-spin`} 
        style={{ borderRightColor: 'transparent' }}
        role="status"
        aria-label="Loading"
      />
      {message && <span className={`text-sm ${textColor}`}>{message}</span>}
    </div>
  );
};

export default LoadingIndicator; 