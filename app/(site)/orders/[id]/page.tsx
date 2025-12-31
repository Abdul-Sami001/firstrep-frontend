// app/(site)/orders/[id]/page.tsx
'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, Truck, CreditCard, MapPin, Calendar, User, Loader2, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrder } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params?.id as string;
    const { toast } = useToast();
    const { data: order, isLoading, error } = useOrder(orderId);
    const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

    // Helper function to handle string prices
    const computedPrice = (price: any): number => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            const parsed = parseFloat(price);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    // Show success toast if redirected from payment success
    useEffect(() => {
        const isFromPaymentSuccess = sessionStorage.getItem('fromPaymentSuccess') === 'true';
        if (isFromPaymentSuccess && !hasShownSuccessToast && order) {
            toast({
                title: "Order confirmed!",
                description: "Your order has been successfully placed and payment processed.",
            });
            setHasShownSuccessToast(true);
            // Clear the flag
            sessionStorage.removeItem('fromPaymentSuccess');
        }
    }, [toast, hasShownSuccessToast, order]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'paid': return 'bg-green-100 text-green-800 border-green-200';
            case 'failed': return 'bg-red-100 text-red-800 border-red-200';
            case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return Clock;
            case 'processing': return Package;
            case 'shipped': return Truck;
            case 'delivered': return CheckCircle;
            case 'cancelled': return XCircle;
            default: return AlertCircle;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-lg font-medium">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h1 className="text-2xl font-bold mb-4">Error Loading Order</h1>
                    <p className="text-muted-foreground mb-8">There was a problem loading your order.</p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                    <p className="text-muted-foreground mb-8">The order you're looking for doesn't exist.</p>
                    <Link href="/orders">
                        <Button>View All Orders</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const StatusIcon = getStatusIcon(order.status);

    return (
        <div className="min-h-screen">
            {/* Enhanced Header */}
            <div className="border-b bg-gradient-to-r from-background to-muted/20">
                <div className="mobile-container tablet-container desktop-container">
                    <div className="py-6">
                        <div className="flex items-center gap-4 mb-4">
                            <Link href="/orders">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div className="flex-1">
                                <h1 className="text-mobile-h1 md:text-tablet-h1 lg:text-desktop-h1 font-bold">
                                    Order Details
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Order #{order.id.slice(0, 8).toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Order Status */}
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <StatusIcon className="h-5 w-5" />
                                Order Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Badge className={`${getStatusColor(order.status)} border`}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                                <Badge className={`${getPaymentStatusColor(order.payment_status)} border`}>
                                    Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Order Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order Number:</span>
                                        <span className="font-medium">#{order.id.slice(0, 8).toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order Date:</span>
                                        <span className="font-medium">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Amount:</span>
                                        <span className="font-medium">${computedPrice(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Payment Method:</span>
                                        <span className="font-medium flex items-center gap-1">
                                            <CreditCard className="h-4 w-4" />
                                            {order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1)}
                                        </span>
                                    </div>
                                    {order.payment_reference && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Payment Reference:</span>
                                            <span className="font-mono text-sm">{order.payment_reference}</span>
                                        </div>
                                    )}
                                    {computedPrice(order.vat) !== 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">VAT:</span>
                                            <span className="font-medium">${computedPrice(order.vat).toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
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
                                <p className="whitespace-pre-line">{order.shipping_address}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Order Items */}
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
                                    <div key={item.id} className="flex gap-4 items-center p-4 bg-muted/50 rounded-lg">
                                        {/* Product Image - Using new API field */}
                                        {item.product_image ? (
                                            <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border border-border">
                                                <Image
                                                    src={item.product_image}
                                                    alt={item.product_name || `Product ${item.product.slice(0, 8)}`}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                    sizes="80px"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-md flex items-center justify-center border border-border">
                                                <Package className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            {/* Product Name - Using new API field */}
                                            <p className="font-medium text-base mb-1">
                                                {item.product_name || `Product #${item.product.slice(0, 8).toUpperCase()}`}
                                            </p>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <div>
                                                    Quantity: {item.quantity} • ${computedPrice(item.price).toFixed(2)} each
                                                </div>
                                                {/* Size and Color - Using new API fields */}
                                                {(item.size || item.color) && (
                                                    <div className="flex gap-3 flex-wrap">
                                                        {item.size && (
                                                            <span>Size: <span className="font-medium text-foreground">{item.size}</span></span>
                                                        )}
                                                        {item.color && (
                                                            <span>Color: <span className="font-medium text-foreground">{item.color}</span></span>
                                                        )}
                                                    </div>
                                                )}
                                                {/* Variant SKU - Using new API field */}
                                                {item.variant_sku && (
                                                    <div className="text-xs font-mono text-muted-foreground">SKU: {item.variant_sku}</div>
                                                )}
                                            </div>
                                        </div>
                                        <span className="font-semibold text-lg flex-shrink-0">${computedPrice(item.subtotal).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}