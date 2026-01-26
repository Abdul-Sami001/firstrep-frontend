// app/(site)/profile/reviews/page.tsx - User's Reviews Page
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import { useMyReviews, useUpdateReview, useDeleteReview } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { Review } from '@/lib/api/reviews';
import Link from 'next/link';

export default function ProfileReviewsPage() {
    const router = useRouter();
    const { user } = useAuth();
    
    // State
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Data fetching
    const { data: reviews, isLoading } = useMyReviews({ page_size: 20 });

    // Mutations
    const updateReviewMutation = useUpdateReview();
    const deleteReviewMutation = useDeleteReview();

    const handleEditReview = (review: Review) => {
        setEditingReview(review);
        setIsFormOpen(true);
    };

    const handleUpdateReview = async (data: any) => {
        if (!editingReview) return;
        
        try {
            await updateReviewMutation.mutateAsync({ 
                id: editingReview.id, 
                data 
            });
            setEditingReview(null);
            setIsFormOpen(false);
        } catch (error) {
            console.error('Failed to update review:', error);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;
        
        try {
            await deleteReviewMutation.mutateAsync(reviewId);
        } catch (error) {
            console.error('Failed to delete review:', error);
        }
    };

    const handleCloseForm = () => {
        setEditingReview(null);
        setIsFormOpen(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
                    <p className="text-white">Loading your reviews...</p>
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
                            <Link href="/profile" className="hover:text-white transition-colors">
                                Profile
                            </Link>
                            <span>/</span>
                            <span className="text-gray-300">My Reviews</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">My Reviews</h1>
                                <p className="text-gray-400 mt-2">
                                    Reviews you've written for products
                                </p>
                            </div>

                            <Link href="/profile">
                                <Button variant="outline" className="gap-2 border-gray-700 text-white hover:bg-gray-800">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                {/* Stats */}
                {reviews && reviews.results && reviews.results.length > 0 && (
                    <Card className="mb-6 bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Review Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">{reviews.count}</div>
                                    <div className="text-sm text-gray-400">Total Reviews</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">
                                        {reviews.results.length > 0 
                                            ? (reviews.results.reduce((sum, review) => sum + review.rating, 0) / reviews.results.length).toFixed(1)
                                            : '0.0'
                                        }
                                    </div>
                                    <div className="text-sm text-gray-400">Average Rating Given</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">
                                        {reviews.results.filter(review => review.is_verified_purchase).length}
                                    </div>
                                    <div className="text-sm text-gray-400">Verified Reviews</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Reviews List */}
                {!reviews || !reviews.results || reviews.results.length === 0 ? (
                    /* Empty State */
                    <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="text-center py-12">
                            <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-white mb-2">
                                No reviews yet
                            </h2>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                You haven't written any reviews yet. Share your experience with products 
                                you've purchased to help other customers make informed decisions.
                            </p>
                            <Link href="/shop-clean">
                                <Button className="bg-white text-black hover:bg-gray-200">
                                    Browse Products
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    /* Reviews List */
                    <div className="space-y-4">
                        {reviews.results.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                onEdit={handleEditReview}
                                onDelete={handleDeleteReview}
                                data-testid={`my-review-${review.id}`}
                            />
                        ))}
                    </div>
                )}

                {/* Edit Review Dialog */}
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
                        <DialogHeader>
                            <DialogTitle className="text-white">Edit Review</DialogTitle>
                        </DialogHeader>
                        {editingReview && (
                            <ReviewForm
                                productId={editingReview.product}
                                productName={editingReview.product_name}
                                initialData={editingReview}
                                onSubmit={handleUpdateReview}
                                onCancel={handleCloseForm}
                                isLoading={updateReviewMutation.isPending}
                                error={updateReviewMutation.error?.message}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
