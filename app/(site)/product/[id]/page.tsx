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
import { useCart } from '@/contexts/CartContext';
import { ProductVariant } from '@/lib/api/products';

export default function ProductDetailPage() {
    const { id } = useParams() as { id: string };

    // Always call hooks in a stable order
    const { data: product, isLoading: productLoading, error: productError } = useProduct(id);

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
            const active = product.variants.find(v => v.is_active) || product.variants[0];
            setSelectedVariant(active);
        }
    }, [product]);

    const toNum = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v || 0)));

    const images = product?.images ?? [];
    const heroSrc = images[currentImageIndex]?.image || '';
    const heroAlt = images[currentImageIndex]?.alt_text || product?.title || 'Product image';

    const availableSizes = useMemo(
        () =>
            Array.from(
                new Set(
                    (product?.variants ?? [])
                        .filter(v => v.is_active)
                        .map(v => (v.attributes as any)?.size)
                        .filter(Boolean)
                )
            ),
        [product?.variants]
    );

    const availableColors = useMemo(
        () =>
            Array.from(
                new Set(
                    (product?.variants ?? [])
                        .filter(v => v.is_active)
                        .map(v => (v.attributes as any)?.color)
                        .filter(Boolean)
                )
            ),
        [product?.variants]
    );

    const handleAddToCart = () => {
        if (!product || !selectedVariant || selectedVariant.stock <= 0) return;

        const computedPrice =
            selectedVariant.price_override != null ? toNum(selectedVariant.price_override) : toNum(product.price);

        addToCart(
            {
                id: product.id,
                name: product.title,
                price: computedPrice,
                image: heroSrc,
                size: (selectedVariant.attributes as any)?.size || 'M',
                color: (selectedVariant.attributes as any)?.color || 'Default',
                category: product.category?.slug || 'general',
            },
            { variantId: selectedVariant.id, quantity: 1 }
        );
    };

    if (productLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading product...</p>
                </div>
            </div>
        );
    }

    if (productError || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                    <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
                    <Link href="/">
                        <Button>Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <div className="border-b bg-background">
                <div className="mobile-container tablet-container desktop-container">
                    <div className="py-3">
                        <div className="text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-foreground transition-colors" data-testid="link-home">
                                Home
                            </Link>
                            <span className="mx-2">/</span>
                            {product.category && (
                                <>
                                    <Link
                                        href={`/Collections/${product.category.slug}`}
                                        className="hover:text-foreground capitalize"
                                        data-testid="link-collection"
                                    >
                                        {product.category.name}
                                    </Link>
                                    <span className="mx-2">/</span>
                                </>
                            )}
                            <span data-testid="text-product-name">{product.title}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop">
                    {/* Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden">
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
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <span className="text-muted-foreground">No image available</span>
                                </div>
                            )}

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() =>
                                            setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
                                        }
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover-elevate touch-target-sm"
                                        data-testid="button-prev-image"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImageIndex(prev => (prev + 1) % images.length)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover-elevate touch-target-sm"
                                        data-testid="button-next-image"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {images.map((img, index) => (
                                    <button
                                        key={img.id ?? index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`flex-shrink-0 aspect-square w-16 rounded-md overflow-hidden border-2 ${currentImageIndex === index ? 'border-primary' : 'border-transparent'
                                            }`}
                                        data-testid={`thumbnail-${index}`}
                                    >
                                        <Image
                                            src={img.image}
                                            alt={img.alt_text || `${product.title} view ${index + 1}`}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-mobile-h1 md:text-tablet-h1 lg:text-desktop-h1 font-bold mb-2" data-testid="text-product-title">
                                {product.title}
                            </h1>

                            {/* Price */}
                            <div className="mb-4" data-testid="text-product-price">
                                <span className="text-2xl md:text-3xl font-semibold">
                                    {product.currency}{' '}
                                    {Number(
                                        selectedVariant?.price_override != null
                                            ? selectedVariant.price_override
                                            : product.price
                                    ).toFixed(2)}
                                </span>
                            </div>

                            {product.popularity > 0 && (
                                <div className="text-sm text-muted-foreground mb-4">Popularity: {product.popularity}</div>
                            )}
                        </div>

                        <p className="text-sm md:text-base text-muted-foreground" data-testid="text-product-description">
                            {product.description}
                        </p>

                        {/* Stock */}
                        {(!selectedVariant || selectedVariant.stock <= 0) && (
                            <Alert variant="destructive">
                                <AlertDescription>This product is currently out of stock.</AlertDescription>
                            </Alert>
                        )}

                        {/* Color */}
                        {availableColors.length > 1 && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Color: {(selectedVariant?.attributes as any)?.color || availableColors[0]}
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {availableColors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => {
                                                const variant = product.variants.find(
                                                    v => (v.attributes as any)?.color === color && v.is_active
                                                );
                                                setSelectedVariant(variant || null);
                                            }}
                                            className={`px-4 py-2 border rounded-md text-sm touch-target ${(selectedVariant?.attributes as any)?.color === color
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-border'
                                                } hover-elevate`}
                                            data-testid={`color-${String(color).toLowerCase().replace(/\s+/g, '-')}`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size */}
                        {availableSizes.length > 1 && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Size</label>
                                <Select
                                    value={(selectedVariant?.attributes as any)?.size || ''}
                                    onValueChange={size => {
                                        const variant = product.variants.find(
                                            v => (v.attributes as any)?.size === size && v.is_active
                                        );
                                        setSelectedVariant(variant || null);
                                    }}
                                >
                                    <SelectTrigger data-testid="select-size">
                                        <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSizes.map(size => (
                                            <SelectItem key={size} value={size} data-testid={`size-${size}`}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                size="lg"
                                className="flex-1 touch-target"
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || selectedVariant.stock <= 0}
                                data-testid="button-add-to-cart"
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                {!selectedVariant || selectedVariant.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => setIsWishlisted(s => !s)}
                                className="touch-target"
                                data-testid="button-add-to-wishlist"
                            >
                                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current text-destructive' : ''}`} />
                            </Button>
                        </div>

                        {/* Details */}
                        <div className="border-t pt-6">
                            <h3 className="font-semibold mb-4">Product Details</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {product.category && <li>• Category: {product.category.name}</li>}
                                <li>• SKU: {selectedVariant?.sku || 'N/A'}</li>
                                <li>• Stock: {selectedVariant?.stock || 0} available</li>
                                <li>• Currency: {product.currency}</li>
                            </ul>
                        </div>

                        {/* Specifications */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="border-t pt-6">
                                <h3 className="font-semibold mb-4">Specifications</h3>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                                            <span>{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 md:mt-16 lg:mt-20">
                        <h2 className="text-mobile-h2 md:text-tablet-h2 lg:text-desktop-h2 font-bold mb-8" data-testid="text-related-title">
                            More from {product.category?.name || 'This Category'}
                        </h2>
                        <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop">
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