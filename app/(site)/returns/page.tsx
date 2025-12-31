// app/(site)/returns/page.tsx - Request a Return Page
'use client';
import { useState } from 'react';
import ContentLayout from '@/components/ContentLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders } from '@/hooks/useOrders';
import { RefreshCw, Package, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReturnsPage() {
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [returnReason, setReturnReason] = useState<string>('');
  const [returnNotes, setReturnNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: orders, isLoading } = useOrders();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <ContentLayout
        title="Return Request Submitted"
        description="Your return request has been successfully submitted."
      >
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="bg-gray-900/50 rounded-lg p-8">
            <CheckCircle2 className="h-16 w-16 text-[#3c83f6] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Return Request Received
            </h2>
            <p className="text-base md:text-lg text-gray-300 mb-6">
              We've received your return request and will process it within 1-2 business days. 
              You'll receive an email confirmation with a prepaid return label and instructions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/orders">
                <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white">
                  View My Orders
                </Button>
              </a>
              <a href="/shipping-returns">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black">
                  Return Policy
                </Button>
              </a>
            </div>
          </div>
        </div>
      </ContentLayout>
    );
  }

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
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Return Policy</h2>
              <p className="text-gray-300 text-base">
                Items must be returned within 30 days of delivery. Items must be unworn, unwashed, 
                and in original condition with tags attached. Sale items and personalized products are final sale.
              </p>
            </div>
          </div>
        </section>

        {/* Return Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Select Order */}
          <section className="space-y-4">
            <Label htmlFor="order" className="text-white text-lg font-semibold">
              Select Order *
            </Label>
            {isLoading ? (
              <Skeleton className="h-12 bg-gray-800" />
            ) : (
              <Select value={selectedOrder} onValueChange={setSelectedOrder} required>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-[#3c83f6]">
                  <SelectValue placeholder="Choose an order to return" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {((orders as any)?.results || (Array.isArray(orders) ? orders : []))?.map((order: any) => (
                    <SelectItem
                      key={order.id}
                      value={order.id}
                      className="text-white focus:bg-gray-700"
                    >
                      Order #{order.order_number || order.id.slice(0, 8)} - {new Date(order.created_at).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!((orders as any)?.results || (Array.isArray(orders) ? orders : [])) || ((orders as any)?.results || (Array.isArray(orders) ? orders : [])).length === 0 ? (
              <p className="text-gray-400 text-sm">
                No orders available. <a href="/shop" className="text-[#3c83f6] hover:text-white underline">Start shopping</a>
              </p>
            ) : null}
          </section>

          {/* Return Reason */}
          <section className="space-y-4">
            <Label htmlFor="reason" className="text-white text-lg font-semibold">
              Reason for Return *
            </Label>
            <Select value={returnReason} onValueChange={setReturnReason} required>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-[#3c83f6]">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="wrong-size" className="text-white focus:bg-gray-700">
                  Wrong Size
                </SelectItem>
                <SelectItem value="defective" className="text-white focus:bg-gray-700">
                  Defective/Damaged Item
                </SelectItem>
                <SelectItem value="not-as-described" className="text-white focus:bg-gray-700">
                  Not as Described
                </SelectItem>
                <SelectItem value="changed-mind" className="text-white focus:bg-gray-700">
                  Changed My Mind
                </SelectItem>
                <SelectItem value="other" className="text-white focus:bg-gray-700">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </section>

          {/* Additional Notes */}
          <section className="space-y-4">
            <Label htmlFor="notes" className="text-white text-lg font-semibold">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              placeholder="Please provide any additional information about your return..."
              rows={5}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#3c83f6]"
            />
          </section>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={!selectedOrder || !returnReason || isSubmitting}
              className="bg-[#3c83f6] hover:bg-[#2563eb] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" />
                  Submit Return Request
                </>
              )}
            </Button>
            <a href="/shipping-returns">
              <Button
                type="button"
                variant="outline"
                className="border-white/20 text-white hover:bg-white hover:text-black"
              >
                View Return Policy
              </Button>
            </a>
          </div>
        </form>

        {/* Help Section */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need Assistance?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6">
            If you have questions about the return process or need help selecting items, our customer support team is here to help.
          </p>
          <a href="/contact-support">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black">
              Contact Support
            </Button>
          </a>
        </section>
      </div>
    </ContentLayout>
  );
}

