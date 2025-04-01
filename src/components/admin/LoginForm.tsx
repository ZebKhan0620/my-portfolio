'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function LoginForm() {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = () => {
    if (!login(password)) {
      setError('Invalid password');
    }
  };
  
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          autoFocus
        />
      </div>
      
      <button
        onClick={handleLogin}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors"
      >
        Login
      </button>
      
      <div className="mt-4 text-sm text-gray-400">
        <Link href="/" className="text-emerald-400 hover:underline">
          Return to Portfolio
        </Link>
      </div>
    </div>
  );
} 