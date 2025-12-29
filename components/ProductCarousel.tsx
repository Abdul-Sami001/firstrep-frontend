// components/ProductCarousel.tsx - Product Grid/Carousel Component
'use client';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import ProductGridSkeleton from './ProductGridSkeleton';
import { Product } from '@/lib/api/products';

interface ProductCarouselProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error | null;
  title?: string;
  showNavigation?: boolean;
}

export default function ProductCarousel({
  products,
  isLoading = false,
  error = null,
  title,
  showNavigation = true,
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 320; // Card width + gap
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {title && (
          <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>
        )}
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-400">Unable to load products. Please try again later.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-400">No products available in this section.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {title && (
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">{title}</h3>
      )}
      
      {/* Desktop: Grid Layout */}
      <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map((product, index) => (
          <ProductCard
            key={product.id || index}
            product={product}
            priority={index < 4}
          />
        ))}
      </div>

      {/* Mobile/Tablet: Scrollable Carousel */}
      <div className="lg:hidden relative">
        {showNavigation && products.length > 2 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
        
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4"
        >
          {products.map((product, index) => (
            <div
              key={product.id || index}
              className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
            >
              <ProductCard
                product={product}
                priority={index < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

