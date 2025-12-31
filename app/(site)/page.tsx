// app/(site)/page.tsx - Redesigned to match reference site with dark theme
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useCategories, useProducts } from '@/hooks/useProducts';
import CategoryShowcase from '@/components/CategoryShowcase';
import ProductCarousel from '@/components/ProductCarousel';
import CategorySectionSkeleton from '@/components/CategorySectionSkeleton';
import { Button } from '@/components/ui/button';

// Category badge types matching reference site
const CATEGORY_BADGES: Record<string, string> = {
  'Hoodies and Sweaters': 'Collection',
  'T-Shirts': 'Essentials',
  'Leggings': 'Performance Range',
  'Bra': 'Training Essentials',
  'Vests & Crop Tops': 'New Arrival',
  'Shorts': 'Featured',
  'Hats': 'Collection',
  'Accessories': 'Essentials',
  'Robe': 'Performance Range',
  'Jackets': 'Training Essentials',
};

// Default category descriptions
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Hoodies and Sweaters': 'Premium hoodies and sweaters designed for comfort and style. Perfect for your active lifestyle.',
  'T-Shirts': 'Essential t-shirts crafted with premium materials. Versatile designs for every occasion.',
  'Leggings': 'High-performance leggings engineered for movement. Built to support your active lifestyle.',
  'Bra': 'Supportive and stylish sports bras. Designed for comfort during your toughest workouts.',
  'Vests & Crop Tops': 'Trendy vests and crop tops. Fresh designs that keep you cool and confident.',
  'Shorts': 'Performance shorts built for action. Lightweight and durable for any activity.',
  'Hats': 'Stylish headwear to complete your look. Quality caps for every season.',
  'Accessories': 'Essential accessories to elevate your style. From bags to gear, we have you covered.',
  'Robe': 'Luxurious robes for post-workout recovery. Comfort meets style.',
  'Jackets': 'Weather-ready jackets for any condition. Protection without compromising style.',
};

export default function HomePage() {
  // Fetch categories with proper error handling
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Categories is already an array from useCategories hook
  const categoriesList = Array.isArray(categories) ? categories : [];

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Modern Hero Section - Exact Viewport Height with Responsive Design */}
      {/* Account for: Header heights (3.5rem=56px mobile, 4rem=64px tablet, 4.5rem=72px desktop) */}
      <section className="relative w-full hero-viewport-height bg-[#000000] overflow-hidden">
        {/* Responsive Background Image with Next.js Image Component */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/hero-section-image.webp"
            alt="1stRep Hero"
            fill
            priority
            quality={90}
            className="object-cover hero-image-position"
            sizes="100vw"
          />
        </div>

        {/* Modern Gradient Overlay - Enhanced for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
        
        {/* Content Container - Modern Layout */}
        <div className="relative z-10 h-full flex flex-col justify-end items-center pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-4 sm:px-6 md:px-8">
          {/* Gender Selector Buttons - Modern Design with Animation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full max-w-2xl animate-fade-in-up">
            <Link 
              href="/shop-clean?gender=men"
              className="w-full sm:w-auto group"
            >
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto uppercase font-bold tracking-wider border-2 border-white/30 backdrop-blur-sm bg-white/5 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-500 ease-out px-8 sm:px-10 md:px-12 py-6 sm:py-7 md:py-8 text-sm sm:text-base md:text-lg shadow-lg hover:shadow-2xl hover:scale-105 transform"
              >
                Men
              </Button>
            </Link>
            <Link 
              href="/shop-clean?gender=women"
              className="w-full sm:w-auto group"
            >
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto uppercase font-bold tracking-wider border-2 border-white/30 backdrop-blur-sm bg-white/5 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-500 ease-out px-8 sm:px-10 md:px-12 py-6 sm:py-7 md:py-8 text-sm sm:text-base md:text-lg shadow-lg hover:shadow-2xl hover:scale-105 transform"
              >
                Women
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Showcase Sections with Alternating Layout */}
      {categoriesLoading ? (
        <div className="space-y-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <CategorySectionSkeleton key={i} />
          ))}
        </div>
      ) : categoriesError ? (
        <div className="bg-[#000000] text-center py-20">
          <p className="text-sm text-gray-400">Unable to load categories. Please try again later.</p>
        </div>
      ) : Array.isArray(categoriesList) && categoriesList.length > 0 ? (
        <div className="space-y-0">
          {categoriesList.map((category, index) => {
            // Ensure category has required fields
            if (!category || !category.id || !category.name) {
              return null;
            }
            
            // Alternate image position: even index = right, odd index = left
            const imagePosition = index % 2 === 0 ? 'right' : 'left';
            
            return (
              <CategoryShowcaseWithProducts
                key={category.id}
                category={category}
                badge={CATEGORY_BADGES[category.name] || 'Collection'}
                description={CATEGORY_DESCRIPTIONS[category.name] || `Explore our ${category.name} collection. Premium quality for every occasion.`}
                imagePosition={imagePosition}
                index={index}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-[#000000] text-center py-20">
          <p className="text-sm text-gray-400">No categories available yet.</p>
        </div>
      )}
    </div>
  );
}

// Category Showcase with Products Component
function CategoryShowcaseWithProducts({
  category,
  badge,
  description,
  imagePosition,
  index,
}: {
  category: any;
  badge: string;
  description: string;
  imagePosition: 'left' | 'right';
  index: number;
}) {
  const categorySlug = category?.slug || '';

  // Fetch products for this category
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts({
    category__slug: categorySlug,
    is_active: true,
    page_size: 4,
  });

  const products = Array.isArray(productsData) ? productsData : productsData?.results || [];
  
  // Get category image from first product if available
  const categoryImage = products?.[0]?.images?.[0]?.image;

  return (
    <>
      {/* Category Showcase Section */}
      <CategoryShowcase
        category={category}
        badge={badge}
        description={description}
        image={categoryImage}
        imagePosition={imagePosition}
        index={index}
      />
      
      {/* Product Carousel Section */}
      {products.length > 0 && (
        <section className="bg-[#000000] py-12 md:py-16 lg:py-20">
          <div className="mobile-container tablet-container desktop-container">
            <ProductCarousel
              products={products}
              isLoading={productsLoading}
              error={productsError}
            />
            {/* View All Button */}
            <div className="mt-8 md:mt-12 flex justify-center">
              <Link href={`/shop-clean?category=${encodeURIComponent(category.name)}`}>
                <Button
                  variant="outline"
                  className="uppercase font-semibold border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 px-8 md:px-10 py-6 md:py-7 text-sm md:text-base"
                >
                  View All {category.name}
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
