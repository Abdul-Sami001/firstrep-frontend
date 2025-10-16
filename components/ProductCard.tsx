import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string ;
  hoverImage?: string;
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
  isWishlisted?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  hoverImage,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-product-${id}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-muted mb-3">
        <Link href={`/product/${id}`} className="absolute inset-0 z-10">
          <span className="sr-only">View {name}</span>
        </Link>

        <img
          src={image}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered && hoverImage ? 'opacity-0' : 'opacity-100'
            }`}
        />
        {hoverImage && (
          <img
            src={hoverImage}
            alt={`${name} alternate view`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
              }`}
          />
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist?.(id);
            console.log(`Wishlist toggled for ${name}`);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover-elevate z-20"
          data-testid={`button-wishlist-${id}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-destructive' : ''}`} />
        </button>

        <Button
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart?.(id);
            console.log(`Added ${name} to cart`);
          }}
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-opacity duration-300 z-20 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          data-testid={`button-add-to-cart-${id}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>

      <div className="space-y-1">
        <Link
          href={`/product/${id}`}
          className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
          data-testid={`text-product-name-${id}`}
        >
          {name}
        </Link>
        <p className="text-base font-semibold" data-testid={`text-product-price-${id}`}>
          ${price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}