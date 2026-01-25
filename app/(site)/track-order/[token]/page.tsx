// app/(site)/track-order/[token]/page.tsx - Guest Order Tracking Page (from email link)
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ContentLayout from '@/components/ContentLayout';
import { useTrackOrder } from '@/hooks/useOrders';
import OrderCard from '@/components/OrderCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TrackOrderByTokenPage() {
  const params = useParams();
  const router = useRouter();
  const trackingToken = params?.token as string;
  
  const { data: order, isLoading, error } = useTrackOrder(trackingToken);

  // If no token, redirect to order tracking page
  useEffect(() => {
    if (!trackingToken) {
      router.push('/order-tracking');
    }
  }, [trackingToken, router]);

  return (
    <ContentLayout
      title="Track Your Order"
      description="View your order details and tracking information."
    >
      <div className="space-y-8 md:space-y-12">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 bg-gray-800" />
            <Skeleton className="h-64 bg-gray-800" />
          </div>
        ) : error ? (
          <div className="bg-gray-900/50 rounded-lg p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Order Not Found</h2>
            <p className="text-gray-400 mb-6">
              We couldn't find an order with this tracking token. Please check your email for the correct tracking link, or contact support if you need assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order-tracking">
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                  Try Another Token
                </Button>
              </Link>
              <Link href="/contact-support">
                <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Order Details</h2>
              <Link href="/order-tracking">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  Track Another Order
                </Button>
              </Link>
            </div>
            <OrderCard order={order} />
          </div>
        ) : null}
      </div>
    </ContentLayout>
  );
}
