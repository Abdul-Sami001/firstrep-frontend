// app/(site)/page.tsx - Redesigned to match reference site with dark theme
'use client';
import { useCategories, useProducts } from '@/hooks/useProducts';
import CategoryShowcase from '@/components/CategoryShowcase';
import ProductCarousel from '@/components/ProductCarousel';
import CategorySectionSkeleton from '@/components/CategorySectionSkeleton';
import GenderSelector from '@/components/GenderSelector';

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

  // YouTube video embed URL (from reference site)
  const youtubeVideoUrl = 'https://www.youtube.com/embed/BYfw1tBH5dM?list=TLGG6zh_FWpJjJEyNTEyMjAyNQ&autoplay=1&mute=1&loop=1&playlist=BYfw1tBH5dM';

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Hero Video Section - Full Width */}
      <section className="relative w-full aspect-video md:aspect-[16/9] bg-[#000000]">
        <iframe
          src={youtubeVideoUrl}
          title="1stRep Video"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
      </section>

      {/* Gender Selector - Dark Theme */}
      <div className="bg-[#000000] border-y border-gray-800">
        <GenderSelector />
      </div>

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
          </div>
        </section>
      )}
    </>
  );
}
