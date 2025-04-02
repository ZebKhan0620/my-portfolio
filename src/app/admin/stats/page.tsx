"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminStatsPage() {
  const [visitorStats, setVisitorStats] = useState({
    count: 0,
    loading: true,
    error: null as string | null
  });
  const [isResetting, setIsResetting] = useState(false);
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchVisitorStats();
  }, []);

  const fetchVisitorStats = async () => {
    try {
      const response = await fetch('/api/visitor');
      if (!response.ok) throw new Error('Failed to fetch visitor stats');
      
      const data = await response.json();
      setVisitorStats({
        count: data.count,
        loading: false,
        error: null
      });
    } catch (error) {
      setVisitorStats(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  const resetVisitorCount = async () => {
    if (!window.confirm('Are you sure you want to reset the visitor count to 0? This action cannot be undone.')) {
      return;
    }

    setIsResetting(true);
    try {
      const adminKey = localStorage.getItem('adminKey');
      const response = await fetch('/api/admin/reset-visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || ''
        }
      });

      if (!response.ok) throw new Error('Failed to reset visitor count');
      
      await fetchVisitorStats();
      setActionMessage({ text: 'Visitor count reset successfully', type: 'success' });
      
      // Clear message after 3 seconds
      setTimeout(() => setActionMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setActionMessage({ 
        text: error instanceof Error ? error.message : 'An unknown error occurred', 
        type: 'error' 
      });
      
      // Clear error message after 3 seconds
      setTimeout(() => setActionMessage({ text: '', type: '' }), 3000);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-xl font-bold text-white">Admin Portal</Link>
            <span className="text-gray-400">|</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-blue-400 bg-clip-text text-transparent">
              Visitor Statistics
            </h1>
          </div>
          <Link 
            href="/" 
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Visitor Counter Statistics</h2>
            
            {actionMessage.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                actionMessage.type === 'success' ? 'bg-green-800/50 border border-green-600' : 'bg-red-800/50 border border-red-600'
              }`}>
                <p className="text-white">{actionMessage.text}</p>
              </div>
            )}
            
            {visitorStats.loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : visitorStats.error ? (
              <div className="bg-red-800/50 p-4 rounded-lg border border-red-600">
                <p className="text-white">Error: {visitorStats.error}</p>
                <button 
                  onClick={fetchVisitorStats}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Visitors</h3>
                      <div className="mt-2 flex items-baseline">
                        <p className="text-5xl font-extrabold bg-gradient-to-r from-emerald-300 to-blue-400 bg-clip-text text-transparent">
                          {visitorStats.count.toLocaleString()}
                        </p>
                        <p className="ml-2 text-sm text-gray-400">visitors</p>
                      </div>
                    </div>
                    <div className="bg-emerald-700/30 p-4 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                  <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Milestones</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {[10, 20, 30, 50, 100, 200, 500, 1000].map(milestone => (
                      <div 
                        key={milestone}
                        className={`rounded-lg p-3 text-center ${
                          visitorStats.count >= milestone 
                            ? 'bg-gradient-to-br from-emerald-600/40 to-blue-600/40 border border-emerald-500/50' 
                            : 'bg-gray-800/50 border border-gray-700/50'
                        }`}
                      >
                        <div className="text-lg font-bold">
                          {milestone.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {visitorStats.count >= milestone ? 'Achieved' : 'Upcoming'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                  <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Admin Actions</h3>
                  <button
                    onClick={resetVisitorCount}
                    disabled={isResetting}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                  >
                    {isResetting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Resetting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        Reset Visitor Counter
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-xs text-gray-400">
                    Warning: This will permanently reset the visitor counter to zero. This action cannot be undone.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 