import { useState, useEffect } from 'react';

interface UseAdminAuthReturn {
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export default function useAdminAuth(): UseAdminAuthReturn {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/check', {
          credentials: 'include'
        });
        
        setIsAdmin(response.ok);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
        credentials: 'include'
      });
      
      // Clear local storage
      localStorage.removeItem('adminKey');
      
      // Update state
      setIsAdmin(false);
      
      // Redirect to login page
      window.location.href = '/admin/login';
    } catch (error) {
      throw error;
    }
  };

  return { isAdmin, isLoading, logout };
} 