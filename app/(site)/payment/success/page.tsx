// app/(site)/payment/success/page.tsx - Enhanced Payment Success Page
'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, CreditCard, ArrowLeft, Loader2, AlertCircle, Mail, User, Key, ShoppingBag, Sparkles, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const { isAuthenticated, user } = useAuth();
    const sessionId = searchParams.get('session_id');

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
            description: isAuthenticated 
                ? "Your payment has been processed. Check your email for order confirmation."
                : "Your payment has been processed. Check your email for order confirmation and tracking details.",
        });

        // Simulate order processing
        setTimeout(() => {
            setIsLoading(false);
            setVerificationStatus('success');
        }, 2000);

    }, [sessionId, toast, isAuthenticated]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#00bfff]" />
                    <p className="text-xl font-semibold mb-2 text-white">Processing Your Order</p>
                    <p className="text-sm text-gray-400">
                        Please wait while we confirm your payment and prepare your order confirmation...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000]">
            {/* Header */}
            <div className="border-b border-gray-800 bg-[#000000]">
                <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            Payment Successful
                        </h1>
                    </div>
                </div>
            </div>

            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Success Message Card */}
                    <Card className="text-center bg-gradient-to-br from-gray-900 to-gray-800 border-[#00bfff]/20 shadow-lg shadow-[#00bfff]/10">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-center mb-4">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
                                        <CheckCircle className="h-14 w-14 text-green-400" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#00bfff] rounded-full flex items-center justify-center">
                                        <Sparkles className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            </div>
                            <CardTitle className="text-3xl md:text-4xl text-white mb-2">
                                Payment Successful!
                            </CardTitle>
                            <p className="text-lg text-gray-300">
                                Thank you for your purchase. Your order is being processed.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
                                <CreditCard className="h-4 w-4" />
                                <span>Payment processed via Stripe</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Email Confirmation Card */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Mail className="h-5 w-5 text-[#00bfff]" />
                                Email Confirmation Sent
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                <Mail className="h-5 w-5 text-[#00bfff] mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-white font-medium mb-1">Order Confirmation Email</p>
                                    <p className="text-sm text-gray-400">
                                        {isAuthenticated 
                                            ? `We've sent a confirmation email to ${user?.email || 'your registered email'}. Check your inbox for order details and tracking information.`
                                            : "We've sent a confirmation email with your order details and tracking information. Please check your inbox (and spam folder)."
                                        }
                                    </p>
                                </div>
                            </div>
                            {!isAuthenticated && (
                                <div className="flex items-start gap-3 p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
                                    <Key className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-white font-medium mb-1">Tracking Token Included</p>
                                        <p className="text-sm text-gray-400">
                                            Your email contains a unique tracking token. Use it to track your order status without creating an account.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* User-Specific Information Cards */}
                    {isAuthenticated ? (
                        // Authenticated User Card
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <User className="h-5 w-5 text-[#00bfff]" />
                                    Your Order Dashboard
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Package className="h-5 w-5 text-[#00bfff] mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-white font-medium">View Order History</p>
                                            <p className="text-sm text-gray-400">
                                                Access all your orders, track shipments, and manage returns from your profile.
                                            </p>
                                        </div>
                                    </div>
                                    <Separator className="bg-gray-800" />
                                    <div className="flex items-start gap-3">
                                        <Truck className="h-5 w-5 text-[#00bfff] mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-white font-medium">Real-Time Updates</p>
                                            <p className="text-sm text-gray-400">
                                                Receive email notifications when your order status changes.
                                            </p>
                                        </div>
                                    </div>
                                    <Separator className="bg-gray-800" />
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-[#00bfff] mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-white font-medium">Order Processing</p>
                                            <p className="text-sm text-gray-400">
                                                Your order is being prepared. You'll receive an email when it ships.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        // Guest User Card
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Key className="h-5 w-5 text-[#00bfff]" />
                                    Guest Order Tracking
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-[#00bfff] mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-white font-medium">Check Your Email</p>
                                            <p className="text-sm text-gray-400">
                                                Your confirmation email contains a unique tracking token. Use it to track your order status.
                                            </p>
                                        </div>
                                    </div>
                                    <Separator className="bg-gray-800" />
                                    <div className="flex items-start gap-3">
                                        <Package className="h-5 w-5 text-[#00bfff] mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-white font-medium">Track Your Order</p>
                                            <p className="text-sm text-gray-400">
                                                Visit our order tracking page and enter your tracking token to see order status and updates.
                                            </p>
                                        </div>
                                    </div>
                                    <Separator className="bg-gray-800" />
                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-[#00bfff] mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-white font-medium">Create an Account</p>
                                            <p className="text-sm text-gray-400">
                                                Want easier order management? Create an account to view all your orders in one place.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Order Status Card */}
                    {verificationStatus === 'success' && (
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Package className="h-5 w-5" />
                                    Order Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                                        <span className="text-gray-400">Status:</span>
                                        <span className="font-semibold text-white flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-[#00bfff]" />
                                            Processing
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                                        <span className="text-gray-400">Payment Method:</span>
                                        <span className="font-medium flex items-center gap-2 text-white">
                                            <CreditCard className="h-4 w-4" />
                                            Card Payment
                                        </span>
                                    </div>
                                    {sessionId && (
                                        <div className="p-3 bg-gray-800/30 rounded-lg">
                                            <p className="text-xs text-gray-500 font-mono break-all">
                                                Session: {sessionId}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Error State */}
                    {verificationStatus === 'failed' && (
                        <Card className="bg-gray-900 border-red-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                    Verification Issue
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400 mb-4">
                                    {!sessionId 
                                        ? "No session ID found. Please contact support if you completed a payment."
                                        : "We couldn't verify your payment automatically. Don't worry - if you completed the payment, your order is being processed."
                                    }
                                </p>
                                <p className="text-sm text-gray-500">
                                    Check your email for order confirmation or contact support for assistance.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {isAuthenticated ? (
                            <>
                                <Link href="/orders">
                                    <Button className="w-full bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-semibold" size="lg">
                                        <Package className="h-4 w-4 mr-2" />
                                        View My Orders
                                    </Button>
                                </Link>
                                <Link href="/profile">
                                    <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white" size="lg">
                                        <User className="h-4 w-4 mr-2" />
                                        Go to Profile
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/order-tracking">
                                    <Button className="w-full bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-semibold" size="lg">
                                        <Key className="h-4 w-4 mr-2" />
                                        Track My Order
                                    </Button>
                                </Link>
                                <Link href="/CustomerLogin">
                                    <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white" size="lg">
                                        <User className="h-4 w-4 mr-2" />
                                        Create Account
                                    </Button>
                                </Link>
                            </>
                        )}
                        <Link href="/shop-clean" className="sm:col-span-2">
                            <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white" size="lg">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>

                    {/* Help Section */}
                    <Card className="bg-gray-900/50 border-gray-800">
                        <CardContent className="pt-6">
                            <p className="text-sm text-gray-400 text-center">
                                Need help? <Link href="/contact-support" className="text-[#00bfff] hover:text-white underline">Contact Support</Link> or check our <Link href="/faq" className="text-[#00bfff] hover:text-white underline">FAQ</Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
                    <p className="text-lg font-medium text-white">Loading...</p>
                </div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}