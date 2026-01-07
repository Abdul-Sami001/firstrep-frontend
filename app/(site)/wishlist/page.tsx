// app/(site)/wishlist/page.tsx - Dedicated Wishlist Page
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2, User } from 'lucide-react';
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


    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#000000]">
                <div className="mobile-container tablet-container desktop-container py-8">
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-48 bg-gray-800" />
                        <div className="grid gap-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-32 w-full bg-gray-800" />
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
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4 text-white">Error Loading Wishlist</h1>
                    <p className="text-gray-400 mb-4">
                        {error.message || 'Something went wrong'}
                    </p>
                    <Button onClick={() => window.location.reload()} className="bg-white text-black hover:bg-gray-200">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000]">
            {/* Header */}
            <div className="border-b border-gray-800 bg-[#000000]">
                <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">My Wishlist</h1>
                            <p className="text-sm md:text-base text-gray-400">
                                {totalItems} item{totalItems !== 1 ? 's' : ''} saved
                            </p>
                        </div>
                        
                        {totalItems > 0 && (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleClearAll}
                                    disabled={isClearing}
                                    className="border-red-800 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Clear All
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                {!isAuthenticated && (
                    <Alert className="mb-6 bg-gray-900 border-gray-800">
                        <User className="h-4 w-4 text-gray-400" />
                        <AlertDescription className="text-gray-300">
                            You're viewing your wishlist as a guest. 
                            <Link href="/CustomerLogin" className="text-white hover:underline ml-1 font-medium">
                                Sign in
                            </Link> to save your wishlist permanently.
                        </AlertDescription>
                    </Alert>
                )}

                {totalItems === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12">
                        <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            Start adding items you love to your wishlist. You can save products 
                            for later and easily add them to your cart when you're ready to buy.
                        </p>
                        <Link href="/shop-clean">
                            <Button className="bg-white text-black hover:bg-gray-200">
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
                        <Link href="/shop-clean">
                            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
