// components/WishlistItem.tsx - Wishlist Item Component
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingCart, X, TrendingDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WishlistItem as WishlistItemType } from '@/lib/api/wishlist';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface WishlistItemProps {
    item: WishlistItemType;
    onRemove?: (itemId: string) => void;
    onMoveToCart?: (itemId: string) => void;
    className?: string;
    'data-testid'?: string;
}

export default function WishlistItem({
    item,
    onRemove,
    onMoveToCart,
    className,
    'data-testid': testId,
}: WishlistItemProps) {
    const { removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleRemove = () => {
        if (onRemove) {
            onRemove(item.id);
        } else {
            removeFromWishlist(item.id);
        }
    };

    const handleMoveToCart = () => {
        if (onMoveToCart) {
            onMoveToCart(item.id);
        } else {
            // Add to cart and remove from wishlist
            addToCart(item.product, item.variant || undefined, 1);
            removeFromWishlist(item.id);
        }
    };

    const formatPrice = (price: number, currency: string = 'GBP') => {
        return `${currency} ${Number(price).toFixed(2)}`;
    };

    // Use new pricing system: prefer current_price, fallback to product_price, then price_at_add
    const currentPrice = (item as any).current_price ?? item.product_price ?? item.price_at_add;
    const retailPrice = (item as any).retail_price ?? item.product_price ?? item.price_at_add;
    const isOnSale = (item as any).is_on_sale ?? false;
    const saleInfo = (item as any).sale_info;
    
    const isPriceChanged = item.price_at_add !== currentPrice;
    const priceChangePercent = isPriceChanged && currentPrice 
        ? Math.round(((currentPrice - item.price_at_add) / item.price_at_add) * 100)
        : 0;
    
    // Calculate savings if price dropped
    const hasPriceDrop = isPriceChanged && currentPrice < item.price_at_add;
    const savingsAmount = hasPriceDrop 
        ? item.price_at_add - currentPrice 
        : 0;

    return (
        <div 
            className={cn(
                'group relative bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all duration-200',
                className
            )}
            data-testid={testId}
        >
            {/* Remove Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                data-testid={`remove-wishlist-item-${item.id}`}
            >
                <X className="h-4 w-4" />
            </Button>

            <div className="flex gap-4">
                {/* Product Image */}
                <Link 
                    href={`/product/${item.product}`}
                    className="flex-shrink-0"
                >
                    <div className="relative w-20 h-20 bg-gray-800 rounded-md overflow-hidden">
                        {item.product_image ? (
                            <Image
                                src={item.product_image}
                                alt={item.product_name || 'Product'}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <span className="text-gray-600 text-xs">No Image</span>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <Link 
                        href={`/product/${item.product}`}
                        className="block"
                    >
                        <h3 className="font-medium text-sm text-white hover:text-gray-300 transition-colors line-clamp-2">
                            {item.product_name || 'Product'}
                        </h3>
                    </Link>

                    {/* Variant Info */}
                    {item.variant_name && (
                        <div className="text-xs text-gray-400 mt-1">
                            {item.variant_name}
                        </div>
                    )}

                    {/* Price Info */}
                    <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-white">
                                    {formatPrice(currentPrice, item.product_currency || 'GBP')}
                                </span>
                                {isOnSale && retailPrice > currentPrice && (
                                    <span className="text-xs text-gray-500 line-through">
                                        {formatPrice(retailPrice, item.product_currency || 'GBP')}
                                    </span>
                                )}
                            </div>
                            
                            {/* Sale Badge */}
                            {isOnSale && (
                                <Badge className="text-xs bg-red-900/30 text-red-400 border-red-800">
                                    SALE
                                </Badge>
                            )}
                            
                            {/* Price Change Badge */}
                            {isPriceChanged && priceChangePercent !== 0 && !isOnSale && (
                                <Badge 
                                    variant={priceChangePercent > 0 ? "destructive" : "default"}
                                    className="text-xs bg-red-900/30 text-red-400 border-red-800"
                                >
                                    {priceChangePercent > 0 ? '+' : ''}{priceChangePercent}%
                                </Badge>
                            )}
                        </div>
                        
                        {/* Sale Discount Info */}
                        {isOnSale && saleInfo && (
                            <div className="text-xs text-green-400 font-medium">
                                Save {item.product_currency || 'GBP'} {Number(saleInfo.discount_amount || 0).toFixed(2)}
                                {saleInfo.discount_percentage && (
                                    <span> ({Number(saleInfo.discount_percentage).toFixed(0)}% off)</span>
                                )}
                            </div>
                        )}

                        {/* Enhanced Price Drop Alert */}
                        {hasPriceDrop && !isOnSale && (
                            <div className="mt-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                                <div className="flex items-center gap-2">
                                    <TrendingDown className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-green-400">
                                            🔥 Price dropped {Math.abs(priceChangePercent)}%!
                                        </p>
                                        <p className="text-xs text-green-300/80 mt-0.5">
                                            Save {formatPrice(savingsAmount, item.product_currency || 'GBP')} from when you added this
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Original Price (when added) - Only show if price increased */}
                        {isPriceChanged && !isOnSale && !hasPriceDrop && (
                            <div className="text-xs text-gray-500 line-through">
                                Added at: {formatPrice(item.price_at_add, item.product_currency || 'GBP')}
                            </div>
                        )}
                    </div>

                    {/* Added Date */}
                    <div className="text-xs text-gray-500 mt-2">
                        Added {new Date(item.added_at).toLocaleDateString()}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <Button
                        size="sm"
                        onClick={handleMoveToCart}
                        className="text-xs bg-white text-black hover:bg-gray-200"
                        data-testid={`move-to-cart-${item.id}`}
                    >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemove}
                        className="text-xs border-red-800 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                        data-testid={`remove-item-${item.id}`}
                    >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    );
}
