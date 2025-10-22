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
import { useProduct, useProductRatingStats, useProductReviews, useCreateReview, useUpdateReview, useDeleteReview } from '@/hooks/useReviews';
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading reviews...</p>
                </div>
            </div>
        );
    }

    if (!product) {
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
            {/* Header */}
            <div className="border-b bg-background">
                <div className="mobile-container tablet-container desktop-container">
                    <div className="py-6">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Link href="/" className="hover:text-foreground transition-colors">
                                Home
                            </Link>
                            <span>/</span>
                            <Link href={`/product/${id}`} className="hover:text-foreground transition-colors">
                                {product.title}
                            </Link>
                            <span>/</span>
                            <span>Reviews</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">Customer Reviews</h1>
                                <p className="text-muted-foreground mt-1">
                                    {product.title}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link href={`/product/${id}`}>
                                    <Button variant="outline" className="gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Product
                                    </Button>
                                </Link>

                                {isAuthenticated && (
                                    <Dialog open={isReviewFormOpen} onOpenChange={setIsReviewFormOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="gap-2">
                                                <Plus className="h-4 w-4" />
                                                Write Review
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>
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
            <div className="mobile-container tablet-container desktop-container py-8">
                {/* Guest User Alert */}
                {!isAuthenticated && (
                    <Alert className="mb-6">
                        <AlertDescription>
                            You need to be signed in to write reviews. 
                            <Link href="/CustomerLogin" className="text-primary hover:underline ml-1">
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
