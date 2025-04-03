'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import dynamic from 'next/dynamic';
import useAdminAuth from '@/hooks/useAdminAuth';

// Dynamically import development tools
const TranslationDebugger = dynamic(() => import('@/components/dev/TranslationDebugger'), { ssr: false });
const I18nHelperDemo = dynamic(() => import('@/components/dev/I18nHelperDemo'), { ssr: false });

export default function AdminToolsPage() {
  const { isAdmin, isLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'translation' | 'helpers'>('translation');
  const { locale } = useLanguage();

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  // Protected route
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Admin Tools</h1>
        
        <div className="mb-6">
          <div className="flex space-x-1 border-b border-gray-700">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'translation'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('translation')}
            >
              Translation Debugger
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'helpers'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('helpers')}
            >
              I18n Helpers
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          {activeTab === 'translation' && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Translation Debugger</h2>
              <p className="text-gray-400 mb-6">
                Use this tool to debug translations in your application. Enter a translation key to see its value in all languages.
              </p>
              <TranslationDebugger />
            </div>
          )}
          
          {activeTab === 'helpers' && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">I18n Helper Functions</h2>
              <p className="text-gray-400 mb-6">
                Examples of internationalization helper functions available in the application.
              </p>
              <I18nHelperDemo />
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-gray-800/60 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Current Locale Info</h2>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-emerald-400 font-mono">
              Current locale: <span className="text-gray-300">{locale}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 