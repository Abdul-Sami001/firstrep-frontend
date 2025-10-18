// app/(site)/payment/success/page.tsx - Payment Success Page
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, CreditCard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/hooks/useOrders';
import { Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get order details if we have the order ID
    const { data: order } = useOrders();

    useEffect(() => {
        // In a real implementation, you'd fetch the order ID from the session
        // For now, we'll use the latest order
        if (order && order.length > 0) {
            setOrderId(order[0].id);
        }
        setIsLoading(false);
    }, [order]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Processing payment...</p>
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
                        <div className="flex items-center gap-4 mb-4">
                            <Link href="/">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <h1 className="text-mobile-h1 md:text-tablet-h1 lg:text-desktop-h1 font-bold">
                                Payment Successful
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Success Message */}
                    <Card className="text-center mb-8">
                        <CardHeader>
                            <div className="flex items-center justify-center mb-4">
                                <CheckCircle className="h-16 w-16 text-green-500" />
                            </div>
                            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-6">
                                Thank you for your purchase. Your payment has been processed successfully.
                            </p>
                            {sessionId && (
                                <p className="text-sm text-muted-foreground">
                                    Session ID: {sessionId}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Information */}
                    {orderId && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order Number:</span>
                                        <span className="font-medium">#{orderId.slice(0, 8)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <span className="font-medium">Processing</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Payment Method:</span>
                                        <span className="font-medium flex items-center gap-1">
                                            <CreditCard className="h-4 w-4" />
                                            Card Payment
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {orderId && (
                            <Link href={`/orders/${orderId}`} className="flex-1">
                                <Button className="w-full" size="lg">
                                    <Package className="h-4 w-4 mr-2" />
                                    View Order Details
                                </Button>
                            </Link>
                        )}
                        <Link href="/orders" className="flex-1">
                            <Button variant="outline" className="w-full" size="lg">
                                View All Orders
                            </Button>
                        </Link>
                        <Link href="/" className="flex-1">
                            <Button variant="ghost" className="w-full" size="lg">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}