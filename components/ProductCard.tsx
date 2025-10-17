// components/ProductCard.tsx - Mobile-First with Next.js Image
import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  hoverImage?: string;
  category?: string;
  onToggleWishlist?: (id: string) => void;
  isWishlisted?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  hoverImage,
  category = 'general',
  onToggleWishlist,
  isWishlisted = false
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      name,
      price,
      image,
      size: 'M',
      color: 'Default',
      category
    });
    console.log(`Added ${name} to cart`);
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-product-${id}`}
    >
      {/* Mobile-First Image Container */}
      <div className="relative aspect-[2/3] md:aspect-[3/4] overflow-hidden rounded-md bg-muted mb-3">
        <Link href={`/product/${id}`} className="absolute inset-0 z-10">
          <span className="sr-only">View {name}</span>
        </Link>

        {/* Main Image with Loading State */}
        <Image
          src={image}
          alt={name}
          fill
          className={`object-cover transition-opacity duration-300 ${isHovered && hoverImage ? 'opacity-0' : 'opacity-100'
            } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onLoad={() => setImageLoading(false)}
          quality={85}
        />

        {/* Hover Image */}
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${name} alternate view`}
            fill
            className={`object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
          />
        )}

        {/* Loading State */}
        {imageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist?.(id);
            console.log(`Wishlist toggled for ${name}`);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover-elevate z-20 touch-target-sm"
          data-testid={`button-wishlist-${id}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-destructive' : ''}`} />
        </button>

        {/* Add to Cart Button */}
        <Button
          size="sm"
          onClick={handleAddToCart}
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-opacity duration-300 z-20 touch-target ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          data-testid={`button-add-to-cart-${id}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>

      {/* Mobile-First Product Info */}
      <div className="space-y-1">
        <Link
          href={`/product/${id}`}
          className="text-sm md:text-base font-medium cursor-pointer hover:text-primary transition-colors"
          data-testid={`text-product-name-${id}`}
        >
          {name}
        </Link>
        <p className="text-base md:text-lg font-semibold" data-testid={`text-product-price-${id}`}>
          ${price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}