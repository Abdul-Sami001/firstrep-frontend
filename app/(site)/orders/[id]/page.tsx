// app/(site)/orders/[id]/page.tsx - Order Detail Page with Payment Integration
'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CreditCard, MapPin, Calendar, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrder } from '@/hooks/useOrders';
import { usePayment } from '@/hooks/usePayments';
import { useToast } from '@/hooks/use-toast';
import OrderStatus from '@/components/OrderStatus';
import PaymentStatus from '@/components/PaymentStatus';

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params?.id as string;
    const { toast } = useToast();
    const { data: order, isLoading, error } = useOrder(orderId);
    const { data: payment, isLoading: paymentLoading } = usePayment(orderId);
    const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

    // Show success toast if redirected from payment success
    useEffect(() => {
        const isFromPaymentSuccess = sessionStorage.getItem('fromPaymentSuccess') === 'true';
        if (isFromPaymentSuccess && !hasShownSuccessToast) {
            toast({
                title: "Order confirmed!",
                description: "Your order has been successfully placed and payment processed.",
            });
            setHasShownSuccessToast(true);
            // Clear the flag
            sessionStorage.removeItem('fromPaymentSuccess');
        }
    }, [toast, hasShownSuccessToast]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Order Not Found</h1>
                    <p className="text-muted-foreground mb-8">The order you're looking for doesn't exist.</p>
                    <Link href="/orders">
                        <Button>Back to Orders</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="border-b bg-background">
                <div className="mobile-container tablet-container desktop-container">
                    <div className="py-6">
                        <div className="flex items-center gap-4 mb-4">
                            <Link href="/orders">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <h1 className="text-mobile-h1 md:text-tablet-h1 lg:text-desktop-h1 font-bold">
                                Order #{order.id.slice(0, 8)}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            <OrderStatus status={order.status} />
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Placed on {formatDate(order.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop">

                    {/* Order Items */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                                            <div>
                                                <h4 className="font-medium">Item #{item.product.slice(0, 8)}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {item.quantity}
                                                </p>
                                                {item.variant && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Variant: #{item.variant.slice(0, 8)}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatCurrency(item.price)}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Subtotal: {formatCurrency(item.subtotal)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary & Payment Info */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(order.total - order.vat)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>VAT (20%)</span>
                                        <span>{formatCurrency(order.vat)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                        <span>Total</span>
                                        <span>{formatCurrency(order.total)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Payment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {paymentLoading ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        <span className="text-sm text-muted-foreground">Loading payment info...</span>
                                    </div>
                                ) : payment ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Payment Status:</span>
                                            <PaymentStatus status={payment.status} />
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Amount:</span>
                                            <span className="font-medium">{formatCurrency(payment.amount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Currency:</span>
                                            <span className="font-medium">{payment.currency}</span>
                                        </div>
                                        {payment.stripe_id && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Transaction ID:</span>
                                                <span className="font-medium text-sm font-mono">{payment.stripe_id}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Payment Date:</span>
                                            <span className="font-medium text-sm">{formatDate(payment.created_at)}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-4">No payment information available</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        {order.shipping_address && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Shipping Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                                        {order.shipping_address}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Billing Address */}
                        {order.billing_address && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Billing Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                                        {order.billing_address}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Order Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href="/orders" className="block">
                                    <Button variant="outline" className="w-full">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Orders
                                    </Button>
                                </Link>
                                {order.status === 'delivered' && (
                                    <Button variant="outline" className="w-full">
                                        <Package className="h-4 w-4 mr-2" />
                                        Track Package
                                    </Button>
                                )}
                                {order.status === 'shipped' && (
                                    <Button variant="outline" className="w-full">
                                        <Truck className="h-4 w-4 mr-2" />
                                        Track Shipment
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}