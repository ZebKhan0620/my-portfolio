import React from 'react';
import { withNamespace } from '@/lib/withNamespace';
import { useNamespace } from '@/lib/useNamespace';
import { useLanguage } from '@/contexts/LanguageContext';

// Component using withNamespace HOC
const NamespaceHOCExample = withNamespace(['common', 'admin'])(() => {
  const { t, locale } = useLanguage();
  
  return (
    <div className="rounded-md bg-blue-50 p-4 mb-8">
      <h2 className="text-xl font-semibold text-blue-700 mb-2">
        {t('admin.dashboard.title')}
      </h2>
      <p className="text-blue-800">
        This component uses the <code className="bg-blue-100 px-1 rounded">withNamespace</code> HOC
        to load the "common" and "admin" namespaces.
      </p>
      <p className="text-blue-800 mt-2">
        Current locale: <strong>{locale}</strong>
      </p>
    </div>
  );
});

// Regular component that will use the useNamespace hook
function NamespaceHookExample() {
  const { t, locale } = useLanguage();
  const { isLoaded, isLoading, error, reload } = useNamespace('settings');
  
  if (isLoading) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <p className="text-yellow-700">Loading settings namespace...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-red-700">Error: {error}</p>
        <button 
          onClick={reload}
          className="bg-red-600 text-white px-3 py-1 rounded mt-2 hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="rounded-md bg-green-50 p-4">
      <h2 className="text-xl font-semibold text-green-700 mb-2">
        {t('settings.title')}
      </h2>
      <p className="text-green-800">
        This component uses the <code className="bg-green-100 px-1 rounded">useNamespace</code> hook
        to load the "settings" namespace.
      </p>
      <p className="text-green-800 mt-2">
        Current locale: <strong>{locale}</strong>
      </p>
      <p className="mt-2">
        <button 
          onClick={reload}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Reload namespace
        </button>
      </p>
    </div>
  );
}

export default function NamespacesExamplePage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Namespaces Example
      </h1>
      
      <p className="mb-6 text-gray-700">
        This page demonstrates two approaches to loading translation namespaces:
        using a Higher-Order Component (HOC) and using a React Hook.
      </p>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">HOC Approach</h2>
          <NamespaceHOCExample />
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Hook Approach</h2>
          <NamespaceHookExample />
        </section>
      </div>
    </div>
  );
} 