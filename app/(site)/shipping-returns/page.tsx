// app/(site)/shipping-returns/page.tsx - Terms of Service / Shipping & Returns Page
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, RefreshCw, Truck } from 'lucide-react';
import StaticPageLayout from '@/components/StaticPageLayout';

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description: '1stRep Shipping and Returns Policy - Information about shipping, delivery, and return procedures.',
};

export default function ShippingReturnsPage() {
  return (
    <StaticPageLayout
      title="Shipping & Returns"
      description="Everything you need to know about shipping, delivery, and returns."
    >
      <div className="space-y-8 md:space-y-10 text-gray-300">
        {/* Help Section */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need Help with Your Order?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6">
            Our customer care team is ready to assist you with any questions or concerns about your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/orders">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                <Truck className="mr-2 h-4 w-4" />
                Track Order
              </Button>
            </Link>
            <Link href="/returns">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Start a Return
              </Button>
            </Link>
            <Link href="/contact-support">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                Contact Support
              </Button>
            </Link>
          </div>
        </section>

        {/* Shipping Information */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="h-6 w-6 text-[#3c83f6]" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Shipping Information</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Processing Time</h3>
              <p className="text-base md:text-lg leading-relaxed">
                All orders are processed within 1-3 business days (excluding weekends and holidays) after we receive 
                your order confirmation email. You will receive another email when your order has shipped.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Shipping Methods & Rates</h3>
              <div className="space-y-4 mt-4">
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Standard Shipping</h4>
                  <p className="text-base text-gray-300 mb-2">5-7 business days</p>
                  <p className="text-base text-gray-300">Free on orders over £50</p>
                </div>
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Express Shipping</h4>
                  <p className="text-base text-gray-300 mb-2">2-3 business days</p>
                  <p className="text-base text-gray-300">£9.99</p>
                </div>
                <div className="bg-gray-900/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Next Day Delivery</h4>
                  <p className="text-base text-gray-300 mb-2">Next business day (order before 2 PM)</p>
                  <p className="text-base text-gray-300">£14.99</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">International Shipping</h3>
              <p className="text-base md:text-lg leading-relaxed">
                We currently ship to the United Kingdom, Europe, and select international destinations. International 
                shipping times vary by location (typically 7-14 business days). Customs duties and taxes may apply 
                and are the responsibility of the customer.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Order Tracking</h3>
              <p className="text-base md:text-lg leading-relaxed">
                Once your order has shipped, you will receive a tracking number via email. You can track your order 
                status in real-time using the tracking link provided.
              </p>
            </div>
          </div>
        </section>

        {/* Returns & Exchanges */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="h-6 w-6 text-[#3c83f6]" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Returns & Exchanges</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Return Policy</h3>
              <p className="text-base md:text-lg leading-relaxed mb-4">
                We want you to be completely satisfied with your purchase. If you're not happy with your order, you 
                can return it within 30 days of delivery for a full refund or exchange.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Items must be unworn, unwashed, and in original condition with tags attached</li>
                <li>Original packaging should be included when possible</li>
                <li>Proof of purchase is required</li>
                <li>Sale items and personalized products are final sale and cannot be returned</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">How to Return</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-[#3c83f6] font-bold text-lg">1.</span>
                  <p className="text-base md:text-lg">Log into your account and navigate to your orders</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#3c83f6] font-bold text-lg">2.</span>
                  <p className="text-base md:text-lg">Select the item(s) you wish to return and click "Start a Return"</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#3c83f6] font-bold text-lg">3.</span>
                  <p className="text-base md:text-lg">Print the prepaid return label provided</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#3c83f6] font-bold text-lg">4.</span>
                  <p className="text-base md:text-lg">Package your items securely and attach the return label</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#3c83f6] font-bold text-lg">5.</span>
                  <p className="text-base md:text-lg">Drop off at your nearest post office or schedule a pickup</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Refund Processing</h3>
              <p className="text-base md:text-lg leading-relaxed">
                Once we receive and inspect your returned items, we will process your refund within 5-10 business days. 
                Refunds will be issued to the original payment method. Shipping costs are non-refundable unless the item 
                was defective or incorrect.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Exchanges</h3>
              <p className="text-base md:text-lg leading-relaxed">
                To exchange an item for a different size or color, please return the original item following the return 
                process above, then place a new order for the desired item. We'll process your refund once we receive 
                the returned item.
              </p>
            </div>
          </div>
        </section>

        {/* Terms of Service */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Package className="h-6 w-6 text-[#3c83f6]" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Terms of Service</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Acceptance of Terms</h3>
              <p className="text-base md:text-lg leading-relaxed">
                By accessing and using the 1stRep website, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our website.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Product Information</h3>
              <p className="text-base md:text-lg leading-relaxed">
                We strive to provide accurate product descriptions and images. However, we do not warrant that product 
                descriptions, colors, or other content on our website is accurate, complete, reliable, current, or 
                error-free. If a product offered by us is not as described, your sole remedy is to return it in 
                unused condition.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Pricing and Payment</h3>
              <p className="text-base md:text-lg leading-relaxed">
                All prices are displayed in GBP (British Pounds) unless otherwise stated. We reserve the right to 
                change prices at any time. Payment must be received before we ship your order. We accept major credit 
                cards and PayPal.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Limitation of Liability</h3>
              <p className="text-base md:text-lg leading-relaxed">
                To the fullest extent permitted by law, 1stRep shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages resulting from your use of or inability to use the website 
                or products.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6">
            Our customer support team is here to help. Contact us for assistance with your order or any questions 
            about our shipping and returns policy.
          </p>
          <Link href="/contact-support">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </div>
    </StaticPageLayout>
  );
}

