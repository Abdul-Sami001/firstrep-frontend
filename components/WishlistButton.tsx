// components/WishlistButton.tsx - Toggle Wishlist Button Component
import React from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
    productId: string;
    variantId?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'outline' | 'ghost';
    className?: string;
    showText?: boolean;
    'data-testid'?: string;
}

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
};

const buttonSizeClasses = {
    sm: 'h-8 w-8 p-0',
    md: 'h-10 w-10 p-0',
    lg: 'h-12 w-12 p-0',
};

export default function WishlistButton({
    productId,
    variantId,
    size = 'md',
    variant = 'outline',
    className,
    showText = false,
    'data-testid': testId,
}: WishlistButtonProps) {
    const { 
        isInWishlist, 
        getWishlistItemId, 
        toggleWishlist, 
        isLoading 
    } = useWishlist();

    const isWishlisted = isInWishlist(productId);
    const itemId = getWishlistItemId(productId, variantId);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId, variantId, itemId || undefined);
    };

    if (showText) {
        return (
            <Button
                variant={variant}
                size={size}
                onClick={handleToggle}
                disabled={isLoading}
                className={cn(
                    'gap-2',
                    className
                )}
                data-testid={testId}
            >
                {isLoading ? (
                    <Loader2 className={sizeClasses[size]} />
                ) : (
                    <Heart 
                        className={cn(
                            sizeClasses[size],
                            isWishlisted && 'fill-current text-red-500'
                        )} 
                    />
                )}
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
        );
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleToggle}
            disabled={isLoading}
            className={cn(
                buttonSizeClasses[size],
                'transition-all duration-200 hover:scale-110',
                isWishlisted && 'bg-red-50 border-red-200 hover:bg-red-100',
                className
            )}
            data-testid={testId}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {isLoading ? (
                <Loader2 className={cn(sizeClasses[size], 'animate-spin')} />
            ) : (
                <Heart 
                    className={cn(
                        sizeClasses[size],
                        'transition-colors duration-200',
                        isWishlisted 
                            ? 'fill-current text-red-500' 
                            : 'text-gray-600 hover:text-red-500'
                    )} 
                />
            )}
        </Button>
    );
}
