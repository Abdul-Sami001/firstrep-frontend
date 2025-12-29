// components/ContentLayout.tsx - Reusable layout for content pages with proper spacing
'use client';
import { ReactNode } from 'react';

interface ContentLayoutProps {
  title: string;
  children: ReactNode;
  description?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-3xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
  '2xl': 'max-w-6xl',
  '4xl': 'max-w-7xl',
};

export default function ContentLayout({
  title,
  children,
  description,
  maxWidth = '4xl',
}: ContentLayoutProps) {
  return (
    <div className="min-h-screen bg-[#000000] pt-20 md:pt-24">
      {/* Page Header */}
      <section className="bg-[#000000] border-b border-gray-800 py-12 md:py-16 lg:py-20">
        <div className="mobile-container tablet-container desktop-container">
          <div className={`${maxWidthClasses[maxWidth]} mx-auto text-center`}>
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
          <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}

