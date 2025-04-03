'use client';

import React, { useState, useEffect } from 'react';

interface ErrorNotificationProps {
  message: string;
  onDismiss?: () => void;
  timeout?: number;
  severity?: 'error' | 'warning' | 'info';
}

export default function ErrorNotification({
  message,
  onDismiss,
  timeout,
  severity = 'error'
}: ErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  // Auto-dismiss if timeout is provided
  useEffect(() => {
    if (timeout && timeout > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [timeout, onDismiss]);
  
  // Handle manual dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };
  
  if (!isVisible) return null;
  
  // Determine background color based on severity
  const bgColor = {
    error: 'bg-red-900/80 border-red-700',
    warning: 'bg-amber-900/80 border-amber-700',
    info: 'bg-blue-900/80 border-blue-700'
  }[severity];
  
  // Determine icon based on severity
  const icon = {
    error: '⚠️',
    warning: '⚠️',
    info: 'ℹ️'
  }[severity];
  
  return (
    <div 
      className={`fixed top-4 right-4 z-50 rounded-lg shadow-lg border ${bgColor} text-white p-4 max-w-md flex items-start transition-opacity duration-300`}
      role="alert"
    >
      <div className="mr-2 text-lg">{icon}</div>
      <div className="flex-1">
        <div className="font-medium mb-1">
          {severity === 'error' ? 'Error' : severity === 'warning' ? 'Warning' : 'Information'}
        </div>
        <div className="text-sm opacity-90">{message}</div>
      </div>
      <button 
        onClick={handleDismiss}
        className="ml-4 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
} 