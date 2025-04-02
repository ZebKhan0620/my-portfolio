"use client"

import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import AdminLayout from '@/app/admin/AdminLayout';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 