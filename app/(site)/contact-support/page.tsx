// app/(site)/contact-support/page.tsx - Accessibility / Contact Support Page
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, MessageCircle, Phone, HelpCircle } from 'lucide-react';
import StaticPageLayout from '@/components/StaticPageLayout';

export default function ContactSupportPage() {
  return (
    <StaticPageLayout
      title="Contact Support"
      description="We're here to help. Get in touch with our customer support team."
    >
      <div className="space-y-8 md:space-y-10 text-gray-300">
        {/* Contact Methods */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Support */}
            <div className="bg-gray-900/50 rounded-lg p-6 md:p-8 border border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[#3c83f6]/20 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-[#3c83f6]" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Email Support</h3>
                  <p className="text-sm text-gray-400">Response within 24 hours</p>
                </div>
              </div>
              <p className="text-base md:text-lg text-gray-300 mb-4">
                Send us an email and we'll get back to you as soon as possible.
              </p>
              <a href="mailto:support@1strep.com">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  support@1strep.com
                </Button>
              </a>
            </div>

            {/* Support Tickets (replaces live chat) */}
            <div className="bg-gray-900/50 rounded-lg p-6 md:p-8 border border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[#3c83f6]/20 p-3 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-[#3c83f6]" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Support Tickets</h3>
                  <p className="text-sm text-gray-400">Fast responses from our team</p>
                </div>
              </div>
              <p className="text-base md:text-lg text-gray-300 mb-4">
                Open a ticket and track replies directly in your account. We respond promptly during business hours.
              </p>
              <Link href="/support">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Go to Support
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Help Links */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Quick Help</h2>
          <p className="text-base md:text-lg text-gray-300">
            Find answers to common questions or get help with your order:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Link href="/orders">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 hover:border-[#3c83f6] transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-[#3c83f6]" />
                  <span className="text-white font-medium">Track Your Order</span>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </div>
            </Link>
            <Link href="/shipping-returns">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 hover:border-[#3c83f6] transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-[#3c83f6]" />
                  <span className="text-white font-medium">Shipping & Returns</span>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </div>
            </Link>
            <Link href="/returns">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 hover:border-[#3c83f6] transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-[#3c83f6]" />
                  <span className="text-white font-medium">Start a Return</span>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </div>
            </Link>
            <Link href="/faq">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 hover:border-[#3c83f6] transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-[#3c83f6]" />
                  <span className="text-white font-medium">Frequently Asked Questions</span>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Accessibility Statement */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">Accessibility</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            At 1stRep, we are committed to ensuring digital accessibility for people with disabilities. We are 
            continually improving the user experience for everyone and applying the relevant accessibility standards.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Our Commitment</h3>
              <p className="text-base md:text-lg leading-relaxed">
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA standards. 
                This means our website should be accessible to people with a wide range of disabilities, including:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                <li>Visual impairments (blindness, low vision, color blindness)</li>
                <li>Hearing impairments</li>
                <li>Motor impairments</li>
                <li>Cognitive impairments</li>
                <li>Seizure disorders</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Accessibility Features</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Keyboard navigation support</li>
                <li>Screen reader compatibility</li>
                <li>Alt text for images</li>
                <li>High contrast mode support</li>
                <li>Text resizing capabilities</li>
                <li>Clear and consistent navigation</li>
                <li>Descriptive link text</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Feedback</h3>
              <p className="text-base md:text-lg leading-relaxed">
                We welcome your feedback on the accessibility of our website. If you encounter any accessibility 
                barriers or have suggestions for improvement, please contact us:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-base md:text-lg">
                  <strong className="text-white">Email:</strong>{' '}
                  <a href="mailto:accessibility@1strep.com" className="text-[#3c83f6] hover:text-white transition-colors underline">
                    accessibility@1strep.com
                  </a>
                </p>
                <p className="text-base md:text-lg">
                  <strong className="text-white">Phone:</strong> Available upon request
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Third-Party Content</h3>
              <p className="text-base md:text-lg leading-relaxed">
                While we strive to ensure accessibility across our website, some third-party content or applications 
                may not be fully accessible. We are working with our partners to improve accessibility across all 
                integrated services.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Ongoing Improvements</h3>
              <p className="text-base md:text-lg leading-relaxed">
                We are continuously working to improve the accessibility of our website. This includes regular 
                accessibility audits, user testing with people with disabilities, and implementing feedback from 
                our community.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6">
            Have a question or need assistance? We're here to help. Reach out to us through any of the following methods:
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-[#3c83f6] mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold mb-1">Email</p>
                <a href="mailto:support@1strep.com" className="text-[#3c83f6] hover:text-white transition-colors underline">
                  support@1strep.com
                </a>
                <p className="text-sm text-gray-400 mt-1">Response within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MessageCircle className="h-5 w-5 text-[#3c83f6] mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold mb-1">Live Chat</p>
                <p className="text-gray-300">Available 9 AM - 6 PM GMT, Monday - Friday</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-5 w-5 text-[#3c83f6] mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold mb-1">Phone Support</p>
                <p className="text-gray-300">Phone support available upon request</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </StaticPageLayout>
  );
}

