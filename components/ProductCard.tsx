// components/ProductCard.tsx - Fix Type Compatibility
import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/api/products'; // Import your actual Product type

interface ProductCardProps {
  product: Product | {
    id: string;
    name: string;
    price: number;
    image: string;
    hoverImage?: string;
    category?: string;
  };
  onToggleWishlist?: (id: string) => void;
  isWishlisted?: boolean;
  priority?: boolean;
}

export default function ProductCard({
  product,
  onToggleWishlist,
  isWishlisted = false,
  priority = false
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { addToCart } = useCart();

  // ✅ Detect if it's an API product or frontend product
  const isApiProduct = 'title' in product;

  // ✅ Extract data based on product type
  const productId = product.id;
  const productName = isApiProduct ? product.title : product.name;
  const productPrice = product.price;

  // ✅ Handle images for both types
  const primaryImage = isApiProduct
    ? product.images?.find(img => img.position === 0)?.image || product.images?.[0]?.image || ''
    : product.image;

  const hoverImage = isApiProduct
    ? product.images?.find(img => img.position === 1)?.image || ''
    : 'hoverImage' in product ? product.hoverImage : '';

  // ✅ Handle variants for both types - Fix the type issue
  const defaultVariant = isApiProduct
    ? product.variants?.find(v => v.is_active) || product.variants?.[0]
    : {
      attributes: { size: 'M', color: 'Default' },
      stock: 10,
      is_active: true
    };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant || defaultVariant.stock <= 0) return;

    // ✅ Fix variant attributes access
    const variantSize = isApiProduct
      ? (defaultVariant.attributes as any)?.size || 'M'
      : defaultVariant.attributes.size;

    const variantColor = isApiProduct
      ? (defaultVariant.attributes as any)?.color || 'Default'
      : defaultVariant.attributes.color;

    addToCart({
      id: productId,
      name: productName,
      price: isApiProduct && 'price_override' in defaultVariant
        ? (defaultVariant.price_override || productPrice)
        : productPrice,
      image: primaryImage,
      size: variantSize,
      color: variantColor,
      category: isApiProduct
        ? product.category?.slug || 'general'
        : 'category' in product ? product.category || 'general' : 'general'
    });

    console.log(`Added ${productName} to cart`);
  };

  // ✅ Format price with currency
  const formatPrice = () => {
    const currency = isApiProduct ? product.currency : 'USD';
    const price = isApiProduct && 'price_override' in defaultVariant
      ? (defaultVariant.price_override || productPrice)
      : productPrice;

    return (
      <span className="text-base md:text-lg font-semibold">
        {currency} {price.toFixed(2)}
      </span>
    );
  };

  // ✅ Check if product is in stock
  const isInStock = isApiProduct
    ? (product.total_stock ? product.total_stock > 0 : (defaultVariant ? defaultVariant.stock > 0 : false))
    : true; // Frontend products are always in stock

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-product-${productId}`}
    >
      {/* Mobile-First Image Container */}
      <div className="relative aspect-[2/3] md:aspect-[3/4] overflow-hidden rounded-md bg-muted mb-3">
        <Link href={`/product/${productId}`} className="absolute inset-0 z-10">
          <span className="sr-only">View {productName}</span>
        </Link>

        {/* Main Image with Loading State */}
        {primaryImage && (
          <Image
            src={primaryImage}
            alt={productName}
            fill
            className={`object-cover transition-opacity duration-300 ${isHovered && hoverImage ? 'opacity-0' : 'opacity-100'
              } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onLoad={() => setImageLoading(false)}
            priority={priority}
            quality={85}
          />
        )}

        {/* Hover Image */}
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${productName} alternate view`}
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

        {/* Stock Status */}
        {!isInStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <span className="text-white font-semibold text-sm">Out of Stock</span>
          </div>
        )}

        {/* Popularity Badge */}
        {isApiProduct && product.popularity && product.popularity > 100 && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold z-20">
            Popular
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist?.(productId);
            console.log(`Wishlist toggled for ${productName}`);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover-elevate z-20 touch-target-sm"
          data-testid={`button-wishlist-${productId}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-destructive' : ''}`} />
        </button>

        {/* Add to Cart Button */}
        {isInStock && (
          <Button
            size="sm"
            onClick={handleAddToCart}
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-opacity duration-300 z-20 touch-target ${isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            data-testid={`button-add-to-cart-${productId}`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        )}
      </div>

      {/* Mobile-First Product Info */}
      <div className="space-y-1">
        <Link
          href={`/product/${productId}`}
          className="text-sm md:text-base font-medium cursor-pointer hover:text-primary transition-colors"
          data-testid={`text-product-name-${productId}`}
        >
          {productName}
        </Link>

        {/* Price */}
        <div data-testid={`text-product-price-${productId}`}>
          {formatPrice()}
        </div>

        {/* Category */}
        {isApiProduct && product.category && (
          <div className="text-xs text-muted-foreground capitalize">
            {product.category.name}
          </div>
        )}

        {/* Stock Info */}
        {isApiProduct && (
          <div className="text-xs text-muted-foreground">
            {isInStock ? `${product.total_stock || defaultVariant?.stock || 0} in stock` : 'Out of stock'}
          </div>
        )}
      </div>
    </div>
  );
}