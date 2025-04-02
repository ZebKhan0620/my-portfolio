"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAdminAuth from '@/hooks/useAdminAuth';
import Head from 'next/head';

// Admin dashboard component for site management
export default function AdminDashboard() {
  const { isAdmin, isLoading, logout } = useAdminAuth();
  const router = useRouter();
  const [logoutInProgress, setLogoutInProgress] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, isLoading, router]);

  const handleLogout = async () => {
    setLogoutInProgress(true);
    await logout();
    setLogoutInProgress(false);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Verifying credentials...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (isAdmin) {
    return (
      <>
        <Head>
          <title>Admin Dashboard</title>
        </Head>
        <div className="min-h-screen bg-gray-900">
          {/* Header */}
          <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center">
                    <div className="h-8 w-8 bg-emerald-500 rounded-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-2 text-white font-semibold text-lg">Admin Portal</span>
                  </div>
                  
                  {/* Back to Portfolio link */}
                  <Link 
                    href="/" 
                    className="ml-6 flex items-center text-gray-300 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span className="font-medium">Back to Portfolio</span>
                  </Link>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    disabled={logoutInProgress}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-600 text-sm leading-5 font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-indigo active:bg-gray-700 transition ease-in-out duration-150"
                  >
                    {logoutInProgress ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging out...
                      </>
                    ) : (
                      <>
                        <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm1 2h10v10H4V5zm4 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        Logout
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
              
              {/* Admin sections */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Advice Wall Management */}
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700/50 transition-all duration-300 hover:shadow-emerald-900/10 hover:border-gray-600/50">
                  <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-semibold text-white">Advice Wall</h2>
                        <p className="text-gray-400 text-sm mt-1">Manage advice submissions from visitors</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-6">View, approve, or remove advice submissions. Maintain the advice wall content and moderate user submissions.</p>
                    <Link 
                      href="/admin/advice" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-gray-800"
                    >
                      Manage Advice
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Contact Submissions */}
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700/50 transition-all duration-300 hover:shadow-emerald-900/10 hover:border-gray-600/50">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-semibold text-white">Contact Messages</h2>
                        <p className="text-gray-400 text-sm mt-1">Manage contact form submissions</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-6">Review and respond to messages sent through your contact form. Handle inquiries from visitors and potential clients.</p>
                    <Link 
                      href="/admin/contact" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
                    >
                      View Messages
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
                
                {/* Visitor Statistics */}
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700/50 transition-all duration-300 hover:shadow-emerald-900/10 hover:border-gray-600/50">
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-semibold text-white">Visitor Statistics</h2>
                        <p className="text-gray-400 text-sm mt-1">Track website visitor counts</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-6">Monitor the number of visitors to your portfolio, view milestone achievements, and manage visitor counter settings.</p>
                    <Link 
                      href="/admin/stats" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-800"
                    >
                      View Statistics
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* System status section */}
              <div className="mt-8 bg-gray-800/60 rounded-lg p-6 border border-gray-700/30">
                <h2 className="text-lg font-medium text-white mb-4">System Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/30">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-green-500/20 text-green-400 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-200">Database Connection</p>
                        <p className="text-xs text-gray-400">Connected & active</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/30">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-green-500/20 text-green-400 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-200">Authentication</p>
                        <p className="text-xs text-gray-400">Active session</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/30">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-green-500/20 text-green-400 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-200">API Services</p>
                        <p className="text-xs text-gray-400">All services operational</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          
          {/* Footer */}
          <footer className="bg-gray-800 border-t border-gray-700 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-400">
                Admin Dashboard © {new Date().getFullYear()} | Portfolio Admin Panel
              </p>
            </div>
          </footer>
        </div>
      </>
    );
  }

  // Fallback while redirecting - should not be visible long
  return null;
} 