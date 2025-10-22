// app/(site)/wishlist/page.tsx - Dedicated Wishlist Page
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import WishlistItem from '@/components/WishlistItem';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';

export default function WishlistPage() {
    const { wishlistItems, totalItems, clearWishlist, isLoading, error } = useWishlist();
    const { isAuthenticated } = useAuth();
    const [isClearing, setIsClearing] = useState(false);

    // Debug logging
    console.log('WishlistPage - wishlistItems:', wishlistItems);
    console.log('WishlistPage - totalItems:', totalItems);
    console.log('WishlistPage - isLoading:', isLoading);
    console.log('WishlistPage - error:', error);

    const handleClearAll = async () => {
        setIsClearing(true);
        try {
            await clearWishlist();
        } finally {
            setIsClearing(false);
        }
    };

    const handleMoveAllToCart = () => {
        // This would be implemented to move all items to cart
        // For now, we'll show a message
        alert('Move all to cart functionality would be implemented here');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <div className="mobile-container tablet-container desktop-container py-8">
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-48" />
                        <div className="grid gap-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-32 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        console.error('Wishlist error:', error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Error Loading Wishlist</h1>
                    <p className="text-muted-foreground mb-4">
                        {error.message || 'Something went wrong'}
                    </p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="border-b bg-background">
                <div className="mobile-container tablet-container desktop-container">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">My Wishlist</h1>
                                <p className="text-muted-foreground mt-1">
                                    {totalItems} item{totalItems !== 1 ? 's' : ''} saved
                                </p>
                            </div>
                            
                            {totalItems > 0 && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleMoveAllToCart}
                                        disabled={isClearing}
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Move All to Cart
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleClearAll}
                                        disabled={isClearing}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Clear All
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mobile-container tablet-container desktop-container py-8">
                {!isAuthenticated && (
                    <Alert className="mb-6">
                        <User className="h-4 w-4" />
                        <AlertDescription>
                            You're viewing your wishlist as a guest. 
                            <Link href="/CustomerLogin" className="text-primary hover:underline ml-1">
                                Sign in
                            </Link> to save your wishlist permanently.
                        </AlertDescription>
                    </Alert>
                )}

                {totalItems === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12">
                        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Start adding items you love to your wishlist. You can save products 
                            for later and easily add them to your cart when you're ready to buy.
                        </p>
                        <Link href="/shop">
                            <Button>
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    /* Wishlist Items */
                    <div className="space-y-4">
                        {wishlistItems.map((item) => (
                            <WishlistItem
                                key={item.id}
                                item={item}
                                data-testid={`wishlist-item-${item.id}`}
                            />
                        ))}
                    </div>
                )}

                {/* Continue Shopping */}
                {totalItems > 0 && (
                    <div className="mt-8 text-center">
                        <Link href="/shop">
                            <Button variant="outline">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
