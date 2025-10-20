// components/ProductCard.tsx - Production-Ready Version
import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/api/products';

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

  const isApiProduct = 'title' in product;

  const productId = product.id;
  const productName = isApiProduct ? product.title : product.name;
  const productPrice = product.price;

  const primaryImage = isApiProduct
    ? product.images?.find(img => img.position === 0)?.image ||
    product.images?.[0]?.image ||
    '/attached_assets/placeholder.jpg'
    : product.image;

  const hoverImage = isApiProduct
    ? product.images?.find(img => img.position === 1)?.image || ''
    : 'hoverImage' in product ? product.hoverImage : '';

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

    if (!defaultVariant || (isApiProduct && defaultVariant.stock <= 0)) return;

    const variantSize = isApiProduct
      ? (defaultVariant.attributes as any)?.size || 'M'
      : defaultVariant.attributes.size;

    const variantColor = isApiProduct
      ? (defaultVariant.attributes as any)?.color || 'Default'
      : defaultVariant.attributes.color;

    addToCart(
      {
        id: productId,
        name: productName,
        price: computedPrice,
        image: primaryImage,
        size: variantSize,
        color: variantColor,
        category: isApiProduct
          ? product.category?.slug || 'general'
          : 'category' in product ? product.category || 'general' : 'general'
      },
      { variantId: isApiProduct ? (defaultVariant as any)?.id : undefined, quantity: 1 }
    );
  };

  const toNum = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v || 0)));

  const computedPrice =
    isApiProduct && 'price_override' in defaultVariant && defaultVariant.price_override != null
      ? toNum(defaultVariant.price_override)
      : toNum(productPrice);

  const formatPrice = () => {
    const currency = isApiProduct ? product.currency : 'USD';
    const price = computedPrice

    return (
      <span className="text-base md:text-lg font-semibold">
        {currency} {Number(price).toFixed(2)}
      </span>
    );
  };

  const isInStock = isApiProduct
    ? (product.total_stock ? product.total_stock > 0 : (defaultVariant ? (defaultVariant as any).stock > 0 : false))
    : true;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-product-${productId}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] md:aspect-[3/4] overflow-hidden rounded-md bg-muted mb-3">

        {/* Click only the image to navigate (not the whole surface) */}
        <Link href={`/product/${productId}`} className="relative block h-full w-full">
          <span className="sr-only">View {productName}</span>
          {primaryImage && (
            <Image
              src={primaryImage}
              alt={productName}
              fill
              className={`object-cover transition-opacity duration-300 ${isHovered && hoverImage ? 'opacity-0' : 'opacity-100'} ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onLoad={() => setImageLoading(false)}
              priority={priority}
              quality={85}
            />
          )}
        </Link>

        {/* Hover Image */}
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${productName} alternate view`}
            fill
            className={`object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
          />
        )}

        {/* Loading State */}
        {imageLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}

        {/* Popularity Badge */}
        {isApiProduct && product.popularity && product.popularity > 100 && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold z-20">
            Popular
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist?.(productId);
          }}
          className="absolute top-3 left-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 z-30"
          data-testid={`button-wishlist-${productId}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Add to Cart Button (bottom centered with extra margin) */}
        {isInStock && (
          <Button
            size="sm"
            onClick={handleAddToCart}
            className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-300 z-30 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            data-testid={`button-add-to-cart-${productId}`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <Link
          href={`/product/${productId}`}
          className="text-sm md:text-base font-medium cursor-pointer hover:text-primary transition-colors"
          data-testid={`text-product-name-${productId}`}
        >
          {productName}
        </Link>

        <div data-testid={`text-product-price-${productId}`}>
          {formatPrice()}
        </div>

        {isApiProduct && product.category && (
          <div className="text-xs text-muted-foreground capitalize">
            {product.category.name}
          </div>
        )}

        {isApiProduct && (
          <div className="text-xs text-muted-foreground">
            {isInStock ? `${product.total_stock || (defaultVariant as any)?.stock || 0} in stock` : 'Out of stock'}
          </div>
        )}
      </div>
    </div>
  );
}