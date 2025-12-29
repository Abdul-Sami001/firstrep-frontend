// components/StaticPageLayout.tsx - Reusable layout for static pages
'use client';
import { ReactNode } from 'react';

interface StaticPageLayoutProps {
  title: string;
  children: ReactNode;
  description?: string;
}

export default function StaticPageLayout({
  title,
  children,
  description,
}: StaticPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Page Header */}
      <section className="bg-[#000000] border-b border-gray-800 py-12 md:py-16 lg:py-20">
        <div className="mobile-container tablet-container desktop-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6">
              {title}
            </h1>
            {description && (
              <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Page Content */}
      <section className="bg-[#000000] py-8 md:py-12 lg:py-16">
        <div className="mobile-container tablet-container desktop-container">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}

