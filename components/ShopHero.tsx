// components/ShopHero.tsx - Dynamic Hero Section for Shop Page
'use client';
import Image from 'next/image';
import { Category } from '@/lib/api/products';

interface ShopHeroProps {
  category?: Category | null;
  gender?: 'men' | 'women' | 'unisex' | null;
  title?: string;
  description?: string;
  image?: string;
}

export default function ShopHero({
  category,
  gender,
  title,
  description,
  image,
}: ShopHeroProps) {
  // Generate dynamic title based on filters
  const getTitle = () => {
    if (title) return title;
    
    if (category && gender) {
      const genderLabel = gender === 'men' ? 'Men' : gender === 'women' ? 'Women' : 'Unisex';
      return `${category.name} - ${genderLabel}`;
    }
    if (category) {
      return category.name;
    }
    if (gender) {
      const genderLabel = gender === 'men' ? "Men's" : gender === 'women' ? "Women's" : 'Unisex';
      return `${genderLabel} Collection`;
    }
    return 'Shop All Products';
  };

  // Generate dynamic description
  const getDescription = () => {
    if (description) return description;
    
    if (category && gender) {
      const genderLabel = gender === 'men' ? 'men' : gender === 'women' ? 'women' : 'all';
      return `Discover premium ${category.name.toLowerCase()} designed for ${genderLabel}. Performance meets style in every piece.`;
    }
    if (category) {
      return `Explore our complete ${category.name.toLowerCase()} collection. Premium quality for every occasion.`;
    }
    if (gender) {
      const genderLabel = gender === 'men' ? "men's" : gender === 'women' ? "women's" : 'unisex';
      return `Shop the latest ${genderLabel} collection. Performance apparel designed for athletes who never settle.`;
    }
    return 'Discover premium performance apparel. It all starts with your 1st Rep.';
  };

  // Get hero image - use category image, product image, or null
  const heroImage = image || category?.image || null;

  return (
    <section className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[24/9] bg-[#000000] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {heroImage ? (
          <>
            <Image
              src={heroImage}
              alt={getTitle()}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              quality={90}
            />
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gray-900" />
        )}
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl w-full space-y-4 md:space-y-6">
          {/* Badge */}
          <div className="inline-block">
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[#3c83f6] bg-[#3c83f6]/10 px-4 py-2 rounded-full border border-[#3c83f6]/30">
              {category ? 'Collection' : gender ? 'Shop' : 'All Products'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
            {getTitle()}
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {getDescription()}
          </p>
        </div>
      </div>
    </section>
  );
}

