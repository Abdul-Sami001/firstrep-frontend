// app/(site)/faq/page.tsx - FAQ Page
import type { Metadata } from 'next';
import ContentLayout from '@/components/ContentLayout';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about 1stRep products, shipping, returns, and more.',
};

const faqCategories = [
  {
    category: 'Orders & Shipping',
    items: [
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 5-7 business days. Express shipping (2-3 business days) and Next Day delivery options are also available. International shipping typically takes 7-14 business days depending on your location.',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to the United Kingdom, Europe, and select international destinations. Customs duties and taxes may apply and are the responsibility of the customer.',
      },
      {
        question: 'How can I track my order?',
        answer: 'Once your order ships, you will receive a tracking number via email. You can also track your order by logging into your account and viewing your order history.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. All payments are processed securely through our encrypted payment gateway.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      {
        question: 'What is your return policy?',
        answer: 'You can return items within 30 days of delivery for a full refund or exchange. Items must be unworn, unwashed, and in original condition with tags attached. Sale items and personalized products are final sale.',
      },
      {
        question: 'How do I return an item?',
        answer: 'Log into your account, navigate to your orders, select the item(s) you wish to return, and click "Start a Return". Print the prepaid return label, package your items securely, and drop off at your nearest post office.',
      },
      {
        question: 'How long does it take to process a refund?',
        answer: 'Once we receive and inspect your returned items, we will process your refund within 5-10 business days. Refunds will be issued to your original payment method.',
      },
      {
        question: 'Can I exchange an item for a different size?',
        answer: 'To exchange an item, please return the original item following our return process, then place a new order for the desired size or color. We\'ll process your refund once we receive the returned item.',
      },
    ],
  },
  {
    category: 'Products & Sizing',
    items: [
      {
        question: 'How do I find the right size?',
        answer: 'We provide detailed size guides for all our products. Visit our Size Guide page for measurements and fit information. If you\'re unsure, our customer support team can help you find the perfect fit.',
      },
      {
        question: 'What materials are your products made from?',
        answer: 'Our products are crafted from premium, high-performance materials designed for durability and comfort. Specific material information is available on each product page.',
      },
      {
        question: 'Are your products suitable for workouts?',
        answer: 'Yes! Our performance range is specifically designed for athletes and active individuals. Our products feature moisture-wicking technology, breathable fabrics, and flexible designs perfect for any workout.',
      },
      {
        question: 'Do you offer plus sizes?',
        answer: 'We offer a range of sizes to accommodate different body types. Check individual product pages for available sizes. If you need assistance finding your size, please contact our customer support team.',
      },
    ],
  },
  {
    category: 'Account & Support',
    items: [
      {
        question: 'How do I create an account?',
        answer: 'Click "Account" in the header and select "Sign Up". You can create an account using your email address or social media accounts. Having an account allows you to track orders, save favorites, and access exclusive offers.',
      },
      {
        question: 'I forgot my password. How do I reset it?',
        answer: 'On the login page, click "Forgot Password" and enter your email address. We\'ll send you a link to reset your password. If you don\'t receive the email, check your spam folder or contact support.',
      },
      {
        question: 'How can I contact customer support?',
        answer: 'You can reach us via email at support@1strep.com (response within 24 hours), live chat (9 AM - 6 PM GMT), or through our Contact Support page. We\'re here to help!',
      },
      {
        question: 'Do you offer student discounts?',
        answer: 'We occasionally offer student discounts and special promotions. Sign up for our newsletter to stay informed about exclusive offers and discounts.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <ContentLayout
      title="Frequently Asked Questions"
      description="Find answers to the most common questions about our products, shipping, returns, and more."
    >
      <div className="space-y-12 md:space-y-16">
        {faqCategories.map((category, categoryIndex) => (
          <section key={categoryIndex} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {category.category}
            </h2>
            <FAQAccordion items={category.items} />
          </section>
        ))}

        {/* Still Have Questions Section */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-6">
            Can't find the answer you're looking for? Our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@1strep.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#3c83f6] text-white rounded-md hover:bg-[#2563eb] transition-colors font-semibold"
            >
              Contact Support
            </a>
            <a
              href="/contact-support"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white rounded-md hover:bg-white hover:text-black transition-colors font-semibold"
            >
              Visit Support Center
            </a>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}

