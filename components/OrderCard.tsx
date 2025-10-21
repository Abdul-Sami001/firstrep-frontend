// components/OrderCard.tsx
import Link from 'next/link';
import { Calendar, Package, CreditCard, MapPin, AlertCircle, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/lib/api/orders';

interface OrderCardProps {
    order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
    // Helper function to handle string prices
    const computedPrice = (price: any): number => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            const parsed = parseFloat(price);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: string | number) => {
        const numAmount = computedPrice(amount);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(numAmount);
    };

    // Enhanced status colors and icons
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    icon: Clock,
                    label: 'Pending'
                };
            case 'processing':
                return {
                    color: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: Package,
                    label: 'Processing'
                };
            case 'shipped':
                return {
                    color: 'bg-purple-100 text-purple-800 border-purple-200',
                    icon: Truck,
                    label: 'Shipped'
                };
            case 'delivered':
                return {
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: CheckCircle,
                    label: 'Delivered'
                };
            case 'cancelled':
                return {
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: XCircle,
                    label: 'Cancelled'
                };
            case 'refunded':
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: AlertCircle,
                    label: 'Refunded'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: Clock,
                    label: 'Unknown'
                };
        }
    };

    const getPaymentStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    label: 'Payment Pending'
                };
            case 'paid':
                return {
                    color: 'bg-green-100 text-green-800',
                    label: 'Paid'
                };
            case 'failed':
                return {
                    color: 'bg-red-100 text-red-800',
                    label: 'Payment Failed'
                };
            case 'refunded':
                return {
                    color: 'bg-gray-100 text-gray-800',
                    label: 'Refunded'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    label: 'Unknown'
                };
        }
    };

    const statusConfig = getStatusConfig(order.status);
    const paymentConfig = getPaymentStatusConfig(order.payment_status);
    const StatusIcon = statusConfig.icon;

    return (
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {formatDate(order.created_at)}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Badge className={`${statusConfig.color} border`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                        </Badge>
                        <Badge variant="outline" className={`${paymentConfig.color} text-xs`}>
                            {paymentConfig.label}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Order Summary */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        <span className="capitalize">{order.payment_method}</span>
                    </div>
                </div>

                {/* Items Preview with Enhanced Design */}
                <div className="space-y-3">
                    <h4 className="font-medium text-sm text-foreground">Items:</h4>
                    <div className="space-y-2">
                        {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                                <div className="flex-1">
                                    <span className="text-sm font-medium">Product #{item.product.slice(0, 8)}</span>
                                    <div className="text-xs text-muted-foreground">
                                        Qty: {item.quantity} • {formatCurrency(item.price)} each
                                    </div>
                                </div>
                                <span className="text-sm font-semibold">
                                    {formatCurrency(item.subtotal)}
                                </span>
                            </div>
                        ))}
                        {order.items.length > 2 && (
                            <div className="text-sm text-muted-foreground text-center py-1">
                                +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-2 pt-3 border-t">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>{formatCurrency(order.total)}</span>
                    </div>
                    {computedPrice(order.vat) !== 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">VAT:</span>
                            <span>{formatCurrency(order.vat)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-semibold text-base pt-1 border-t">
                        <span>Total:</span>
                        <span className="text-primary">{formatCurrency(order.total)}</span>
                    </div>
                </div>

                {/* Shipping Address Preview */}
                {order.shipping_address && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="truncate">{order.shipping_address}</span>
                    </div>
                )}

                {/* Action Button */}
                <Link href={`/orders/${order.id}`}>
                    <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:shadow-md">
                        View Details
                    </button>
                </Link>
            </CardContent>
        </Card>
    );
}