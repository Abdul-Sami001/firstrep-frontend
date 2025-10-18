// app/(site)/product/[id]/page.tsx - Production-Ready with Backend Integration
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProductCard from '@/components/ProductCard';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { ProductVariant } from '@/lib/api/products';

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params?.id as string;

    const { data: product, isLoading, error } = useProduct(productId);
    const { addToCart } = useCart();

    // State
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Set default variant when product loads
    useEffect(() => {
        if (product && product.variants.length > 0) {
            const activeVariant = product.variants.find(v => v.is_active) || product.variants[0];
            setSelectedVariant(activeVariant);
        }
    }, [product]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading product...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !product) {
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

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const handleAddToCart = () => {
        if (!selectedVariant || selectedVariant.stock <= 0) return;

        addToCart({
            id: product.id,
            name: product.title,
            price: selectedVariant.price_override || product.price,
            image: product.images[currentImageIndex]?.image || '',
            size: selectedVariant.attributes.size || 'M',
            color: selectedVariant.attributes.color || 'Default',
            category: product.category?.slug || 'general'
        });

        console.log('Added to cart:', product.title);
    };

    // Get available variants grouped by attribute
    const availableSizes = [...new Set(product.variants.filter(v => v.is_active).map(v => v.attributes.size).filter(Boolean))];
    const availableColors = [...new Set(product.variants.filter(v => v.is_active).map(v => v.attributes.color).filter(Boolean))];

    // Get related products from same category
    const { data: relatedProductsData } = useProducts({
        category__slug: product.category?.slug,
        page_size: 4
    });
    const relatedProducts = relatedProductsData?.results.filter(p => p.id !== product.id) || [];

    return (
        <div className="min-h-screen">
            {/* Mobile-First Breadcrumb */}
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
                                    <Link href={`/Collections/${product.category.slug}`} className="hover:text-foreground capitalize" data-testid="link-collection">
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

            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop">

                    {/* Mobile-First Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden">
                            {product.images.length > 0 ? (
                                <Image
                                    src={product.images[currentImageIndex]?.image || ''}
                                    alt={product.images[currentImageIndex]?.alt_text || product.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                                    priority={true}
                                    quality={90}
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <span className="text-muted-foreground">No image available</span>
                                </div>
                            )}

                            {product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover-elevate touch-target-sm"
                                        data-testid="button-prev-image"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover-elevate touch-target-sm"
                                        data-testid="button-next-image"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Navigation */}
                        {product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
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

                    {/* Mobile-First Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-mobile-h1 md:text-tablet-h1 lg:text-desktop-h1 font-bold mb-2" data-testid="text-product-title">
                                {product.title}
                            </h1>

                            {/* Price */}
                            <div className="mb-4" data-testid="text-product-price">
                                <span className="text-2xl md:text-3xl font-semibold">
                                    {product.currency} {(selectedVariant?.price_override || product.price).toFixed(2)}
                                </span>
                            </div>

                            {/* Popularity */}
                            {product.popularity > 0 && (
                                <div className="text-sm text-muted-foreground mb-4">
                                    Popularity: {product.popularity}
                                </div>
                            )}
                        </div>

                        <p className="text-sm md:text-base text-muted-foreground" data-testid="text-product-description">
                            {product.description}
                        </p>

                        {/* Stock Status */}
                        {(!selectedVariant || selectedVariant.stock <= 0) && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    This product is currently out of stock.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Color Selection */}
                        {availableColors.length > 1 && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Color: {selectedVariant?.attributes.color || availableColors[0]}
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {availableColors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => {
                                                const variant = product.variants.find(v =>
                                                    v.attributes.color === color && v.is_active
                                                );
                                                setSelectedVariant(variant || null);
                                            }}
                                            className={`px-4 py-2 border rounded-md text-sm touch-target ${selectedVariant?.attributes.color === color
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-border'
                                                } hover-elevate`}
                                            data-testid={`color-${color.toLowerCase().replace(/\s+/g, '-')}`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {availableSizes.length > 1 && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Size</label>
                                <Select
                                    value={selectedVariant?.attributes.size || ''}
                                    onValueChange={(size) => {
                                        const variant = product.variants.find(v =>
                                            v.attributes.size === size && v.is_active
                                        );
                                        setSelectedVariant(variant || null);
                                    }}
                                >
                                    <SelectTrigger data-testid="select-size">
                                        <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSizes.map((size) => (
                                            <SelectItem key={size} value={size} data-testid={`size-${size}`}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Add to Cart & Wishlist */}
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
                                onClick={() => {
                                    setIsWishlisted(!isWishlisted);
                                    console.log('Wishlist toggled');
                                }}
                                className="touch-target"
                                data-testid="button-add-to-wishlist"
                            >
                                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current text-destructive' : ''}`} />
                            </Button>
                        </div>

                        {/* Product Details */}
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
                        {Object.keys(product.specifications).length > 0 && (
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

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 md:mt-16 lg:mt-20">
                        <h2 className="text-mobile-h2 md:text-tablet-h2 lg:text-desktop-h2 font-bold mb-8" data-testid="text-related-title">
                            More from {product.category?.name || 'This Category'}
                        </h2>
                        <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard
                                    key={relatedProduct.id}
                                    product={relatedProduct}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}