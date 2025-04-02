"use client"

import { useState, useEffect } from 'react';

interface VisitorCounterState {
  count: number;
  isMilestone: boolean;
  loading: boolean;
  error: string | null;
}

export function useVisitorCounter() {
  const [state, setState] = useState<VisitorCounterState>({
    count: 0,
    isMilestone: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    const incrementVisitorCount = async () => {
      try {
        // Check if this browser has already been counted in this session
        const hasVisited = sessionStorage.getItem('hasVisited');
        
        if (hasVisited) {
          // If already visited, just get the current count without incrementing
          const response = await fetch('/api/visitor');
          if (!response.ok) throw new Error('Failed to fetch visitor count');
          const data = await response.json();
          
          setState({
            count: data.count,
            isMilestone: data.isMilestone,
            loading: false,
            error: null
          });
          
          return;
        }
        
        // If first visit in this session, increment the counter
        const response = await fetch('/api/visitor', { method: 'POST' });
        if (!response.ok) throw new Error('Failed to increment visitor count');
        
        const data = await response.json();
        
        // Mark this browser as counted in this session
        sessionStorage.setItem('hasVisited', 'true');
        
        setState({
          count: data.count,
          isMilestone: data.isMilestone,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Visitor counter error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        }));
      }
    };

    incrementVisitorCount();
  }, []);

  return state;
} 