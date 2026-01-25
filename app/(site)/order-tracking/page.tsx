// app/(site)/order-tracking/page.tsx - Order Tracking Page
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ContentLayout from '@/components/ContentLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Search, Truck, CheckCircle2, Clock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useTrackOrder } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import OrderCard from '@/components/OrderCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Get tracking token from URL if present (from email link)
  const urlToken = searchParams?.get('token');
  
  const [trackingToken, setTrackingToken] = useState<string>('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Use URL token if present, otherwise use input token
  const activeToken = urlToken || trackingToken;
  
  const { data: order, isLoading, error } = useTrackOrder(activeToken || null);

  // If token is in URL, automatically search
  useEffect(() => {
    if (urlToken) {
      setSearchPerformed(true);
    }
  }, [urlToken]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingToken.trim()) {
      setSearchPerformed(true);
    } else {
      toast({
        title: "Tracking token required",
        description: "Please enter your tracking token to search for your order.",
        variant: "destructive",
      });
    }
  };

  // Show message for authenticated users
  if (isAuthenticated && !searchPerformed && !urlToken) {
    return (
      <ContentLayout
        title="Track Your Order"
        description="View your order details and tracking information."
      >
        <div className="space-y-8 md:space-y-12">
          <div className="bg-gray-900/50 rounded-lg p-8 text-center">
            <User className="h-12 w-12 text-[#3c83f6] mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
              View Your Orders
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              As a registered user, you can view all your past orders and order updates in your profile. 
              Visit your profile to see your complete order history and track your shipments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/profile">
                <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white">
                  Go to Profile
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                  View All Orders
                </Button>
              </Link>
            </div>
          </div>

          {/* Guest Tracking Section */}
          <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-2">Guest Order Tracking</h3>
            <p className="text-sm text-gray-400 mb-4">
              If you placed an order as a guest, enter your tracking token from your confirmation email to track your order.
            </p>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trackingToken" className="text-white">
                  Tracking Token
                </Label>
                <Input
                  id="trackingToken"
                  type="text"
                  placeholder="Enter tracking token from your email"
                  value={trackingToken}
                  onChange={(e) => setTrackingToken(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3c83f6]"
                />
              </div>
              <Button
                type="submit"
                className="w-full md:w-auto bg-[#3c83f6] hover:bg-[#2563eb] text-white"
              >
                <Search className="mr-2 h-4 w-4" />
                Track Order
              </Button>
            </form>
          </section>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="Track Your Order"
      description="Enter your tracking token to track your shipment in real-time."
    >
      <div className="space-y-8 md:space-y-12">
        {/* Search Form */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="trackingToken" className="text-white">
                Tracking Token
              </Label>
              <Input
                id="trackingToken"
                type="text"
                placeholder="Enter tracking token from your confirmation email"
                value={trackingToken}
                onChange={(e) => setTrackingToken(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3c83f6]"
              />
              <p className="text-sm text-gray-400">
                You can find your tracking token in the order confirmation email we sent you.
              </p>
            </div>
            <Button
              type="submit"
              className="w-full md:w-auto bg-[#3c83f6] hover:bg-[#2563eb] text-white"
            >
              <Search className="mr-2 h-4 w-4" />
              Track Order
            </Button>
          </form>
        </section>

        {/* Tracking Information */}
        {searchPerformed && (
          <section className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 bg-gray-800" />
                <Skeleton className="h-64 bg-gray-800" />
              </div>
            ) : error ? (
              <div className="bg-gray-900/50 rounded-lg p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Order Not Found</h2>
                <p className="text-gray-400 mb-2">
                  We couldn't find an order with this tracking token.
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Please check your email for the correct tracking token, or contact support for assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setSearchPerformed(false);
                      setTrackingToken('');
                    }}
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    Try Again
                  </Button>
                  <Link href="/contact-support">
                    <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            ) : order ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Order Details</h2>
                  <Button
                    onClick={() => {
                      setSearchPerformed(false);
                      setTrackingToken('');
                    }}
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                  >
                    Track Another Order
                  </Button>
                </div>
                <OrderCard order={order} />
              </>
            ) : (
              <div className="bg-gray-900/50 rounded-lg p-8 text-center">
                <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No order found with the provided tracking token.</p>
                <p className="text-gray-500 text-sm mt-2">
                  Please check your tracking token and try again, or contact support for assistance.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Tracking Status Guide */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Understanding Your Tracking Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-[#3c83f6] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-1">Processing</h3>
                <p className="text-gray-400 text-sm">Your order is being prepared for shipment</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-[#3c83f6] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-1">Shipped</h3>
                <p className="text-gray-400 text-sm">Your order has left our warehouse</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-[#3c83f6] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-1">In Transit</h3>
                <p className="text-gray-400 text-sm">Your order is on its way to you</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#3c83f6] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-1">Delivered</h3>
                <p className="text-gray-400 text-sm">Your order has been delivered</p>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need Help?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6">
            If you're having trouble tracking your order or have questions about your shipment, our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact-support"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#3c83f6] text-white rounded-md hover:bg-[#2563eb] transition-colors font-semibold"
            >
              Contact Support
            </Link>
            <Link
              href="/shipping-returns"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white rounded-md hover:bg-white hover:text-black transition-colors font-semibold"
            >
              Shipping Information
            </Link>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <ContentLayout title="Track Your Order" description="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#3c83f6]" />
        </div>
      </ContentLayout>
    }>
      <OrderTrackingContent />
    </Suspense>
  );
}