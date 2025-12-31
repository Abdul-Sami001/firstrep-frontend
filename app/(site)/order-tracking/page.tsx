// app/(site)/order-tracking/page.tsx - Order Tracking Page
'use client';
import { useState } from 'react';
import ContentLayout from '@/components/ContentLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Search, Truck, CheckCircle2, Clock } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import OrderCard from '@/components/OrderCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  // This would typically use a different hook for tracking by order number/email
  // For now, we'll use the existing orders hook
  const { data: orders, isLoading } = useOrders();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber || email) {
      setSearchPerformed(true);
      // In a real implementation, this would trigger a search
    }
  };

  return (
    <ContentLayout
      title="Track Your Order"
      description="Enter your order number and email to track your shipment in real-time."
    >
      <div className="space-y-8 md:space-y-12">
        {/* Search Form */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderNumber" className="text-white">
                  Order Number
                </Label>
                <Input
                  id="orderNumber"
                  type="text"
                  placeholder="Enter order number"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3c83f6]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3c83f6]"
                />
              </div>
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
            <h2 className="text-2xl md:text-3xl font-bold text-white">Your Orders</h2>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 bg-gray-800" />
                ))}
              </div>
            ) : orders && Array.isArray(orders) && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-lg p-8 text-center">
                <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No orders found with the provided information.</p>
                <p className="text-gray-500 text-sm mt-2">
                  Please check your order number and email address, or contact support for assistance.
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
            <a
              href="/contact-support"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#3c83f6] text-white rounded-md hover:bg-[#2563eb] transition-colors font-semibold"
            >
              Contact Support
            </a>
            <a
              href="/shipping-returns"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white rounded-md hover:bg-white hover:text-black transition-colors font-semibold"
            >
              Shipping Information
            </a>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}

