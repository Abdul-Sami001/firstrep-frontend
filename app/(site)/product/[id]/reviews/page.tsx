// app/(site)/product/[id]/reviews/page.tsx - Full Product Reviews Page
'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReviewList from '@/components/ReviewList';
import { useProductRatingStats, useProductReviews } from '@/hooks/useReviews';
import { useProduct } from '@/hooks/useProducts';
import { ReviewFilters } from '@/lib/api/reviews';

export default function ProductReviewsPage() {
    const { id } = useParams() as { id: string };
    
    // State
    const [filters, setFilters] = useState<ReviewFilters>({});
    const [currentPage, setCurrentPage] = useState(1);

    // Data fetching
    const { data: product, isLoading: productLoading } = useProduct(id);
    const { data: ratingStats, isLoading: statsLoading } = useProductRatingStats(id);
    const { data: reviews, isLoading: reviewsLoading, error: reviewsError } = useProductReviews(id, {
        ...filters,
        page: currentPage,
        page_size: 20
    });

    const handleFiltersChange = (newFilters: ReviewFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFlagReview = (reviewId: string) => {
        // This would typically open a flag/report dialog
        alert('Report review functionality would be implemented here');
    };

    const isLoading = productLoading || statsLoading || reviewsLoading;

    if (productLoading) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
                    <p className="text-white">Loading reviews...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4 text-white">Product Not Found</h1>
                    <p className="text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
                    <Link href="/">
                        <Button className="bg-white text-black hover:bg-gray-200">Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000]">
            {/* Header */}
            <div className="border-b border-gray-800 bg-[#000000]">
                <div className="mobile-container tablet-container desktop-container">
                    <div className="py-8 md:py-12">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                            <Link href="/" className="hover:text-white transition-colors">
                                Home
                            </Link>
                            <span>/</span>
                            <Link href={`/product/${id}`} className="hover:text-white transition-colors">
                                {product.title}
                            </Link>
                            <span>/</span>
                            <span className="text-gray-300">Reviews</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Customer Reviews</h1>
                                <p className="text-gray-400 mt-2">
                                    {product.title}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link href={`/product/${id}`}>
                                    <Button variant="outline" className="gap-2 border-gray-700 text-white hover:bg-gray-800">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Product
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                {/* Reviews List */}
                {reviewsError && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                        <p className="text-red-400 text-sm">
                            Error loading reviews: {reviewsError instanceof Error ? reviewsError.message : 'Unknown error'}
                        </p>
                    </div>
                )}
                <ReviewList
                    reviews={reviews}
                    ratingStats={ratingStats}
                    productId={id}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onPageChange={handlePageChange}
                    onFlagReview={handleFlagReview}
                    isLoading={isLoading}
                    showActions={false}
                />
            </div>
        </div>
    );
}
