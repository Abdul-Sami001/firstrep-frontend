// components/WishlistItem.tsx - Wishlist Item Component
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingCart, X } from 'lucide-react';
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

    const formatPrice = (price: number, currency: string = 'USD') => {
        return `${currency} ${Number(price).toFixed(2)}`;
    };

    const isPriceChanged = item.price_at_add !== item.product_price;
    const priceChangePercent = isPriceChanged && item.product_price 
        ? Math.round(((item.product_price - item.price_at_add) / item.price_at_add) * 100)
        : 0;

    return (
        <div 
            className={cn(
                'group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200',
                className
            )}
            data-testid={testId}
        >
            {/* Remove Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-8 w-8"
                data-testid={`remove-wishlist-item-${item.id}`}
            >
                <X className="h-4 w-4 text-gray-500" />
            </Button>

            <div className="flex gap-4">
                {/* Product Image */}
                <Link 
                    href={`/product/${item.product}`}
                    className="flex-shrink-0"
                >
                    <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                        {item.product_image ? (
                            <Image
                                src={item.product_image}
                                alt={item.product_name || 'Product'}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No Image</span>
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
                        <h3 className="font-medium text-sm text-gray-900 hover:text-primary transition-colors line-clamp-2">
                            {item.product_name || 'Product'}
                        </h3>
                    </Link>

                    {/* Variant Info */}
                    {item.variant_name && (
                        <div className="text-xs text-gray-500 mt-1">
                            {item.variant_name}
                        </div>
                    )}

                    {/* Price Info */}
                    <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                                {item.product_price 
                                    ? formatPrice(item.product_price, item.product_currency)
                                    : formatPrice(item.price_at_add)
                                }
                            </span>
                            
                            {/* Price Change Badge */}
                            {isPriceChanged && priceChangePercent !== 0 && (
                                <Badge 
                                    variant={priceChangePercent > 0 ? "destructive" : "default"}
                                    className="text-xs"
                                >
                                    {priceChangePercent > 0 ? '+' : ''}{priceChangePercent}%
                                </Badge>
                            )}
                        </div>

                        {/* Original Price */}
                        {isPriceChanged && (
                            <div className="text-xs text-gray-500 line-through">
                                Added at: {formatPrice(item.price_at_add)}
                            </div>
                        )}
                    </div>

                    {/* Added Date */}
                    <div className="text-xs text-gray-400 mt-2">
                        Added {new Date(item.added_at).toLocaleDateString()}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <Button
                        size="sm"
                        onClick={handleMoveToCart}
                        className="text-xs"
                        data-testid={`move-to-cart-${item.id}`}
                    >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemove}
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
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
