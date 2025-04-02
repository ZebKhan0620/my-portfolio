"use client"

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing login
  useEffect(() => {
    const checkExistingLogin = async () => {
      try {
        const response = await fetch('/api/admin/auth/check', {
          credentials: 'include'
        });
        
        if (response.ok) {
          // Already logged in, redirect to admin
          window.location.href = '/admin';
        }
      } catch (error) {
        // Silent fail - will just stay on login page
        console.error('Auth check error:', error);
      }
    };
    
    checkExistingLogin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !password.trim()) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store admin key in localStorage for API requests
      localStorage.setItem('adminKey', password);
      
      // Show brief success message
      setPassword('');
      setIsLoading(false);

      // Redirect to admin dashboard with a small delay for better UX
      setTimeout(() => {
        window.location.href = '/admin';
      }, 300);
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        {/* Back to Portfolio button */}
        <Link 
          href="/" 
          className="fixed top-4 left-4 flex items-center bg-gray-800/70 hover:bg-gray-700/80 text-white px-3 py-2 rounded-lg shadow-lg border border-gray-700/50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Portfolio
        </Link>
        
        <div className="w-full max-w-md">
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-blue-600/5 z-0"></div>
            
            {/* Glass effect divider */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/20 via-emerald-500/80 to-emerald-500/20"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white ml-3">Admin Access</h1>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                      placeholder="Enter your admin password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !password.trim()}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 relative overflow-hidden shadow-lg ${
                    isLoading || !password.trim()
                      ? 'bg-gray-600 cursor-not-allowed opacity-70'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400'
                  }`}
                >
                  <span className={`flex items-center justify-center ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    Login to Dashboard
                  </span>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              </form>
              
              <div className="mt-6 text-center text-xs text-gray-500">
                <p>Secure admin access for authorized personnel only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 