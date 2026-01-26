// app/(site)/orders/[id]/review/page.tsx - Review Products from Order Page
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, CheckCircle, Loader2, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOrder } from '@/hooks/useOrders';
import { useMyReviews } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ReviewableProduct {
    productId: string;
    productName: string;
    productImage?: string | null;
    variantId?: string | null;
    quantity: number;
    hasReview: boolean;
    reviewId?: string;
}

export default function OrderReviewPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string;
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { toast } = useToast();

    const { data: order, isLoading: orderLoading, error: orderError } = useOrder(orderId);
    const { data: myReviews } = useMyReviews({ page_size: 100 }); // Get all reviews to check

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            toast({
                title: "Authentication Required",
                description: "Please log in to review products.",
                variant: "destructive",
            });
            router.push(`/CustomerLogin?redirect=/orders/${orderId}/review`);
        }
    }, [isAuthenticated, authLoading, router, orderId, toast]);

    // Get products that can be reviewed from this order
    const reviewableProducts = useMemo(() => {
        if (!order?.items || !myReviews?.results) return [];

        const reviewedProductIds = new Set(
            myReviews.results.map(review => review.product)
        );

        return order.items
            .filter(item => item.product) // Only items with product IDs
            .map(item => {
                const hasReview = reviewedProductIds.has(item.product!);
                const review = myReviews.results.find(r => r.product === item.product);
                
                return {
                    productId: item.product!,
                    productName: item.product_name || 'Unknown Product',
                    productImage: item.product_image,
                    variantId: item.variant || null,
                    quantity: item.quantity,
                    hasReview,
                    reviewId: review?.id,
                } as ReviewableProduct;
            });
    }, [order?.items, myReviews?.results]);

    const unreviewedCount = reviewableProducts.filter(p => !p.hasReview).length;
    const reviewedCount = reviewableProducts.filter(p => p.hasReview).length;

    if (authLoading || orderLoading) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
                    <p className="text-lg font-medium text-white">Loading order...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    if (orderError || !order) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                    <h1 className="text-2xl font-bold mb-4 text-white">Order Not Found</h1>
                    <p className="text-gray-400 mb-8">
                        We couldn't find this order. It may not exist or you may not have permission to view it.
                    </p>
                    <Link href="/orders">
                        <Button className="bg-[#00bfff] hover:bg-[#0099cc] text-white">
                            View All Orders
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Only allow reviews for delivered orders with paid status
    const canReview = order.status === 'delivered' && order.payment_status === 'paid';

    return (
        <div className="min-h-screen bg-[#000000]">
            {/* Header */}
            <div className="border-b border-gray-800 bg-[#000000]">
                <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href={`/orders/${orderId}`}>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                                Review Your Order
                            </h1>
                            <p className="text-sm md:text-base text-gray-400 mt-2">
                                Order #{order.id.slice(0, 8).toUpperCase()} • {new Date(order.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Status Alert */}
                    {!canReview && (
                        <Alert className="bg-yellow-900/20 border-yellow-800">
                            <AlertCircle className="h-4 w-4 text-yellow-400" />
                            <AlertDescription className="text-yellow-300">
                                {order.status !== 'delivered' 
                                    ? 'You can only review products after your order has been delivered.'
                                    : order.payment_status !== 'paid'
                                    ? 'You can only review products from paid orders.'
                                    : 'Unable to review this order.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Review Summary */}
                    {canReview && reviewableProducts.length > 0 && (
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Star className="h-5 w-5 text-[#00bfff]" />
                                    Review Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                                        <div className="text-3xl font-bold text-white mb-1">
                                            {reviewableProducts.length}
                                        </div>
                                        <div className="text-sm text-gray-400">Total Products</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-900/20 border border-green-800 rounded-lg">
                                        <div className="text-3xl font-bold text-green-400 mb-1">
                                            {reviewedCount}
                                        </div>
                                        <div className="text-sm text-gray-400">Reviewed</div>
                                    </div>
                                    <div className="text-center p-4 bg-[#00bfff]/10 border border-[#00bfff]/30 rounded-lg">
                                        <div className="text-3xl font-bold text-[#00bfff] mb-1">
                                            {unreviewedCount}
                                        </div>
                                        <div className="text-sm text-gray-400">Pending Review</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Products List */}
                    {canReview && reviewableProducts.length > 0 ? (
                        <div className="space-y-4">
                            <h2 className="text-xl md:text-2xl font-bold text-white">
                                Products from This Order
                            </h2>
                            
                            {reviewableProducts.map((product) => (
                                <Card 
                                    key={product.productId} 
                                    className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                            {/* Product Image */}
                                            <div className="relative w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-700">
                                                {product.productImage ? (
                                                    <Image
                                                        src={product.productImage}
                                                        alt={product.productName}
                                                        fill
                                                        className="object-cover"
                                                        sizes="128px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                        <Package className="h-8 w-8 text-gray-600" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                                                    {product.productName}
                                                </h3>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-sm text-gray-400">
                                                        Quantity: {product.quantity}
                                                    </span>
                                                    {product.hasReview && (
                                                        <Badge className="bg-green-900/30 text-green-400 border-green-800">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Reviewed
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Action Button */}
                                                <div className="flex gap-3">
                                                    {product.hasReview ? (
                                                        <>
                                                            <Link href={`/product/${product.productId}/review`}>
                                                                <Button 
                                                                    variant="outline"
                                                                    className="border-gray-700 text-white hover:bg-gray-800"
                                                                >
                                                                    <Star className="h-4 w-4 mr-2" />
                                                                    Edit Review
                                                                </Button>
                                                            </Link>
                                                            <Link href={`/product/${product.productId}`}>
                                                                <Button 
                                                                    variant="ghost"
                                                                    className="text-gray-400 hover:text-white"
                                                                >
                                                                    View Product
                                                                </Button>
                                                            </Link>
                                                        </>
                                                    ) : (
                                                        <Link href={`/product/${product.productId}/review`}>
                                                            <Button className="bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-medium">
                                                                <Star className="h-4 w-4 mr-2" />
                                                                Write Review
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : canReview ? (
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="text-center py-12">
                                <Package className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                                <h2 className="text-xl font-semibold text-white mb-2">
                                    No Products to Review
                                </h2>
                                <p className="text-gray-400 mb-6">
                                    This order doesn't contain any reviewable products.
                                </p>
                                <Link href={`/orders/${orderId}`}>
                                    <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                                        Back to Order Details
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : null}

                    {/* Back Button */}
                    <div className="flex justify-center pt-6">
                        <Link href={`/orders/${orderId}`}>
                            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Order Details
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
