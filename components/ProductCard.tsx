// components/ProductCard.tsx - Production-Ready Version
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/api/products';
import RatingStars from './RatingStars';
import WishlistButton from './WishlistButton';

interface ProductCardProps {
  product: Product | {
    id: string;
    name: string;
    price: number;
    image: string;
    hoverImage?: string;
    category?: string;
  };
  priority?: boolean;
}

export default function ProductCard({
  product,
  priority = false
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { addToCart } = useCart();

  const isApiProduct = 'title' in product;

  const productId = product?.id || '';
  const productName = isApiProduct ? product?.title || '' : product?.name || '';
  const productPrice = product?.price || 0;

  const primaryImage = isApiProduct
    ? product?.images?.find(img => img?.position === 0)?.image ||
    product?.images?.[0]?.image ||
    '/attached_assets/placeholder.jpg'
    : product?.image || '/attached_assets/placeholder.jpg';

  const hoverImage = isApiProduct
    ? product?.images?.find(img => img?.position === 1)?.image || ''
    : 'hoverImage' in product ? (product as any)?.hoverImage : '';

  const defaultVariant = isApiProduct
    ? product?.variants?.find(v => v?.is_active) || product?.variants?.[0]
    : {
      attributes: { size: 'M', color: 'Default' },
      stock: 10,
      is_active: true
    };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant || (isApiProduct && (defaultVariant as any)?.stock <= 0)) return;

    // Fix: Pass only the IDs as strings, not objects
    addToCart(
      productId,                     // Just the product ID string
      isApiProduct ? (defaultVariant as any)?.id : undefined,  // Just the variant ID string
      1                              // quantity
    );
  };
  const toNum = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v || 0)));

  const computedPrice =
    isApiProduct && 'price_override' in defaultVariant && defaultVariant.price_override != null
      ? toNum(defaultVariant.price_override)
      : toNum(productPrice);

  const formatPrice = () => {
    const currency = isApiProduct ? product?.currency || 'USD' : 'USD';
    const price = computedPrice

    return (
      <span className="text-base md:text-lg font-semibold text-white">
        {currency} {Number(price).toFixed(2)}
      </span>
    );
  };

  const isInStock = isApiProduct
    ? (product?.total_stock ? product.total_stock > 0 : (defaultVariant ? (defaultVariant as any)?.stock > 0 : false))
    : true;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-product-${productId}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] md:aspect-[3/4] overflow-hidden rounded-md bg-gray-900 mb-3">

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
        {isApiProduct && product?.popularity && product.popularity > 100 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-[#00bfff] to-[#0ea5e9] text-white px-2.5 py-1 rounded-md text-xs font-semibold z-20 shadow-lg shadow-[#00bfff]/30">
            Popular
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-3 left-3 z-30">
          <WishlistButton 
            productId={productId}
            variantId={isApiProduct ? (defaultVariant as any)?.id : undefined}
            size="sm"
            variant="outline"
            data-testid={`button-wishlist-${productId}`}
          />
        </div>

        {/* Gradient Overlay at Bottom for Button */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-20" />
        
        {/* Add to Cart Button - Always Visible */}
        {isInStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#00bfff] hover:bg-[#0099cc] text-white font-medium text-xs md:text-sm px-5 py-2.5 rounded-full shadow-lg shadow-[#00bfff]/30 hover:shadow-[#00bfff]/50 transition-all duration-300 border-0 flex items-center justify-center gap-2 z-30 hover:scale-105 active:scale-95 backdrop-blur-md"
            data-testid={`button-add-to-cart-${productId}`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
        
        {/* Out of Stock Badge */}
        {!isInStock && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-gray-400 text-xs md:text-sm px-5 py-2.5 rounded-full border border-gray-700 z-30">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <Link
          href={`/product/${productId}`}
          className="text-sm md:text-base font-medium cursor-pointer text-white hover:text-gray-300 transition-colors"
          data-testid={`text-product-name-${productId}`}
        >
          {productName}
        </Link>

        <div className="text-white" data-testid={`text-product-price-${productId}`}>
          {formatPrice()}
        </div>

        {/* Rating Display */}
        {isApiProduct && product?.average_rating && product.average_rating > 0 && (
          <div className="flex items-center gap-2">
            <RatingStars 
              rating={product.average_rating} 
              size="sm" 
              data-testid={`rating-stars-${productId}`}
            />
            <span className="text-xs text-gray-400">
              ({product?.review_count || 0})
            </span>
          </div>
        )}

        {isApiProduct && product?.category && (
          <div className="text-xs text-gray-400 capitalize">
            {product.category?.name || ''}
          </div>
        )}

        {isApiProduct && (
          <div className="text-xs text-gray-400">
            {isInStock ? `${product?.total_stock || (defaultVariant as any)?.stock || 0} in stock` : 'Out of stock'}
          </div>
        )}
      </div>
    </div>
  );
}