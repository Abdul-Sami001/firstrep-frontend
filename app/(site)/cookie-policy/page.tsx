// app/(site)/cookie-policy/page.tsx - Cookie Policy Page
import type { Metadata } from 'next';
import StaticPageLayout from '@/components/StaticPageLayout';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: '1stRep Cookie Policy - Learn how we use cookies and similar technologies on our website.',
};

export default function CookiePolicyPage() {
  return (
    <StaticPageLayout
      title="Cookie Policy"
      description="This policy explains how we use cookies and similar technologies on our website."
    >
      <div className="space-y-8 md:space-y-10 text-gray-300">
        <div>
          <p className="text-base md:text-lg leading-relaxed mb-6">
            Last updated: December 29, 2025
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-6">
            This Cookie Policy explains how 1stRep ("we", "us", or "our") uses cookies and similar technologies 
            when you visit our website. It explains what these technologies are and why we use them, as well as 
            your rights to control our use of them.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">What Are Cookies?</h2>
          <p className="text-base md:text-lg leading-relaxed">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
            They are widely used to make websites work more efficiently and provide information to website owners. 
            Cookies allow a website to recognize your device and store some information about your preferences or 
            past actions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">How We Use Cookies</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            We use cookies and similar tracking technologies to track activity on our website and store certain 
            information. The types of cookies we use include:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Essential Cookies</h3>
              <p className="text-base md:text-lg leading-relaxed mb-3">
                These cookies are necessary for the website to function properly. They enable core functionality 
                such as security, network management, and accessibility.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Session management and authentication</li>
                <li>Shopping cart functionality</li>
                <li>Security and fraud prevention</li>
                <li>Load balancing and website performance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Analytics Cookies</h3>
              <p className="text-base md:text-lg leading-relaxed mb-3">
                These cookies help us understand how visitors interact with our website by collecting and reporting 
                information anonymously.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Page views and navigation patterns</li>
                <li>Time spent on pages</li>
                <li>Traffic sources and referrals</li>
                <li>Error tracking and debugging</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Functional Cookies</h3>
              <p className="text-base md:text-lg leading-relaxed mb-3">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences 
                and choices.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Language and region preferences</li>
                <li>User preferences and settings</li>
                <li>Remembering login information</li>
                <li>Personalized content and recommendations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Marketing Cookies</h3>
              <p className="text-base md:text-lg leading-relaxed mb-3">
                These cookies are used to deliver advertisements that are relevant to you and your interests. They 
                may also be used to limit the number of times you see an advertisement.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Targeted advertising</li>
                <li>Social media integration</li>
                <li>Conversion tracking</li>
                <li>Retargeting campaigns</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">Third-Party Cookies</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics 
            of the website, deliver advertisements, and so on. These third parties may include:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong className="text-white">Google Analytics:</strong> For website analytics and performance monitoring</li>
            <li><strong className="text-white">Payment Processors:</strong> For secure payment processing</li>
            <li><strong className="text-white">Social Media Platforms:</strong> For social sharing and integration</li>
            <li><strong className="text-white">Advertising Networks:</strong> For targeted advertising and retargeting</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">Managing Cookies</h2>
          <p className="text-base md:text-lg leading-relaxed mb-4">
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights 
            by setting your preferences in the Cookie Settings or by configuring your browser settings.
          </p>

          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Browser Settings</h3>
            <p className="text-base md:text-lg leading-relaxed mb-3">
              Most web browsers allow you to control cookies through their settings preferences. However, limiting 
              cookies may impact your experience on our website. Here's how to manage cookies in popular browsers:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li><strong className="text-white">Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
              <li><strong className="text-white">Safari:</strong> Preferences → Privacy → Cookies and website data</li>
              <li><strong className="text-white">Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">Cookie Settings</h3>
            <p className="text-base md:text-lg leading-relaxed">
              You can also manage your cookie preferences directly on our website through our Cookie Settings panel, 
              which allows you to accept or reject different categories of cookies.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">Do Not Track Signals</h2>
          <p className="text-base md:text-lg leading-relaxed">
            Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not 
            want to have your online activity tracked. Currently, there is no standard for how DNT signals work, so 
            we do not currently respond to DNT signals.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">Updates to This Policy</h2>
          <p className="text-base md:text-lg leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
            operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed 
            about our use of cookies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4">Contact Us</h2>
          <p className="text-base md:text-lg leading-relaxed">
            If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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

