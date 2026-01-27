// components/TrackOrderLink.tsx - Reusable Track Order Link Component
'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface TrackOrderLinkProps {
  children: ReactNode;
  className?: string;
  [key: string]: any; // Allow other props to be passed through
}

/**
 * TrackOrderLink component that routes to /orders for authenticated users
 * or /order-tracking for unauthenticated users
 */
export default function TrackOrderLink({ 
  children, 
  className,
  ...props 
}: TrackOrderLinkProps) {
  const { isAuthenticated } = useAuth();
  
  // Route to /orders for authenticated users, /order-tracking for guests
  const href = isAuthenticated ? '/orders' : '/order-tracking';

  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}
