// app/(site)/size-guide/page.tsx - Size Guide Page
import type { Metadata } from 'next';
import ContentLayout from '@/components/ContentLayout';

export const metadata: Metadata = {
  title: 'Size Guide',
  description: 'Find your perfect fit with our comprehensive size guide for men\'s and women\'s apparel.',
};

const sizeTables = {
  men: {
    tops: {
      headers: ['Size', 'Chest (inches)', 'Chest (cm)', 'Waist (inches)', 'Waist (cm)', 'Length (inches)', 'Length (cm)'],
      rows: [
        ['XS', '34-36', '86-91', '28-30', '71-76', '26', '66'],
        ['S', '36-38', '91-97', '30-32', '76-81', '27', '69'],
        ['M', '38-40', '97-102', '32-34', '81-86', '28', '71'],
        ['L', '40-42', '102-107', '34-36', '86-91', '29', '74'],
        ['XL', '42-44', '107-112', '36-38', '91-97', '30', '76'],
        ['2XL', '44-46', '112-117', '38-40', '97-102', '31', '79'],
      ],
    },
    bottoms: {
      headers: ['Size', 'Waist (inches)', 'Waist (cm)', 'Hip (inches)', 'Hip (cm)', 'Inseam (inches)', 'Inseam (cm)'],
      rows: [
        ['XS', '28-30', '71-76', '34-36', '86-91', '30', '76'],
        ['S', '30-32', '76-81', '36-38', '91-97', '31', '79'],
        ['M', '32-34', '81-86', '38-40', '97-102', '32', '81'],
        ['L', '34-36', '86-91', '40-42', '102-107', '33', '84'],
        ['XL', '36-38', '91-97', '42-44', '107-112', '34', '86'],
        ['2XL', '38-40', '97-102', '44-46', '112-117', '35', '89'],
      ],
    },
  },
  women: {
    tops: {
      headers: ['Size', 'Bust (inches)', 'Bust (cm)', 'Waist (inches)', 'Waist (cm)', 'Hip (inches)', 'Hip (cm)'],
      rows: [
        ['XS', '32-33', '81-84', '24-25', '61-64', '34-35', '86-89'],
        ['S', '34-35', '86-89', '26-27', '66-69', '36-37', '91-94'],
        ['M', '36-37', '91-94', '28-29', '71-74', '38-39', '97-99'],
        ['L', '38-39', '97-99', '30-31', '76-79', '40-41', '102-104'],
        ['XL', '40-42', '102-107', '32-34', '81-86', '42-44', '107-112'],
        ['2XL', '42-44', '107-112', '34-36', '86-91', '44-46', '112-117'],
      ],
    },
    bottoms: {
      headers: ['Size', 'Waist (inches)', 'Waist (cm)', 'Hip (inches)', 'Hip (cm)', 'Inseam (inches)', 'Inseam (cm)'],
      rows: [
        ['XS', '24-25', '61-64', '34-35', '86-89', '28', '71'],
        ['S', '26-27', '66-69', '36-37', '91-94', '29', '74'],
        ['M', '28-29', '71-74', '38-39', '97-99', '30', '76'],
        ['L', '30-31', '76-79', '40-41', '102-104', '31', '79'],
        ['XL', '32-34', '81-86', '42-44', '107-112', '32', '81'],
        ['2XL', '34-36', '86-91', '44-46', '112-117', '33', '84'],
      ],
    },
  },
};

export default function SizeGuidePage() {
  return (
    <ContentLayout
      title="Size Guide"
      description="Find your perfect fit. Use the measurements below to determine your size."
      maxWidth="4xl"
    >
      <div className="space-y-12 md:space-y-16">
        {/* How to Measure Section */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">How to Measure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">For Tops</h3>
              <ul className="space-y-2 text-gray-300 text-base">
                <li><strong className="text-white">Chest/Bust:</strong> Measure around the fullest part of your chest/bust, keeping the tape level</li>
                <li><strong className="text-white">Waist:</strong> Measure around your natural waistline, typically the narrowest part of your torso</li>
                <li><strong className="text-white">Length:</strong> Measure from the top of the shoulder down to the desired length</li>
              </ul>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">For Bottoms</h3>
              <ul className="space-y-2 text-gray-300 text-base">
                <li><strong className="text-white">Waist:</strong> Measure around your natural waistline</li>
                <li><strong className="text-white">Hip:</strong> Measure around the fullest part of your hips</li>
                <li><strong className="text-white">Inseam:</strong> Measure from the crotch to the bottom of the leg</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Men's Sizing */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Men's Sizing</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Tops & T-Shirts</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-gray-900/50 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-800">
                      {sizeTables.men.tops.headers.map((header, idx) => (
                        <th
                          key={idx}
                          className="px-4 py-3 text-left text-white font-semibold text-sm md:text-base border-b border-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeTables.men.tops.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={`px-4 py-3 text-gray-300 text-sm md:text-base ${
                              cellIdx === 0 ? 'font-semibold text-white' : ''
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Bottoms & Shorts</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-gray-900/50 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-800">
                      {sizeTables.men.bottoms.headers.map((header, idx) => (
                        <th
                          key={idx}
                          className="px-4 py-3 text-left text-white font-semibold text-sm md:text-base border-b border-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeTables.men.bottoms.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={`px-4 py-3 text-gray-300 text-sm md:text-base ${
                              cellIdx === 0 ? 'font-semibold text-white' : ''
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Women's Sizing */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Women's Sizing</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Tops & Sports Bras</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-gray-900/50 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-800">
                      {sizeTables.women.tops.headers.map((header, idx) => (
                        <th
                          key={idx}
                          className="px-4 py-3 text-left text-white font-semibold text-sm md:text-base border-b border-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeTables.women.tops.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={`px-4 py-3 text-gray-300 text-sm md:text-base ${
                              cellIdx === 0 ? 'font-semibold text-white' : ''
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Leggings & Bottoms</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-gray-900/50 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-800">
                      {sizeTables.women.bottoms.headers.map((header, idx) => (
                        <th
                          key={idx}
                          className="px-4 py-3 text-left text-white font-semibold text-sm md:text-base border-b border-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeTables.women.bottoms.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={`px-4 py-3 text-gray-300 text-sm md:text-base ${
                              cellIdx === 0 ? 'font-semibold text-white' : ''
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Fit Tips */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Fit Tips</h2>
          <ul className="space-y-3 text-gray-300 text-base md:text-lg">
            <li>• If you're between sizes, we recommend sizing up for a more comfortable fit</li>
            <li>• Our performance wear is designed with stretch, so consider this when selecting your size</li>
            <li>• For compression items, choose your true size for optimal performance</li>
            <li>• When in doubt, refer to the specific product page for fit notes and recommendations</li>
          </ul>
        </section>

        {/* Need Help Section */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Still Unsure About Your Size?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6">
            Our customer support team is here to help you find the perfect fit. Contact us for personalized sizing assistance.
          </p>
          <a
            href="/contact-support"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#3c83f6] text-white rounded-md hover:bg-[#2563eb] transition-colors font-semibold"
          >
            Contact Support
          </a>
        </section>
      </div>
    </ContentLayout>
  );
}

