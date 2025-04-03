'use client';

import React from 'react';
import Link from 'next/link';

interface AdminLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}

/**
 * AdminLink component for directing users to admin pages
 * This component routes directly to /admin/* paths instead of locale-prefixed paths
 */
export default function AdminLink({ href, className, children, ariaLabel }: AdminLinkProps) {
  // Always ensure the admin links point to /admin and not /[locale]/admin
  const adminPath = href.startsWith('/') 
    ? href.replace(/^\/[^\/]+\/admin/, '/admin')
    : `/admin/${href}`;

  return (
    <Link 
      href={adminPath}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
