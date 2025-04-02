"use client"

import { useState, useEffect } from 'react';
import useAdminAuth from '@/hooks/useAdminAuth';
import Link from 'next/link';
import Head from 'next/head';
import Spinner from '@/components/Spinner';

interface AdviceEntry {
  _id: string;
  name: string;
  advice: string;
  timestamp: string | number | Date;
  role?: string;
}

export default function AdminAdvicePage() {
  const { isAdmin, isLoading } = useAdminAuth();
  const [entries, setEntries] = useState<AdviceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<AdviceEntry | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Redirect handling is managed by the useAdminAuth hook

  useEffect(() => {
    if (isAdmin) {
      fetchAdvice();
    }
  }, [isAdmin]);

  const fetchAdvice = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const adminKey = localStorage.getItem('adminKey');
      const response = await fetch('/api/admin/advice', {
        headers: {
          'x-admin-key': adminKey || '',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      console.error('Error fetching advice:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (entry: AdviceEntry) => {
    setEntryToDelete(entry);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!entryToDelete) return;
    
    setDeleteLoading(true);
    try {
      const adminKey = localStorage.getItem('adminKey');
      const response = await fetch(`/api/admin/advice?id=${entryToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete advice entry');
      }

      // Remove the deleted entry from state
      setEntries(entries.filter(item => item._id !== entryToDelete._id));
      setShowDeleteModal(false);
      setEntryToDelete(null);
    } catch (err) {
      console.error('Error deleting advice:', err);
      setError('Failed to delete advice entry. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string | number | Date): string => {
    if (!timestamp) return 'Unknown date';
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state for initial auth check
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

  // Only render content if authenticated
  if (!isAdmin) {
    return null; // The hook will handle redirection
  }

  return (
    <>
      <Head>
        <title>Advice Wall Management</title>
      </Head>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/admin" className="flex-shrink-0 flex items-center text-white hover:text-emerald-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Back to Dashboard
                </Link>
              </div>
              <div className="flex items-center">
                <h1 className="text-lg font-semibold text-white">Advice Wall Management</h1>
              </div>
              <div className="w-40"></div> {/* Empty div for spacing */}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-6 lg:px-8 mb-10">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-xl font-semibold text-white">Advice Wall Entries</h1>
                  <p className="mt-2 text-sm text-gray-400">A list of all advice entries submitted to your portfolio.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <button
                    onClick={fetchAdvice}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-gray-800 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" color="emerald" />
                        <span className="ml-2">Loading...</span>
                      </>
                    ) : (
                      <>
                        <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        Refresh
                      </>
                    )}
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner size="lg" color="emerald" />
                </div>
              ) : error ? (
                <div className="mt-6 bg-red-900/20 border border-red-500/20 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-400">Error loading advice entries</h3>
                      <div className="mt-2 text-sm text-red-300">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-6 overflow-hidden border border-gray-700/50 rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-800">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Advice</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-900/50 divide-y divide-gray-700">
                          {entries.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 text-sm text-center text-gray-400">
                                No advice entries found
                              </td>
                            </tr>
                          ) : (
                            entries.map((entry) => (
                              <tr key={entry._id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{entry.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.role || "-"}</td>
                                <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                                  <div className="line-clamp-2">{entry.advice}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {formatTimestamp(entry.timestamp)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleDeleteClick(entry)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    Found {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20">
                  <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-white">Delete Advice Entry</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">
                      Are you sure you want to delete this advice entry? This action cannot be undone.
                    </p>
                    {entryToDelete && (
                      <div className="mt-3 p-3 bg-gray-700/50 rounded-md border border-gray-600/50 text-left">
                        <p className="text-sm text-gray-400">
                          <span className="font-medium">Name:</span> 
                          <span className="text-white ml-1">{entryToDelete.name}</span>
                        </p>
                        {entryToDelete.role && (
                          <p className="text-sm text-gray-400 mt-1">
                            <span className="font-medium">Role:</span> 
                            <span className="text-white ml-1">{entryToDelete.role}</span>
                          </p>
                        )}
                        <p className="text-sm text-gray-400 mt-1">
                          <span className="font-medium">Date:</span> 
                          <span className="text-white ml-1">{formatTimestamp(entryToDelete.timestamp)}</span>
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          <span className="font-medium">Advice:</span> 
                          <span className="text-white ml-1 block mt-1">{entryToDelete.advice}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 sm:text-sm disabled:opacity-50 transition-colors"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : "Delete"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-gray-800 sm:mt-0 sm:text-sm transition-colors"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setEntryToDelete(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 