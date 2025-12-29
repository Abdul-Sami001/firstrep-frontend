// app/(site)/about/page.tsx - About Us Page
import type { Metadata } from 'next';
import ContentLayout from '@/components/ContentLayout';
import Image from 'next/image';
import { Target, Award, Users, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about 1stRep - our mission, values, and commitment to premium performance apparel.',
};

const values = [
  {
    icon: Target,
    title: 'Performance First',
    description: 'Every product is designed with athletes in mind, prioritizing performance, durability, and functionality.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'We use only the finest materials and craftsmanship to ensure our products exceed expectations.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Built by athletes, for athletes. Our community is at the heart of everything we do.',
  },
  {
    icon: Heart,
    title: 'Sustainability',
    description: 'Committed to ethical practices and sustainable manufacturing for a better future.',
  },
];

export default function AboutPage() {
  return (
    <ContentLayout
      title="About 1stRep"
      description="It all starts with your 1st Rep. Performance range designed for athletes who never settle for ordinary."
      maxWidth="4xl"
    >
      <div className="space-y-12 md:space-y-16">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="relative aspect-video md:aspect-[16/9] rounded-lg overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3c83f6]/20 to-black/80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-2xl md:text-4xl font-bold text-white text-center px-4">
                It all starts with your 1st Rep
              </p>
            </div>
          </div>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            At 1stRep, we believe that every journey begins with a single step—your first rep. 
            We're dedicated to creating premium performance apparel that empowers athletes to push 
            beyond their limits and achieve extraordinary results.
          </p>
        </section>

        {/* Our Story */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Our Story</h2>
          <div className="space-y-4 text-gray-300 text-base md:text-lg leading-relaxed">
            <p>
              Founded with a passion for performance and a commitment to excellence, 1stRep was born 
              from the belief that athletes deserve apparel that matches their dedication. We understand 
              that every workout matters, every rep counts, and every detail makes a difference.
            </p>
            <p>
              Our team consists of athletes, designers, and innovators who share a common goal: to create 
              products that enhance performance while maintaining style and comfort. We've spent countless 
              hours testing, refining, and perfecting every piece in our collection.
            </p>
            <p>
              Today, 1stRep stands as a trusted name in performance apparel, serving athletes across the 
              globe who refuse to settle for ordinary. We're not just a brand—we're a movement dedicated 
              to helping you achieve your best, one rep at a time.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-[#3c83f6]/20 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-[#3c83f6]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{value.title}</h3>
                  </div>
                  <p className="text-gray-300 text-base leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mission */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-4">
            To empower athletes worldwide by providing premium performance apparel that combines 
            cutting-edge technology, sustainable practices, and uncompromising quality.
          </p>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            We're committed to creating products that not only enhance performance but also inspire 
            confidence, drive, and the relentless pursuit of excellence. Every design decision, every 
            material choice, and every stitch is made with one goal in mind: helping you achieve your best.
          </p>
        </section>

        {/* Join Us */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Join the 1stRep Community</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Whether you're a professional athlete or just starting your fitness journey, we're here 
            to support you every step of the way. Join thousands of athletes who choose 1stRep for 
            their performance needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/shop">
              <button className="px-6 py-3 bg-[#3c83f6] text-white rounded-md hover:bg-[#2563eb] transition-colors font-semibold">
                Shop Now
              </button>
            </a>
            <a href="/community">
              <button className="px-6 py-3 border border-white/20 text-white rounded-md hover:bg-white hover:text-black transition-colors font-semibold">
                Join Community
              </button>
            </a>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}

