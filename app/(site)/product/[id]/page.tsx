// app/(site)/product/[id]/page.tsx - Production-ready product details
'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProductCard from '@/components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useProductRatingStats, useProductReviews } from '@/hooks/useReviews';
import { useCart } from '@/contexts/CartContext';
import { ProductVariant, ProductImage } from '@/lib/api/products';
import RatingSummary from '@/components/RatingSummary';
import WishlistButton from '@/components/WishlistButton';

export default function ProductDetailPage() {
    const { id } = useParams() as { id: string };

    // Always call hooks in a stable order
    const { data: product, isLoading: productLoading, error: productError } = useProduct(id);
    const { data: ratingStats } = useProductRatingStats(id);
    const { data: recentReviews, isLoading: reviewsLoading, error: reviewsError } = useProductReviews(id, { page_size: 3 });

    const relatedFilters = useMemo(
        () => ({
            category__slug: product?.category?.slug,
            is_active: true,
            page_size: 8,
            ordering: '-created_at' as const,
        }),
        [product?.category?.slug]
    );
    const { data: relatedResp } = useProducts(relatedFilters);

    const relatedProducts = useMemo(() => {
        const list = Array.isArray(relatedResp) ? relatedResp : relatedResp?.results ?? [];
        return list.filter((p: any) => p.id !== id).slice(0, 8);
    }, [relatedResp, id]);

    const { addToCart } = useCart();

    // Local state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Default active variant
    useEffect(() => {
        if (product?.variants?.length) {
            const active = product.variants.find(v => v?.is_active) || product.variants?.[0];
            setSelectedVariant(active || null);
        }
    }, [product]);

    const toNum = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v || 0)));

    // Format currency code to symbol
    const formatCurrency = (currency: string) => {
      if (currency === 'GBP') return '£';
      if (currency === 'USD') return '$';
      if (currency === 'EUR') return '€';
      return currency; // Fallback to code if unknown
    };

    // Get pricing information using new pricing system
    const getDisplayPrice = () => {
      if (selectedVariant?.price_override != null) {
        return toNum(selectedVariant.price_override);
      }
      return product?.current_price ?? product?.retail_price ?? product?.price ?? 0;
    };
    
    const getRetailPrice = () => {
      if (selectedVariant?.price_override != null) {
        return toNum(selectedVariant.price_override);
      }
      return product?.retail_price ?? product?.price ?? 0;
    };
    
    const isOnSale = product?.is_on_sale ?? false;
    const saleInfo = product?.sale_info;
    const displayPrice = getDisplayPrice();
    const retailPrice = getRetailPrice();
    const currencySymbol = formatCurrency(product?.currency || 'GBP');

    // Get images: use variant images if available, otherwise fall back to product images
    // Handle both snake_case (from API) and camelCase (if transformed)
    const images = useMemo(() => {
        const variantImages = selectedVariant?.images || (selectedVariant as any)?.Images || [];
        if (variantImages && variantImages.length > 0) {
            return variantImages;
        }
        return product?.images ?? [];
    }, [selectedVariant, product?.images]);

    // Reset image index when variant changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedVariant?.id]);

    const heroSrc = images[currentImageIndex]?.image || '';
    const heroAlt = images[currentImageIndex]?.alt_text || product?.title || 'Product image';

    // Get all available sizes from all active variants (show all options)
    const availableSizes = useMemo(() => {
        const variants = (product?.variants ?? []).filter(v => v.is_active);
        
        return Array.from(
            new Set(
                variants
                    .map(v => (v.attributes as any)?.size)
                    .filter(Boolean)
            )
        ).sort(); // Sort for consistent display
    }, [product?.variants]);

    // Get all available colors from all active variants (show all options)
    const availableColors = useMemo(() => {
        const variants = (product?.variants ?? []).filter(v => v.is_active);
        
        return Array.from(
            new Set(
                variants
                    .map(v => (v.attributes as any)?.color)
                    .filter(Boolean)
            )
        ).sort(); // Sort for consistent display
    }, [product?.variants]);

    const handleAddToCart = () => {
        if (!product || !selectedVariant || (selectedVariant?.stock ?? 0) <= 0) return;

        // Fix: Pass only the IDs as strings, not objects
        addToCart(
            product?.id || '',                    // Just the product ID string
            selectedVariant?.id || '',            // Just the variant ID string  
            1                              // quantity
        );
    };

    if (productLoading) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
                    <p className="text-gray-300">Loading product...</p>
                </div>
            </div>
        );
    }

    if (productError || !product) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4 text-white">Product Not Found</h1>
                    <p className="text-gray-300 mb-8">The product you're looking for doesn't exist.</p>
                    <Link href="/">
                        <Button className="bg-[#3c83f6] hover:bg-[#2563eb] text-white">Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000]">
            {/* Breadcrumb */}
            <div className="border-b border-gray-800 bg-[#000000]">
                <div className="mobile-container tablet-container desktop-container">
                    <div className="py-3 md:py-4">
                        <div className="text-sm md:text-base text-gray-300">
                            <Link href="/" className="hover:text-white transition-colors" data-testid="link-home">
                                Home
                            </Link>
                            <span className="mx-2 text-gray-500">/</span>
                            {product?.category && (
                                <>
                                    <Link
                                        href={`/shop-clean?category=${encodeURIComponent(product.category?.name || '')}`}
                                        className="hover:text-white transition-colors capitalize"
                                        data-testid="link-collection"
                                    >
                                        {product.category?.name || ''}
                                    </Link>
                                    <span className="mx-2 text-gray-500">/</span>
                                </>
                            )}
                            <span className="text-white" data-testid="text-product-name">{product?.title || ''}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="mobile-container tablet-container desktop-container py-8 md:py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    {/* Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden">
                            {heroSrc ? (
                                <Image
                                    src={heroSrc}
                                    alt={heroAlt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                                    priority
                                    quality={90}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                    <span className="text-gray-500">No image available</span>
                                </div>
                            )}

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() =>
                                            setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
                                        }
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 text-white transition-colors touch-target-sm z-10"
                                        data-testid="button-prev-image"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImageIndex(prev => (prev + 1) % images.length)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 text-white transition-colors touch-target-sm z-10"
                                        data-testid="button-next-image"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                                {images.map((img: ProductImage, index: number) => (
                                    <button
                                        key={img.id ?? index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`flex-shrink-0 aspect-square w-16 md:w-20 rounded-md overflow-hidden border-2 transition-colors ${
                                            currentImageIndex === index 
                                                ? 'border-[#3c83f6]' 
                                                : 'border-gray-700 hover:border-gray-600'
                                        }`}
                                        data-testid={`thumbnail-${index}`}
                                    >
                                        <Image
                                            src={img.image}
                                            alt={img.alt_text || `${product.title} view ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="space-y-6 md:space-y-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight" data-testid="text-product-title">
                                {product?.title || ''}
                            </h1>

                            {/* Price */}
                            <div className="mb-4 md:mb-6" data-testid="text-product-price">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                                            {currencySymbol}{Number(displayPrice).toFixed(2)}
                                        </span>
                                        {isOnSale && retailPrice > displayPrice && (
                                            <span className="text-lg md:text-xl lg:text-2xl text-gray-500 line-through">
                                                {currencySymbol}{Number(retailPrice).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {isOnSale && saleInfo && (
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-900/30 text-red-400 border border-red-800">
                                                SALE
                                            </span>
                                            <span className="text-sm md:text-base text-green-400 font-medium">
                                                Save {currencySymbol}{Number(saleInfo.discount_amount || 0).toFixed(2)}
                                                {saleInfo.discount_percentage && (
                                                    <span> ({Number(saleInfo.discount_percentage).toFixed(0)}% off)</span>
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Rating Summary */}
                            {ratingStats && ratingStats.review_count > 0 && (
                                <div className="mb-4 md:mb-6">
                                    <RatingSummary 
                                        stats={ratingStats}
                                        productId={id}
                                        showDistribution={false}
                                        showReviewsLink={true}
                                        className="text-white"
                                    />
                                </div>
                            )}

                        </div>

                        <p className="text-base md:text-lg text-gray-300 leading-relaxed" data-testid="text-product-description">
                            {product?.description || ''}
                        </p>

                        {/* Stock */}
                        {(!selectedVariant || (selectedVariant?.stock ?? 0) <= 0) && (
                            <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                                <AlertDescription className="text-red-300">This product is currently out of stock.</AlertDescription>
                            </Alert>
                        )}

                        {/* Color */}
                        {availableColors.length > 0 && (
                            <div>
                                <label className="block text-sm md:text-base font-semibold text-white mb-3">
                                    Color: <span className="text-gray-300 font-normal">{(selectedVariant?.attributes as any)?.color || availableColors[0]}</span>
                                </label>
                                <div className="flex gap-2 md:gap-3 flex-wrap">
                                    {availableColors.map(color => {
                                        // Find variant with this color
                                        const currentSize = (selectedVariant?.attributes as any)?.size;
                                        // First try to find variant with matching color and current size (if size is selected)
                                        let variant = product?.variants?.find(
                                            v => {
                                                const variantColor = (v.attributes as any)?.color;
                                                const variantSize = (v.attributes as any)?.size;
                                                return variantColor === color && 
                                                       v.is_active &&
                                                       (!currentSize || variantSize === currentSize);
                                            }
                                        );
                                        // If no variant found with current size, find any variant with this color
                                        if (!variant) {
                                            variant = product?.variants?.find(
                                                v => {
                                                    const variantColor = (v.attributes as any)?.color;
                                                    return variantColor === color && v.is_active;
                                                }
                                            );
                                        }
                                        const isSelected = (selectedVariant?.attributes as any)?.color === color;
                                        const isOutOfStock = !variant || (variant?.stock ?? 0) <= 0;
                                        
                                        return (
                                            <button
                                                key={color}
                                                onClick={() => {
                                                    if (variant) {
                                                        setSelectedVariant(variant);
                                                    }
                                                }}
                                                disabled={!variant || isOutOfStock}
                                                className={`px-4 py-2 md:px-5 md:py-2.5 border rounded-md text-sm md:text-base font-medium touch-target transition-all ${
                                                    isSelected
                                                        ? 'border-[#3c83f6] bg-[#3c83f6]/20 text-white'
                                                        : !variant || isOutOfStock
                                                        ? 'border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
                                                        : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white bg-gray-900/50'
                                                }`}
                                                data-testid={`color-${String(color).toLowerCase().replace(/\s+/g, '-')}`}
                                            >
                                                {color}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Size */}
                        {availableSizes.length > 0 && (
                            <div>
                                <label className="block text-sm md:text-base font-semibold text-white mb-3">
                                    Size: <span className="text-gray-300 font-normal">{(selectedVariant?.attributes as any)?.size || 'Select a size'}</span>
                                </label>
                                <div className="flex gap-2 md:gap-3 flex-wrap">
                                    {availableSizes.map(size => {
                                        // Find variant with this size
                                        const currentColor = (selectedVariant?.attributes as any)?.color;
                                        // First try to find variant with matching size and current color (if color is selected)
                                        let variant = product?.variants?.find(
                                            v => {
                                                const variantColor = (v.attributes as any)?.color;
                                                const variantSize = (v.attributes as any)?.size;
                                                return variantSize === size && 
                                                       v.is_active &&
                                                       (!currentColor || variantColor === currentColor);
                                            }
                                        );
                                        // If no variant found with current color, find any variant with this size
                                        if (!variant) {
                                            variant = product?.variants?.find(
                                                v => {
                                                    const variantSize = (v.attributes as any)?.size;
                                                    return variantSize === size && v.is_active;
                                                }
                                            );
                                        }
                                        const isSelected = (selectedVariant?.attributes as any)?.size === size;
                                        const isOutOfStock = !variant || (variant?.stock ?? 0) <= 0;
                                        
                                        return (
                                            <button
                                                key={size}
                                                onClick={() => {
                                                    if (variant) {
                                                        setSelectedVariant(variant);
                                                    }
                                                }}
                                                disabled={!variant || isOutOfStock}
                                                className={`px-4 py-2 md:px-5 md:py-2.5 border rounded-md text-sm md:text-base font-medium touch-target transition-all min-w-[50px] ${
                                                    isSelected
                                                        ? 'border-[#3c83f6] bg-[#3c83f6]/20 text-white'
                                                        : !variant || isOutOfStock
                                                        ? 'border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
                                                        : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white bg-gray-900/50'
                                                }`}
                                                data-testid={`size-${size}`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <button
                                className="flex-1 touch-target bg-[#00bfff] bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] hover:bg-[#0099cc] text-white font-semibold uppercase text-sm md:text-base py-6 md:py-7 px-6 md:px-8 h-auto shadow-lg shadow-[#00bfff]/50 hover:shadow-xl hover:shadow-[#00bfff]/60 transition-all duration-300 border-0 rounded-md flex items-center justify-center gap-2 disabled:bg-gray-800 disabled:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfff] focus-visible:ring-offset-2 focus-visible:ring-offset-black relative overflow-hidden group"
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || (selectedVariant?.stock ?? 0) <= 0}
                                data-testid="button-add-to-cart"
                            >
                                {/* Shine effect overlay */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                                <ShoppingCart className="h-5 w-5 relative z-10" />
                                <span className="relative z-10">{!selectedVariant || (selectedVariant?.stock ?? 0) <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                            </button>

                            <WishlistButton
                                productId={product?.id || ''}
                                variantId={selectedVariant?.id}
                                size="lg"
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white hover:text-black h-[56px] md:h-[64px] w-[56px] md:w-[64px] p-0 flex items-center justify-center shrink-0"
                                data-testid="button-add-to-wishlist"
                            />
                        </div>

                        {/* Details */}
                        <div className="border-t border-gray-800 pt-6 md:pt-8">
                            <h3 className="font-semibold text-lg md:text-xl text-white mb-4 md:mb-6">Product Details</h3>
                            <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-300">
                                {product?.category && (
                                    <li className="flex items-center gap-2">
                                        <span className="text-gray-500">•</span>
                                        <span>Category: <span className="text-white">{product.category?.name || ''}</span></span>
                                    </li>
                                )}
                                <li className="flex items-center gap-2">
                                    <span className="text-gray-500">•</span>
                                    <span>SKU: <span className="text-white">{selectedVariant?.sku || 'N/A'}</span></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-gray-500">•</span>
                                    <span>Stock: <span className="text-white">{selectedVariant?.stock || 0} available</span></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-gray-500">•</span>
                                    <span>Currency: <span className="text-white">{product?.currency || 'GBP'}</span></span>
                                </li>
                            </ul>
                        </div>

                        {/* Specifications */}
                        {product?.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="border-t border-gray-800 pt-6 md:pt-8">
                                <h3 className="font-semibold text-lg md:text-xl text-white mb-4 md:mb-6">Specifications</h3>
                                <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-start gap-4">
                                            <span className="capitalize text-gray-300">{key.replace(/_/g, ' ')}:</span>
                                            <span className="text-white text-right">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Reviews */}
                        {reviewsLoading ? (
                            <div className="border-t border-gray-800 pt-6 md:pt-8">
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <h3 className="font-semibold text-lg md:text-xl text-white">Recent Reviews</h3>
                                </div>
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="animate-pulse bg-gray-900/50 rounded-lg p-4 md:p-6">
                                            <div className="h-4 bg-gray-800 rounded w-1/4 mb-2"></div>
                                            <div className="h-3 bg-gray-800 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : recentReviews && recentReviews.results && recentReviews.results.length > 0 ? (
                            <div className="border-t border-gray-800 pt-6 md:pt-8">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 md:mb-6">
                                    <h3 className="font-semibold text-lg md:text-xl text-white">Recent Reviews</h3>
                                    <Link 
                                        href={`/product/${id}/reviews`}
                                        className="text-sm md:text-base text-[#3c83f6] hover:text-white transition-colors font-medium"
                                    >
                                        See all reviews →
                                    </Link>
                                </div>
                                <div className="space-y-4 md:space-y-6">
                                    {recentReviews.results.slice(0, 3).map((review) => (
                                        <div key={review.id} className="border border-gray-800 bg-gray-900/30 rounded-lg p-4 md:p-6">
                                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <span 
                                                            key={i}
                                                            className={`text-sm md:text-base ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                                <span className="text-sm md:text-base font-medium text-white">
                                                    {review.user_name || 'Anonymous'}
                                                </span>
                                                {review.is_verified_purchase && (
                                                    <span className="text-xs md:text-sm bg-green-900/30 text-green-400 border border-green-800 px-2 py-1 rounded">
                                                        Verified Purchase
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-semibold text-base md:text-lg text-white mb-2">{review.title}</h4>
                                            <p className="text-sm md:text-base text-gray-300 line-clamp-3 leading-relaxed">
                                                {review.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : reviewsError ? (
                            <div className="border-t border-gray-800 pt-6 md:pt-8">
                                <div className="text-center text-gray-400">
                                    <p>Unable to load reviews</p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Related */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 md:mt-16 lg:mt-20">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 md:mb-12" data-testid="text-related-title">
                            More from {product.category?.name || 'This Category'}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((rp: any) => (
                                <ProductCard key={rp.id} product={rp} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}