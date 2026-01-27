// components/TrackOrderButton.tsx - Track Order Button Component
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';

interface TrackOrderButtonProps extends VariantProps<typeof buttonVariants> {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

/**
 * TrackOrderButton component that routes to /orders for authenticated users
 * or /order-tracking for unauthenticated users
 */
export default function TrackOrderButton({ 
  children, 
  className,
  variant = 'outline',
  ...props 
}: TrackOrderButtonProps) {
  const { isAuthenticated } = useAuth();
  
  // Route to /orders for authenticated users, /order-tracking for guests
  const href = isAuthenticated ? '/orders' : '/order-tracking';

  return (
    <Link href={href}>
      <Button variant={variant} className={className} {...props}>
        {children}
      </Button>
    </Link>
  );
}
