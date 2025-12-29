// app/(site)/athletes/page.tsx - Athlete Program Page
import type { Metadata } from 'next';
import ContentLayout from '@/components/ContentLayout';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Gift, Star } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Athlete Program',
  description: 'Join the 1stRep Athlete Program and get exclusive benefits, early access, and support for your athletic journey.',
};

const programBenefits = [
  {
    icon: Gift,
    title: 'Exclusive Products',
    description: 'Early access to new collections and exclusive athlete-only products.',
  },
  {
    icon: Trophy,
    title: 'Sponsorship Opportunities',
    description: 'Potential sponsorship deals for competitive athletes and teams.',
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Join a network of elite athletes and fitness professionals.',
  },
  {
    icon: Star,
    title: 'Brand Partnership',
    description: 'Collaborate on product development and content creation.',
  },
];

export default function AthleteProgramPage() {
  return (
    <ContentLayout
      title="Athlete Program"
      description="Join elite athletes who choose 1stRep. Get exclusive benefits, early access, and support for your athletic journey."
      maxWidth="4xl"
    >
      <div className="space-y-12 md:space-y-16">
        {/* Program Overview */}
        <section className="space-y-6">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            The 1stRep Athlete Program is designed for competitive athletes, fitness professionals, 
            and dedicated individuals who share our passion for performance excellence. As an 
            athlete partner, you'll receive exclusive benefits and opportunities to grow with our brand.
          </p>
        </section>

        {/* Benefits */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Program Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programBenefits.map((benefit, index) => {
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

        {/* Eligibility */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Who Can Apply?</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Competitive Athletes</h3>
              <p className="text-gray-300 text-base">
                Professional or semi-professional athletes competing at regional, national, or international levels.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Fitness Professionals</h3>
              <p className="text-gray-300 text-base">
                Certified trainers, coaches, and fitness influencers with a significant following and engagement.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Rising Stars</h3>
              <p className="text-gray-300 text-base">
                Up-and-coming athletes showing exceptional promise and dedication to their sport.
              </p>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Application Process</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-[#3c83f6] font-bold text-lg flex-shrink-0">1.</span>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Submit Application</h3>
                <p className="text-gray-300 text-base">
                  Complete our online application form with your athletic background, achievements, and social media presence.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#3c83f6] font-bold text-lg flex-shrink-0">2.</span>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Review Process</h3>
                <p className="text-gray-300 text-base">
                  Our team reviews your application and may request additional information or references.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#3c83f6] font-bold text-lg flex-shrink-0">3.</span>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Onboarding</h3>
                <p className="text-gray-300 text-base">
                  If accepted, you'll receive your welcome package and program details to get started.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Join?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Apply to become a 1stRep athlete partner and take your performance to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:athletes@1strep.com">
              <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white">
                Apply Now
              </Button>
            </a>
            <Link href="/contact-support">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white hover:text-black transition-colors"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}

