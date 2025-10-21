// app/(site)/payment/success/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, CreditCard, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useVerifyPayment } from '@/hooks/usePayments'; // ✅ Commented out
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const sessionId = searchParams.get('session_id');
    // const verifyPaymentMutation = useVerifyPayment(); // ✅ Commented out

    const [orderId, setOrderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');

    useEffect(() => {
        if (!sessionId) {
            toast({
                title: "Invalid Payment Session",
                description: "No session ID found. Please contact support.",
                variant: "destructive"
            });
            setIsLoading(false);
            setVerificationStatus('failed');
            return;
        }

        // Show success toast immediately
        toast({
            title: "Payment Successful!",
            description: "Your payment has been processed. We're updating your order...",
        });

        // ✅ COMMENTED OUT PAYMENT VERIFICATION API CALL
        // const verifyPayment = async () => {
        //     try {
        //         const result = await verifyPaymentMutation.mutateAsync({
        //             session_id: sessionId
        //         });

        //         if (result.order_id) {
        //             setOrderId(result.order_id);
        //             setVerificationStatus('success');

        //             toast({
        //                 title: "Order Confirmed!",
        //                 description: "Your order is being processed.",
        //             });

        //             // Auto-redirect to order details after 3 seconds
        //             setTimeout(() => {
        //                 sessionStorage.setItem('fromPaymentSuccess', 'true');
        //                 router.push(`/orders/${result.order_id}`);
        //             }, 3000);
        //         } else {
        //             setVerificationStatus('failed');
        //         }
        //     } catch (error: any) {
        //         console.error('Payment verification failed:', error);
        //         setVerificationStatus('failed');

        //         // Better error messages based on error type
        //         if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        //             toast({
        //                 title: "Verification Timeout",
        //                 description: "Payment verification is taking longer than expected. Please check your orders page.",
        //                 variant: "destructive"
        //             });
        //         } else {
        //             toast({
        //                 title: "Payment Verification Failed",
        //                 description: "Your payment was successful, but we couldn't verify it automatically. Please contact support.",
        //                 variant: "destructive"
        //             });
        //         }
        //     } finally {
        //         setIsLoading(false);
        //     }
        // };

        // ✅ COMMENTED OUT: Start verification
        // verifyPayment();

        // ✅ SIMPLIFIED: Just show success and redirect to orders
        setTimeout(() => {
            setIsLoading(false);
            setVerificationStatus('success');
            toast({
                title: "Order Processing",
                description: "Your order is being processed. Check your orders page for updates.",
            });
        }, 2000);

    }, [sessionId, toast, router]); // ✅ Removed verifyPaymentMutation from dependencies

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Processing Your Order</p>
                    <p className="text-sm text-muted-foreground">
                        Please wait while we confirm your payment...
                    </p>
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
                    {verificationStatus === 'success' ? (
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
                    ) : (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                    Processing Order
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Your payment was successful. We're processing your order and will update you shortly.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/orders" className="flex-1">
                            <Button className="w-full" size="lg">
                                <Package className="h-4 w-4 mr-2" />
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