'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to contacts page
    router.push('/admin/contacts');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
} 