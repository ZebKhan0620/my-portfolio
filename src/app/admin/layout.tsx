'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <AdminAuthProvider>
      <div className="flex min-h-screen bg-gray-900 text-white">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-20">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-gray-800 rounded-md"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Sidebar */}
        <div className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 fixed lg:static top-0 left-0 h-full w-64 bg-gray-800 p-4 z-10
        `}>
          <div className="flex flex-col h-full">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-emerald-400">Admin Panel</h1>
            </div>
            
            <nav className="flex-1">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/admin/contacts" 
                    className={`
                      flex items-center p-2 rounded-md transition-colors
                      ${isActive('/admin/contacts') 
                        ? 'bg-emerald-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                      }
                    `}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 mr-3" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                      />
                    </svg>
                    Contact Submissions
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/projects" 
                    className={`
                      flex items-center p-2 rounded-md transition-colors
                      ${isActive('/admin/projects') 
                        ? 'bg-emerald-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                      }
                    `}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 mr-3" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                      />
                    </svg>
                    Projects
                  </Link>
                </li>
              </ul>
            </nav>
            
            <div className="mt-auto">
              <Link 
                href="/"
                className="flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                  />
                </svg>
                Return to Portfolio
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthProvider>
  );
} 