'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FormLabel } from './FormLabel';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  hideLabel?: boolean;
  tooltip?: string;
  validation?: {
    pattern?: RegExp;
    errorMessage?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
  sanitize?: boolean;
}

/**
 * SecureInput component that enhances standard input fields with:
 * - Input sanitization to prevent XSS attacks
 * - Client-side validation with accessibility features
 * - Pattern matching and error reporting
 * - Integration with accessible form labels
 * 
 * Reference: Issue #94
 */
export function SecureInput({
  label,
  id,
  hideLabel = false,
  tooltip,
  validation,
  sanitize = true,
  onChange,
  onBlur,
  required,
  className = '',
  ...props
}: SecureInputProps) {
  const [value, setValue] = useState(props.defaultValue?.toString() || props.value?.toString() || '');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Sanitization function to prevent XSS
  const sanitizeInput = (input: string): string => {
    if (!sanitize) return input;
    
    // Basic sanitization to prevent XSS
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  // Validate input against provided validation rules
  const validateInput = (input: string): string | null => {
    if (!validation) return null;
    
    if (validation.required && input.trim() === '') {
      return 'This field is required';
    }
    
    if (validation.minLength && input.length < validation.minLength) {
      return `Minimum length is ${validation.minLength} characters`;
    }
    
    if (validation.maxLength && input.length > validation.maxLength) {
      return `Maximum length is ${validation.maxLength} characters`;
    }
    
    if (validation.pattern && !validation.pattern.test(input)) {
      return validation.errorMessage || 'Invalid format';
    }
    
    return null;
  };
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const sanitizedValue = sanitizeInput(newValue);
    setValue(sanitizedValue);
    
    // Call the parent onChange handler with sanitized value
    if (onChange) {
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: sanitizedValue
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(newEvent);
    }
    
    // Validate on change if already touched
    if (touched) {
      setError(validateInput(sanitizedValue));
    }
  };
  
  // Handle blur event for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    const validationError = validateInput(value);
    setError(validationError);
    
    if (onBlur) {
      onBlur(e);
    }
  };
  
  // Update internal value if controlled component value changes
  useEffect(() => {
    if (props.value !== undefined && props.value !== value) {
      setValue(props.value.toString());
    }
  }, [props.value]);
  
  const errorId = `${id}-error`;
  
  return (
    <div className="mb-4">
      <FormLabel
        htmlFor={id}
        label={label}
        required={!!validation?.required || required}
        hideLabel={hideLabel}
        tooltip={tooltip}
      />
      
      <input
        ref={inputRef}
        id={id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        className={`
          w-full px-3 py-2 rounded-md 
          bg-gray-800 border border-gray-700
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
          transition-colors
          ${error ? 'border-red-500' : 'hover:border-gray-600'}
          ${className}
        `}
        required={validation?.required || required}
        {...props}
      />
      
      {error && (
        <div 
          id={errorId}
          className="mt-1 text-sm text-red-500"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
} 