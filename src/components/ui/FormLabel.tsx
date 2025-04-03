import React from 'react';

interface FormLabelProps {
  htmlFor: string;
  label: string;
  required?: boolean;
  hideLabel?: boolean;
  tooltip?: string;
  className?: string;
}

/**
 * Accessible form label component that adheres to best practices:
 * - Properly associates labels with form controls
 * - Handles visually hidden labels
 * - Marks required fields with appropriate indicators
 * - Provides tooltip functionality for complex fields
 * 
 * Reference: Issue #93
 */
export function FormLabel({
  htmlFor,
  label,
  required = false,
  hideLabel = false,
  tooltip,
  className = '',
}: FormLabelProps) {
  return (
    <div className="flex items-center gap-1 mb-1.5">
      <label
        htmlFor={htmlFor}
        className={`
          ${hideLabel ? 'sr-only' : ''}
          text-sm font-medium text-white/80
          ${className}
        `}
        {...(tooltip ? { 'aria-describedby': `${htmlFor}-tooltip` } : {})}
      >
        {label}
        {required && (
          <span
            className="text-red-400 ml-1"
            aria-hidden="true"
          >
            *
          </span>
        )}
        {required && (
          <span className="sr-only"> (Required)</span>
        )}
      </label>
      
      {tooltip && (
        <div className="relative group">
          <div 
            className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white cursor-help"
            aria-hidden="true"
          >
            ?
          </div>
          
          <div
            id={`${htmlFor}-tooltip`}
            role="tooltip"
            className="
              absolute z-10 bottom-full mb-2 left-1/2 -translate-x-1/2
              w-48 p-2 bg-gray-800 text-xs text-white/90 rounded shadow-lg
              pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity
              before:content-[''] before:absolute before:left-1/2 before:-bottom-1 before:-translate-x-1/2
              before:border-4 before:border-transparent before:border-t-gray-800
            "
          >
            {tooltip}
          </div>
        </div>
      )}
    </div>
  );
} 