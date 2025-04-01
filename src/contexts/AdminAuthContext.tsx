'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  ReactNode 
} from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  adminKey: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Use admin password from environment variable
// The default fallback is only used if the environment variable is not set
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Khanzeb@@122';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState<string | null>(null);
  
  const login = (password: string): boolean => {
    console.log('Attempting login with password');
    if (password === ADMIN_PASSWORD) {
      console.log('Admin authentication successful');
      setIsAuthenticated(true);
      setAdminKey(password);
      return true;
    }
    console.log('Admin authentication failed');
    return false;
  };
  
  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, adminKey }}>
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