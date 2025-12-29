// app/(site)/press/page.tsx - Press Page
import type { Metadata } from 'next';
import ContentLayout from '@/components/ContentLayout';
import { Button } from '@/components/ui/button';
import { FileText, Mail, Download } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Press',
  description: 'Press resources, media kit, and brand assets for journalists and media professionals.',
};

const pressResources = [
  {
    title: 'Brand Guidelines',
    description: 'Our brand identity, logo usage, and design guidelines.',
    type: 'PDF',
    size: '2.4 MB',
  },
  {
    title: 'Product Images',
    description: 'High-resolution product photography for editorial use.',
    type: 'ZIP',
    size: '45 MB',
  },
  {
    title: 'Company Fact Sheet',
    description: 'Key facts, statistics, and company information.',
    type: 'PDF',
    size: '1.2 MB',
  },
  {
    title: 'Executive Headshots',
    description: 'Professional photos of our leadership team.',
    type: 'ZIP',
    size: '12 MB',
  },
];

export default function PressPage() {
  return (
    <ContentLayout
      title="Press & Media"
      description="Resources for journalists, bloggers, and media professionals covering 1stRep."
      maxWidth="4xl"
    >
      <div className="space-y-12 md:space-y-16">
        {/* Press Contact */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <Mail className="h-6 w-6 text-[#3c83f6] mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Press Inquiries</h2>
              <p className="text-base md:text-lg text-gray-300 mb-4">
                For media inquiries, interview requests, or press opportunities, please contact our press team.
              </p>
              <a href="mailto:press@1strep.com">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  press@1strep.com
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Press Resources */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Press Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pressResources.map((resource, index) => (
              <div
                key={index}
                className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 hover:border-[#3c83f6] transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <FileText className="h-6 w-6 text-[#3c83f6] mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                    <p className="text-gray-300 text-base mb-3">{resource.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{resource.type}</span>
                      <span>•</span>
                      <span>{resource.size}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Press */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Recent Press</h2>
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    "1stRep Launches Sustainable Performance Line"
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">Fitness Magazine • December 2025</p>
                  <p className="text-gray-300 text-base">
                    1stRep introduces a new line of performance apparel made entirely from recycled materials, 
                    setting a new standard for sustainable athletic wear.
                  </p>
                </div>
                <Link href="#" className="text-[#3c83f6] hover:text-white transition-colors text-sm font-semibold">
                  Read Article →
                </Link>
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    "The Rise of Athlete-Founded Apparel Brands"
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">Sports Business Journal • November 2025</p>
                  <p className="text-gray-300 text-base">
                    How 1stRep and other athlete-founded brands are reshaping the performance apparel industry 
                    with community-driven approaches.
                  </p>
                </div>
                <Link href="#" className="text-[#3c83f6] hover:text-white transition-colors text-sm font-semibold">
                  Read Article →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Media Kit Request */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need a Custom Media Kit?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            For specific assets, custom photography, or tailored press materials, please contact our press team.
          </p>
          <a href="mailto:press@1strep.com">
            <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white">
              <Mail className="mr-2 h-4 w-4" />
              Request Media Kit
            </Button>
          </a>
        </section>
      </div>
    </ContentLayout>
  );
}

