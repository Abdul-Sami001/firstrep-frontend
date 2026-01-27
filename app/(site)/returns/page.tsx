// app/(site)/returns/page.tsx - Request a Return Page (Redirects to appropriate page)
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContentLayout from '@/components/ContentLayout';
import { Button } from '@/components/ui/button';
import { RefreshCw, Package, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ReturnsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to load, then redirect
    if (!authLoading) {
      if (isAuthenticated) {
        // Authenticated users → redirect to orders page
        router.replace('/orders');
      } else {
        // Guest users → redirect to order tracking page
        router.replace('/order-tracking');
      }
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading state while determining redirect
  if (authLoading) {
    return (
      <ContentLayout
        title="Request a Return"
        description="Redirecting you to the appropriate page..."
      >
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#3c83f6]" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </ContentLayout>
    );
  }

  // Fallback content (shouldn't be seen due to redirect, but good to have)
  return (
    <ContentLayout
      title="Request a Return"
      description="Start the return process for your order. We'll provide a prepaid return label once your request is approved."
    >
      <div className="space-y-8 md:space-y-12">
        {/* Return Information */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <RefreshCw className="h-6 w-6 text-[#3c83f6] mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">How to Request a Return</h2>
              <p className="text-gray-300 text-base mb-4">
                To request a return, please navigate to your order details page where you can select specific items and quantities to return.
              </p>
              <div className="space-y-3 mt-4">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-[#3c83f6]" />
                    <div>
                      <p className="text-white font-medium">For Authenticated Users</p>
                      <p className="text-gray-400 text-sm">Go to your orders page, select an order, and click "Request Return"</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-[#3c83f6]" />
                    <div>
                      <p className="text-white font-medium">For Guest Users</p>
                      <p className="text-gray-400 text-sm">Enter your tracking token to view your order and request a return</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {isAuthenticated ? (
            <Link href="/orders">
              <Button className="w-full sm:w-auto bg-[#3c83f6] hover:bg-[#2563eb] text-white">
                <Package className="mr-2 h-4 w-4" />
                View My Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/order-tracking">
              <Button className="w-full sm:w-auto bg-[#3c83f6] hover:bg-[#2563eb] text-white">
                <Package className="mr-2 h-4 w-4" />
                Track My Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
          <Link href="/shipping-returns">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-white/20 text-white hover:bg-white hover:text-black"
            >
              View Return Policy
            </Button>
          </Link>
        </div>

        {/* Return Policy Summary */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Return Policy</h2>
          <div className="space-y-3 text-gray-300">
            <p className="text-base">
              Items must be returned within 30 days of delivery. Items must be unworn, unwashed, 
              and in original condition with tags attached.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Sale items and personalized products are final sale</li>
              <li>You can select specific items and quantities to return</li>
              <li>Return label will be provided once your request is approved</li>
              <li>Refunds will be processed after we receive the returned items</li>
            </ul>
          </div>
        </section>

        {/* Help Section */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need Assistance?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6">
            If you have questions about the return process or need help, our customer support team is here to help.
          </p>
          <Link href="/contact-support">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black">
              Contact Support
            </Button>
          </Link>
        </section>
      </div>
    </ContentLayout>
  );
}

