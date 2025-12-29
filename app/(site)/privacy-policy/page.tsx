// app/(site)/privacy-policy/page.tsx - Privacy Policy Page
import type { Metadata } from 'next';
import StaticPageLayout from '@/components/StaticPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: '1stRep Privacy Policy - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      description="Your privacy is important to us. This policy explains how we collect, use, and protect your information."
    >
      <div className="space-y-8 md:space-y-10 text-gray-300">
        <div>
          <p className="text-base md:text-lg leading-relaxed mb-6">
            Last updated: December 29, 2025
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-6">
            At 1stRep, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
            website and use our services.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Personal Information</h3>
              <p className="text-base md:text-lg leading-relaxed">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                <li>Name and contact information (email address, phone number, mailing address)</li>
                <li>Payment information (credit card details, billing address)</li>
                <li>Account credentials (username, password)</li>
                <li>Order history and preferences</li>
                <li>Customer service communications</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Automatically Collected Information</h3>
              <p className="text-base md:text-lg leading-relaxed">
                When you visit our website, we automatically collect certain information about your device and browsing behavior:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information (type, operating system)</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-base md:text-lg leading-relaxed">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
            <li>Processing and fulfilling your orders</li>
            <li>Managing your account and preferences</li>
            <li>Communicating with you about your orders, products, and services</li>
            <li>Providing customer support and responding to inquiries</li>
            <li>Sending marketing communications (with your consent)</li>
            <li>Improving our website, products, and services</li>
            <li>Preventing fraud and ensuring security</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">3. Information Sharing and Disclosure</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            We do not sell your personal information. We may share your information in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="text-white">Service Providers:</strong> We share information with third-party service providers who perform services on our behalf (payment processing, shipping, analytics)</li>
            <li><strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
            <li><strong className="text-white">Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety</li>
            <li><strong className="text-white">With Your Consent:</strong> We may share information with your explicit consent</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">4. Data Security</h2>
          <p className="text-base md:text-lg leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
            the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">5. Your Rights and Choices</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Access and receive a copy of your personal information</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Request deletion of your personal information</li>
            <li>Object to or restrict processing of your information</li>
            <li>Data portability (receive your data in a structured format)</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
          <p className="text-base md:text-lg leading-relaxed mt-4">
            To exercise these rights, please contact us at{' '}
            <a href="mailto:support@1strep.com" className="text-[#3c83f6] hover:text-white transition-colors underline">
              support@1strep.com
            </a>
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">6. Cookies and Tracking Technologies</h2>
          <p className="text-base md:text-lg leading-relaxed">
            We use cookies and similar tracking technologies to collect and store information about your preferences and 
            browsing behavior. You can control cookies through your browser settings. For more information, please see our{' '}
            <a href="/cookie-policy" className="text-[#3c83f6] hover:text-white transition-colors underline">
              Cookie Policy
            </a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">7. Children's Privacy</h2>
          <p className="text-base md:text-lg leading-relaxed">
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal 
            information from children. If you believe we have collected information from a child, please contact us 
            immediately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">8. International Data Transfers</h2>
          <p className="text-base md:text-lg leading-relaxed">
            Your information may be transferred to and processed in countries other than your country of residence. 
            These countries may have data protection laws that differ from those in your country. We take appropriate 
            measures to ensure your information receives adequate protection.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">9. Changes to This Privacy Policy</h2>
          <p className="text-base md:text-lg leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting 
            the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this 
            Privacy Policy periodically.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">10. Contact Us</h2>
          <p className="text-base md:text-lg leading-relaxed">
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-base md:text-lg">
              <strong className="text-white">Email:</strong>{' '}
              <a href="mailto:support@1strep.com" className="text-[#3c83f6] hover:text-white transition-colors underline">
                support@1strep.com
              </a>
            </p>
            <p className="text-base md:text-lg">
              <strong className="text-white">Address:</strong> 1stRep, United Kingdom
            </p>
          </div>
        </section>
      </div>
    </StaticPageLayout>
  );
}

