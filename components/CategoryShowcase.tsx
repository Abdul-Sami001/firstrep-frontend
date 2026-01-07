// components/CategoryShowcase.tsx - Alternating Text/Image Layout
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/lib/api/products';

interface CategoryShowcaseProps {
  category: Category;
  badge?: string;
  description?: string;
  image?: string;
  imagePosition?: 'left' | 'right';
  index: number;
}

export default function CategoryShowcase({
  category,
  badge = 'Collection',
  description,
  image,
  imagePosition = 'right',
  index,
}: CategoryShowcaseProps) {
  const isImageLeft = imagePosition === 'left';
  
  // Priority: 1. category.image (new API field), 2. passed image prop, 3. null (no fallback)
  const displayImage = category.image || image || null;
  const hoverImage = category.hover_image || null;

  return (
    <section className="bg-[#000000] py-12 md:py-16 lg:py-20">
      <div className="mobile-container tablet-container desktop-container">
        <div
          className={`flex flex-col ${
            isImageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'
          } items-center gap-8 md:gap-12 lg:gap-16`}
        >
          {/* Text Content */}
          <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left">
            {badge && (
              <span className="inline-block text-xs md:text-sm font-semibold uppercase tracking-wider text-[#3c83f6]">
                {badge}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
              {category.name}
            </h2>
            {description && (
              <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
                {description}
              </p>
            )}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href={`/shop-clean?category=${encodeURIComponent(category.name)}&gender=men`}>
                <Button
                  variant="outline"
                  className="uppercase font-semibold border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 px-6 md:px-8 py-6 md:py-7 text-sm md:text-base"
                >
                  Shop Men
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/shop-clean?category=${encodeURIComponent(category.name)}&gender=women`}>
                <Button
                  variant="outline"
                  className="uppercase font-semibold border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 px-6 md:px-8 py-6 md:py-7 text-sm md:text-base"
                >
                  Shop Women
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Content */}
          <div className="flex-1 w-full">
            <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-square overflow-hidden rounded-lg group">
              {/* Main Image */}
              {displayImage ? (
                <>
                  <Image
                    src={displayImage}
                    alt={category.name}
                    fill
                    className={`object-cover transition-all duration-700 ${
                      hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    priority={index < 2}
                    quality={90}
                  />
                  {/* Hover Image - Using new API field */}
                  {hoverImage && (
                    <Image
                      src={hoverImage}
                      alt={`${category.name} hover`}
                      fill
                      className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                      quality={90}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500 text-sm md:text-base">No Image Available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

