'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import LoginForm from '@/components/admin/LoginForm';

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const { isAuthenticated, adminKey } = useAdminAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isAuthenticated && adminKey) {
      fetchContacts();
    }
  }, [isAuthenticated, adminKey]);
  
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/contacts', {
        headers: {
          'x-admin-key': adminKey || ''
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      
      const data = await response.json();
      setContacts(data.data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Contact Form Submissions</h1>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400">No contact submissions yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex justify-between">
                <h2 className="text-xl font-bold text-emerald-400">{contact.name}</h2>
                <span className="text-gray-400 text-sm">
                  {new Date(contact.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-emerald-300 mt-1">{contact.email}</p>
              <p className="mt-4 text-gray-300 whitespace-pre-wrap">{contact.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 