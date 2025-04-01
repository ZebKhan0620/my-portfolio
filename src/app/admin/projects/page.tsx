'use client';

import { useAdminAuth } from '@/contexts/AdminAuthContext';
import LoginForm from '@/components/admin/LoginForm';

export default function AdminProjectsPage() {
  const { isAuthenticated } = useAdminAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Projects Management</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <p className="text-gray-400 mb-4">Projects management functionality coming soon!</p>
        <p className="text-sm text-gray-500">This feature is under development.</p>
      </div>
    </div>
  );
} 