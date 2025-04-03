'use client';

import React from 'react';
import DevOnly from './dev/DevOnly';
import dynamic from 'next/dynamic';

// Dynamically import DevTools to avoid bundling in production
const DevTools = dynamic(() => import('./DevTools'), { ssr: false });

// This component renders DevTools only in development mode
export default function ConditionalDevTools() {
  return (
    <DevOnly>
      <DevTools />
    </DevOnly>
  );
} 