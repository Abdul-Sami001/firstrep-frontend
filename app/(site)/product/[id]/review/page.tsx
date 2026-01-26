// app/(site)/product/[id]/review/page.tsx - Create/Edit Product Review Page
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, AlertCircle, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import ReviewForm from '@/components/ReviewForm';
import { useProduct } from '@/hooks/useProducts';
import { useMyReviews, useCreateReview, useUpdateReview } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CreateReviewRequest, UpdateReviewRequest, Review } from '@/lib/api/reviews';

export default function ProductReviewPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.id as string;
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { toast } = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: product, isLoading: productLoading } = useProduct(productId);
    const { data: myReviews } = useMyReviews({ page_size: 100 });
    const createReviewMutation = useCreateReview();
    const updateReviewMutation = useUpdateReview();

    // Find existing review for this product
    const existingReview = myReviews?.results.find(review => review.product === productId);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            toast({
                title: "Authentication Required",
                description: "Please log in to write a review.",
                variant: "destructive",
            });
            router.push(`/CustomerLogin?redirect=/product/${productId}/review`);
        }
    }, [isAuthenticated, authLoading, router, productId, toast]);

    const handleSubmit = async (data: CreateReviewRequest | UpdateReviewRequest) => {
        if (!isAuthenticated) {
            setError('You must be logged in to write a review.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            if (existingReview) {
                // Update existing review
                await updateReviewMutation.mutateAsync({
                    id: existingReview.id,
                    data: data as UpdateReviewRequest,
                });
                toast({
                    title: "Review Updated",
                    description: "Your review has been updated successfully.",
                });
            } else {
                // Create new review
                await createReviewMutation.mutateAsync({
                    ...data,
                    product: productId,
                } as CreateReviewRequest);
                toast({
                    title: "Review Submitted",
                    description: "Thank you for your review! It will be visible after approval.",
                });
            }

            // Redirect back to product page after a short delay
            setTimeout(() => {
                router.push(`/product/${productId}`);
            }, 1500);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.detail || 
                err?.response?.data?.message || 
                'Failed to submit review. Please try again.';
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || productLoading) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
                    <p className="text-lg font-medium text-white">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                    <h1 className="text-2xl font-bold mb-4 text-white">Product Not Found</h1>
                    <p className="text-gray-400 mb-8">
                        We couldn't find this product. It may have been removed or doesn't exist.
                    </p>
                    <Link href="/shop-clean">
                        <Button className="bg-[#00bfff] hover:bg-[#0099cc] text-white">
                            Browse Products
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const productImage = product.images?.find(img => img.position === 0)?.image || 
                         product.images?.[0]?.image || null;

    return (
        <div className="min-h-screen bg-[#000000]">
            {/* Header */}
            <div className="border-b border-gray-800 bg-[#000000]">
                <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href={`/product/${productId}`}>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                                {existingReview ? 'Edit Your Review' : 'Write a Review'}
                            </h1>
                            <p className="text-sm md:text-base text-gray-400 mt-2">
                                Share your experience with this product
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Product Info Card */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <div className="flex gap-4 md:gap-6">
                            {productImage && (
                                <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-700">
                                    <Image
                                        src={productImage}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        sizes="128px"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                                    {product.title}
                                </h2>
                                {product.category && (
                                    <p className="text-sm text-gray-400 capitalize mb-2">
                                        {product.category.name}
                                    </p>
                                )}
                                {existingReview && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className="bg-green-900/30 text-green-400 border-green-800">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            You've already reviewed this product
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Review Guidelines */}
                    {!existingReview && (
                        <Alert className="bg-blue-900/20 border-blue-800">
                            <Star className="h-4 w-4 text-blue-400" />
                            <AlertDescription className="text-blue-300">
                                <strong>Review Guidelines:</strong> Only customers who have purchased this product can leave a review. 
                                Your review will be marked as "Verified Purchase" if you have a paid order containing this product.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Review Form */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 md:p-8">
                        <ReviewForm
                            productId={productId}
                            productName={product.title}
                            initialData={existingReview || undefined}
                            onSubmit={handleSubmit}
                            onCancel={() => router.push(`/product/${productId}`)}
                            isLoading={isSubmitting}
                            error={error || undefined}
                        />
                    </div>

                    {/* Help Text */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Your review helps other customers make informed decisions.{' '}
                            <Link href="/product/[id]" className="text-[#00bfff] hover:text-[#0ea5e9] underline">
                                Learn more about our review policy
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
