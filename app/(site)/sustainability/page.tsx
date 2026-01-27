// app/(site)/sustainability/page.tsx - Sustainability Page
import type { Metadata } from 'next';
import ContentLayout from '@/components/ContentLayout';
import { Leaf, Recycle, Droplets, Factory } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sustainability',
  description: 'Learn about 1stRep\'s commitment to sustainability and ethical manufacturing practices.',
};

const initiatives = [
  {
    icon: Leaf,
    title: 'Sustainable Materials',
    description: 'We prioritize eco-friendly materials, including recycled polyester, organic cotton, and sustainable synthetics that reduce environmental impact without compromising performance.',
  },
  {
    icon: Recycle,
    title: 'Circular Economy',
    description: 'Our take-back program allows customers to return worn items for recycling, creating a circular lifecycle for our products and reducing waste.',
  },
  {
    icon: Droplets,
    title: 'Water Conservation',
    description: 'We partner with manufacturers who use water-efficient processes and innovative dyeing techniques that significantly reduce water consumption.',
  },
  {
    icon: Factory,
    title: 'Ethical Manufacturing',
    description: 'All our partners adhere to strict ethical standards, ensuring fair labor practices, safe working conditions, and living wages for all workers.',
  },
];

export default function SustainabilityPage() {
  return (
    <ContentLayout
      title="Sustainability"
      description="Our commitment to creating premium performance apparel while protecting our planet for future generations."
      maxWidth="4xl"
    >
      <div className="space-y-12 md:space-y-16">
        {/* Commitment Statement */}
        <section className="space-y-6">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            At 1stRep, we believe that performance and sustainability go hand in hand. We're committed 
            to creating exceptional athletic apparel while minimizing our environmental footprint and 
            promoting ethical practices throughout our supply chain.
          </p>
        </section>

        {/* Our Initiatives */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Our Sustainability Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initiatives.map((initiative, index) => {
              const Icon = initiative.icon;
              return (
                <div key={index} className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-[#3c83f6]/20 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-[#3c83f6]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{initiative.title}</h3>
                  </div>
                  <p className="text-gray-300 text-base leading-relaxed">{initiative.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Material Innovation */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Material Innovation</h2>
          <div className="bg-gray-900/50 rounded-lg p-6 md:p-8 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Recycled Materials</h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Over 60% of our products incorporate recycled materials, including plastic bottles 
                transformed into high-performance fabrics. This reduces waste and conserves natural resources.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Organic Cotton</h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Where cotton is used, we source organic cotton that's grown without harmful pesticides 
                and chemicals, protecting both the environment and farmers' health.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Biodegradable Options</h3>
              <p className="text-gray-300 text-base leading-relaxed">
                We're continuously exploring biodegradable and compostable materials that maintain 
                performance standards while reducing long-term environmental impact.
              </p>
            </div>
          </div>
        </section>

        {/* Supply Chain Transparency */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Supply Chain Transparency</h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            We believe in transparency and accountability. All our manufacturing partners undergo 
            rigorous audits to ensure compliance with environmental and social standards. We're 
            committed to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 text-base md:text-lg">
            <li>Fair labor practices and living wages</li>
            <li>Safe and healthy working conditions</li>
            <li>Environmental compliance and waste reduction</li>
            <li>Regular third-party audits and certifications</li>
            <li>Continuous improvement in sustainability metrics</li>
          </ul>
        </section>

        {/* Future Goals */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Our 2026 Goals</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[#3c83f6] font-bold text-lg">1.</span>
              <p className="text-gray-300 text-base">
                <strong className="text-white">100% Recycled Materials:</strong> Transition all product lines to use 100% recycled or sustainable materials by 2026.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#3c83f6] font-bold text-lg">2.</span>
              <p className="text-gray-300 text-base">
                <strong className="text-white">Carbon Neutral:</strong> Achieve carbon neutrality across our entire supply chain.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#3c83f6] font-bold text-lg">3.</span>
              <p className="text-gray-300 text-base">
                <strong className="text-white">Zero Waste Packaging:</strong> Eliminate single-use plastics and transition to 100% recyclable or compostable packaging.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#3c83f6] font-bold text-lg">4.</span>
              <p className="text-gray-300 text-base">
                <strong className="text-white">Water Neutral:</strong> Implement water-saving technologies to achieve water neutrality in manufacturing.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Join Us in Making a Difference</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Every purchase supports our sustainability initiatives. Together, we can create a more 
            sustainable future for performance apparel.
          </p>
          <a href="/shop-clean">
            <button className="px-6 py-3 bg-[#3c83f6] text-white rounded-md hover:bg-[#2563eb] transition-colors font-semibold">
              Shop Sustainable Products
            </button>
          </a>
        </section>
      </div>
    </ContentLayout>
  );
}

