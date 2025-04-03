import { ReactNode } from 'react';

interface DevOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component that only renders its children in development mode
 * Use this to wrap development-only components that should be excluded from production
 */
export default function DevOnly({ children, fallback = null }: DevOnlyProps) {
  // Check if we're in development mode
  // This will be evaluated at build time in production and the component will be tree-shaken
  if (process.env.NODE_ENV !== 'development') {
    return <>{fallback}</>;
  }

  return <>{children}</>;
} 