"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    
    // Also check localStorage for adminKey as a backup
    const adminKey = localStorage.getItem('adminKey');
    if (adminKey) {
      // If we have an admin key, we'll consider the user authenticated
      // The actual API requests will verify if this key is valid
      setIsAuthenticated(true);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/check', {
        credentials: 'include' // Important: Include cookies in the request
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsChecking(false);
    }
  };

  const login = async (password: string) => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: Include cookies in the request
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      // Store the admin key for API requests
      localStorage.setItem('adminKey', password);
      setIsAuthenticated(true);
      
      // Wait a moment before redirecting to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/admin');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
        credentials: 'include' // Important: Include cookies in the request
      });
      
      // Clear the admin key
      localStorage.removeItem('adminKey');
      setIsAuthenticated(false);
      
      // Wait a moment before redirecting to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/admin/login');
    } catch (error) {
      // Silent fail - user will see they're still logged in if it fails
    }
  };

  // Show nothing while checking authentication
  if (isChecking) {
    return null;
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
} 