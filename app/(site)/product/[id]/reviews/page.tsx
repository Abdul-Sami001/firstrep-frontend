// app/(site)/product/[id]/reviews/page.tsx - Full Product Reviews Page
'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ReviewList from '@/components/ReviewList';
import ReviewForm from '@/components/ReviewForm';
import { useProductRatingStats, useProductReviews, useCreateReview, useUpdateReview, useDeleteReview } from '@/hooks/useReviews';
import { useProduct } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewFilters, Review } from '@/lib/api/reviews';
import { cn } from '@/lib/utils';

export default function ProductReviewsPage() {
    const { id } = useParams() as { id: string };
    const { user, isAuthenticated } = useAuth();
    
    // State
    const [filters, setFilters] = useState<ReviewFilters>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);

    // Data fetching
    const { data: product, isLoading: productLoading } = useProduct(id);
    const { data: ratingStats, isLoading: statsLoading } = useProductRatingStats(id);
    const { data: reviews, isLoading: reviewsLoading } = useProductReviews(id, {
        ...filters,
        page: currentPage,
        page_size: 20
    });

    // Mutations
    const createReviewMutation = useCreateReview();
    const updateReviewMutation = useUpdateReview();
    const deleteReviewMutation = useDeleteReview();

    const handleFiltersChange = (newFilters: ReviewFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleCreateReview = async (data: any) => {
        try {
            await createReviewMutation.mutateAsync({ ...data, product: id });
            setIsReviewFormOpen(false);
        } catch (error) {
            console.error('Failed to create review:', error);
        }
    };

    const handleUpdateReview = async (data: any) => {
        if (!editingReview) return;
        
        try {
            await updateReviewMutation.mutateAsync({ 
                id: editingReview.id, 
                data 
            });
            setEditingReview(null);
        } catch (error) {
            console.error('Failed to update review:', error);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        
        try {
            await deleteReviewMutation.mutateAsync(reviewId);
        } catch (error) {
            console.error('Failed to delete review:', error);
        }
    };

    const handleEditReview = (review: Review) => {
        setEditingReview(review);
        setIsReviewFormOpen(true);
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

                                {isAuthenticated && (
                                    <Dialog open={isReviewFormOpen} onOpenChange={setIsReviewFormOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="gap-2 bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white">
                                                <Plus className="h-4 w-4" />
                                                Write Review
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
                                            <DialogHeader>
                                                <DialogTitle className="text-white">
                                                    {editingReview ? 'Edit Review' : 'Write a Review'}
                                                </DialogTitle>
                                            </DialogHeader>
                                            <ReviewForm
                                                productId={id}
                                                productName={product.title}
                                                initialData={editingReview || undefined}
                                                onSubmit={editingReview ? handleUpdateReview : handleCreateReview}
                                                onCancel={() => {
                                                    setIsReviewFormOpen(false);
                                                    setEditingReview(null);
                                                }}
                                                isLoading={createReviewMutation.isPending || updateReviewMutation.isPending}
                                                error={createReviewMutation.error?.message || updateReviewMutation.error?.message}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                {/* Guest User Alert */}
                {!isAuthenticated && (
                    <Alert className="mb-6 bg-blue-900/20 border-blue-800">
                        <AlertDescription className="text-blue-300">
                            You need to be signed in to write reviews. 
                            <Link href="/CustomerLogin" className="text-[#00bfff] hover:underline ml-1">
                                Sign in
                            </Link> to share your experience.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Reviews List */}
                <ReviewList
                    reviews={reviews}
                    ratingStats={ratingStats}
                    productId={id}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onPageChange={handlePageChange}
                    onEditReview={handleEditReview}
                    onDeleteReview={handleDeleteReview}
                    onFlagReview={handleFlagReview}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
