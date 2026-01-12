// app/(reseller)/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { Loader2, LogOut } from 'lucide-react';
import { useResellerProfile } from '@/hooks/useResellers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

export default function ResellerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/ResellerLogin';
  const { logout } = useAuth();
  
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

  const handleLogout = () => {
    logout();
    router.push('/ResellerLogin');
  };

  // If on login page, render without auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Protected pages - show loading/error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading reseller portal...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center space-y-4">
        <p className="text-lg font-semibold">Unable to load reseller account.</p>
        <p className="text-sm text-gray-400">Please sign in again.</p>
        <Button onClick={() => router.replace('/ResellerLogin')}>Go to Reseller Login</Button>
      </div>
    );
  }

  // Authenticated - show protected layout
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold tracking-tight text-white">
              {profile?.company_name || '1stRep Reseller'}
            </Link>
            {profile && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-[#0b1224] text-white border border-[#1f2a44]">
                  {profile.tier?.display_name || profile.tier?.name}
                </Badge>
                <Badge className="gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-700/40">
                  {profile.status}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
              onClick={() => {
                // EPOS functionality - placeholder for now
                router.push('/ResellerDashboard');
              }}
            >
              Reseller EPOS
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="bg-black">{children}</main>
    </div>
  );
}

