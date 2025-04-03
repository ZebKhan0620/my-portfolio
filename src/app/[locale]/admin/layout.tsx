"use client"

import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import AdminLayout from '@/app/admin/AdminLayout';
import { Locale } from '@/lib/i18n';

export default function AdminLocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: Locale }
}) {
  return (
    <AdminAuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminAuthProvider>
  );
} 