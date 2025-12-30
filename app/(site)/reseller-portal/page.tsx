// app/(site)/reseller-portal/page.tsx - Reseller Portal Landing Page
import type { Metadata } from 'next';
import Link from 'next/link';
import ContentLayout from '@/components/ContentLayout';
import { Button } from '@/components/ui/button';
import { Building2, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reseller Portal',
  description: 'Join the 1stRep reseller program and become part of our growing network of partners.',
};

const benefits = [
  {
    icon: TrendingUp,
    title: 'Competitive Pricing',
    description: 'Access wholesale pricing and volume discounts to maximize your profit margins.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Get personalized support from our reseller team to help grow your business.',
  },
  {
    icon: Shield,
    title: 'Brand Protection',
    description: 'Work with an authorized partner program that protects brand integrity.',
  },
  {
    icon: Building2,
    title: 'Marketing Resources',
    description: 'Access marketing materials, product images, and promotional content.',
  },
];

export default function ResellerPortalPage() {
  return (
    <ContentLayout
      title="Reseller Portal"
      description="Partner with 1stRep and offer premium performance apparel to your customers."
      maxWidth="4xl"
    >
      <div className="space-y-12 md:space-y-16">
        {/* Introduction */}
        <section className="space-y-6">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            Join the 1stRep Reseller Program and become part of a network of authorized partners 
            bringing premium performance apparel to athletes worldwide. Whether you're a retail 
            store, gym, or online marketplace, we offer competitive pricing and comprehensive support.
          </p>
        </section>

        {/* Benefits */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Why Become a Reseller?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-[#3c83f6]/20 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-[#3c83f6]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{benefit.title}</h3>
                  </div>
                  <p className="text-gray-300 text-base leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Program Details */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Program Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Minimum Order Requirements</h3>
              <p className="text-gray-300 text-base">
                Minimum order value of £500 for initial orders. Reorders have a minimum of £250.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Payment Terms</h3>
              <p className="text-gray-300 text-base">
                Net 30 payment terms available for qualified resellers. Credit card payments accepted for immediate processing.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Shipping</h3>
              <p className="text-gray-300 text-base">
                Competitive shipping rates and expedited options available. Free shipping on orders over £1,000.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Support</h3>
              <p className="text-gray-300 text-base">
                Dedicated reseller support team, product training, and marketing assistance to help you succeed.
              </p>
            </div>
          </div>
        </section>

        {/* Application CTA */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Apply to become an authorized 1stRep reseller. Our team will review your application 
            and get back to you within 2-3 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ResellerLogin">
              <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white">
                <Building2 className="mr-2 h-4 w-4" />
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="mailto:resellers@1strep.com">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white hover:text-black transition-colors"
              >
                Contact Reseller Team
              </Button>
            </a>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}

