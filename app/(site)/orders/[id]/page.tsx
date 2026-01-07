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
            case 'pending': return 'bg-yellow-900/30 text-yellow-400 border-yellow-800';
            case 'processing': return 'bg-blue-900/30 text-blue-400 border-blue-800';
            case 'shipped': return 'bg-purple-900/30 text-purple-400 border-purple-800';
            case 'delivered': return 'bg-green-900/30 text-green-400 border-green-800';
            case 'cancelled': return 'bg-red-900/30 text-red-400 border-red-800';
            default: return 'bg-gray-800 text-gray-400 border-gray-700';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-900/30 text-yellow-400 border-yellow-800';
            case 'paid': return 'bg-green-900/30 text-green-400 border-green-800';
            case 'failed': return 'bg-red-900/30 text-red-400 border-red-800';
            case 'refunded': return 'bg-gray-800 text-gray-400 border-gray-700';
            default: return 'bg-gray-800 text-gray-400 border-gray-700';
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
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
                    <p className="text-lg font-medium text-white">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <h1 className="text-2xl font-bold mb-4 text-white">Error Loading Order</h1>
                    <p className="text-gray-400 mb-8">There was a problem loading your order.</p>
                    <Button onClick={() => window.location.reload()} className="bg-white text-black hover:bg-gray-200">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <h1 className="text-2xl font-bold mb-4 text-white">Order Not Found</h1>
                    <p className="text-gray-400 mb-8">The order you're looking for doesn't exist.</p>
                    <Link href="/orders">
                        <Button className="bg-white text-black hover:bg-gray-200">View All Orders</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const StatusIcon = getStatusIcon(order.status);

    return (
        <div className="min-h-screen bg-[#000000]">
            {/* Enhanced Header */}
            <div className="border-b border-gray-800 bg-[#000000]">
                <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/orders">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                                Order Details
                            </h1>
                            <p className="text-sm md:text-base text-gray-400">
                                Order #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Order Status */}
                    <Card className="bg-gray-900 border-gray-800 border-l-4 border-l-[#00bfff]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <StatusIcon className="h-5 w-5" />
                                Order Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 flex-wrap">
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
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Calendar className="h-5 w-5" />
                                Order Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Order Number:</span>
                                        <span className="font-medium text-white">#{order.id.slice(0, 8).toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Order Date:</span>
                                        <span className="font-medium text-white">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Total Amount:</span>
                                        <span className="font-medium text-[#00bfff]">${computedPrice(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Payment Method:</span>
                                        <span className="font-medium flex items-center gap-1 text-white">
                                            <CreditCard className="h-4 w-4" />
                                            {order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1)}
                                        </span>
                                    </div>
                                    {order.payment_reference && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Payment Reference:</span>
                                            <span className="font-mono text-sm text-gray-300">{order.payment_reference}</span>
                                        </div>
                                    )}
                                    {computedPrice(order.vat) !== 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">VAT:</span>
                                            <span className="font-medium text-white">${computedPrice(order.vat).toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <MapPin className="h-5 w-5" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-line text-gray-300">{order.shipping_address}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Order Items */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Package className="h-5 w-5" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                        {/* Product Image - Using new API field */}
                                        {item.product_image ? (
                                            <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border border-gray-700">
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
                                            <div className="w-20 h-20 flex-shrink-0 bg-gray-800 rounded-md flex items-center justify-center border border-gray-700">
                                                <Package className="h-6 w-6 text-gray-500" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            {/* Product Name - Using new API field */}
                                            <p className="font-medium text-base mb-1 text-white">
                                                {item.product_name || `Product #${item.product.slice(0, 8).toUpperCase()}`}
                                            </p>
                                            <div className="text-sm text-gray-400 space-y-1">
                                                <div>
                                                    Quantity: {item.quantity} • ${computedPrice(item.price).toFixed(2)} each
                                                </div>
                                                {/* Size and Color - Using new API fields */}
                                                {(item.size || item.color) && (
                                                    <div className="flex gap-3 flex-wrap">
                                                        {item.size && (
                                                            <span>Size: <span className="font-medium text-gray-300">{item.size}</span></span>
                                                        )}
                                                        {item.color && (
                                                            <span>Color: <span className="font-medium text-gray-300">{item.color}</span></span>
                                                        )}
                                                    </div>
                                                )}
                                                {/* Variant SKU - Using new API field */}
                                                {item.variant_sku && (
                                                    <div className="text-xs font-mono text-gray-500">SKU: {item.variant_sku}</div>
                                                )}
                                            </div>
                                        </div>
                                        <span className="font-semibold text-lg flex-shrink-0 text-white">${computedPrice(item.subtotal).toFixed(2)}</span>
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