// app/(reseller)/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { Loader2, LayoutGrid, Receipt, Store, Image as ImageIcon, User } from 'lucide-react';
import { useResellerProfile } from '@/hooks/useResellers';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/ResellerDashboard', label: 'Overview', icon: LayoutGrid },
  { href: '/ResellerDashboard#commissions', label: 'Commissions', icon: Receipt },
  { href: '/ResellerDashboard#storefronts', label: 'Storefronts', icon: Store },
  { href: '/ResellerDashboard#marketing', label: 'Marketing', icon: ImageIcon },
  { href: '/ResellerDashboard#profile', label: 'Profile', icon: User },
];

export default function ResellerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/ResellerLogin';
  
  // Only fetch profile if not on login page
  const { data: profile, isLoading, isError, error } = useResellerProfile(!isLoginPage);

  useEffect(() => {
    // Only redirect if not already on login page
    if (isError && !isLoginPage) {
      const status = (error as any)?.response?.status;
      if (status === 401 || status === 403) {
        router.replace('/ResellerLogin');
      }
    }
  }, [isError, error, router, isLoginPage]);

  // If on login page, render without auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Protected pages - show loading/error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading reseller portal...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center space-y-4">
        <p className="text-lg font-semibold text-foreground">Unable to load reseller account.</p>
        <p className="text-sm text-muted-foreground">Please sign in again.</p>
        <Button onClick={() => router.replace('/ResellerLogin')}>Go to Reseller Login</Button>
      </div>
    );
  }

  // Authenticated - show protected layout
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            1stRep Reseller
          </Link>
          <div className="text-sm text-muted-foreground">
            {profile?.company_name || 'Reseller'} • {profile?.tier?.display_name || profile?.tier?.name || 'Tier'}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 shrink-0">
          <nav className="space-y-1 rounded-lg border border-border bg-card p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href.split('#')[0]);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/80',
                    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

