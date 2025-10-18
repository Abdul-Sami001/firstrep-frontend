// app/(site)/payment/cancel/page.tsx - Payment Cancel Page
'use client';
import Link from 'next/link';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentCancelPage() {
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
                                Payment Cancelled
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Cancel Message */}
                    <Card className="text-center mb-8">
                        <CardHeader>
                            <div className="flex items-center justify-center mb-4">
                                <XCircle className="h-16 w-16 text-orange-500" />
                            </div>
                            <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-6">
                                Your payment was cancelled. No charges have been made to your account.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                You can try again or contact support if you need assistance.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/cart" className="flex-1">
                            <Button className="w-full" size="lg">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Try Payment Again
                            </Button>
                        </Link>
                        <Link href="/orders" className="flex-1">
                            <Button variant="outline" className="w-full" size="lg">
                                View Orders
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