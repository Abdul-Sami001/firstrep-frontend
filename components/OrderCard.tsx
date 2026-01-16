// components/OrderCard.tsx
import Link from 'next/link';
import Image from 'next/image';
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
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
        }).format(numAmount);
    };

    // Enhanced status colors and icons - Dark theme
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    color: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
                    icon: Clock,
                    label: 'Pending'
                };
            case 'processing':
                return {
                    color: 'bg-blue-900/30 text-blue-400 border-blue-800',
                    icon: Package,
                    label: 'Processing'
                };
            case 'shipped':
                return {
                    color: 'bg-purple-900/30 text-purple-400 border-purple-800',
                    icon: Truck,
                    label: 'Shipped'
                };
            case 'delivered':
                return {
                    color: 'bg-green-900/30 text-green-400 border-green-800',
                    icon: CheckCircle,
                    label: 'Delivered'
                };
            case 'cancelled':
                return {
                    color: 'bg-red-900/30 text-red-400 border-red-800',
                    icon: XCircle,
                    label: 'Cancelled'
                };
            case 'refunded':
                return {
                    color: 'bg-gray-800 text-gray-400 border-gray-700',
                    icon: AlertCircle,
                    label: 'Refunded'
                };
            default:
                return {
                    color: 'bg-gray-800 text-gray-400 border-gray-700',
                    icon: Clock,
                    label: 'Unknown'
                };
        }
    };

    const getPaymentStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    color: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
                    label: 'Payment Pending'
                };
            case 'paid':
                return {
                    color: 'bg-green-900/30 text-green-400 border-green-800',
                    label: 'Paid'
                };
            case 'failed':
                return {
                    color: 'bg-red-900/30 text-red-400 border-red-800',
                    label: 'Payment Failed'
                };
            case 'refunded':
                return {
                    color: 'bg-gray-800 text-gray-400 border-gray-700',
                    label: 'Refunded'
                };
            default:
                return {
                    color: 'bg-gray-800 text-gray-400 border-gray-700',
                    label: 'Unknown'
                };
        }
    };

    const statusConfig = getStatusConfig(order.status);
    const paymentConfig = getPaymentStatusConfig(order.payment_status);
    const StatusIcon = statusConfig.icon;

    return (
        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 border-l-4 border-l-[#00bfff]/20 hover:border-l-[#00bfff]">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold text-white">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-gray-400 mt-1">
                            {formatDate(order.created_at)}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Badge className={`${statusConfig.color} border`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                        </Badge>
                        <Badge variant="outline" className={`${paymentConfig.color} border text-xs`}>
                            {paymentConfig.label}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Order Summary */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Package className="h-4 w-4" />
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <CreditCard className="h-4 w-4" />
                        <span className="capitalize">{order.payment_method}</span>
                    </div>
                </div>

                {/* Items Preview with Enhanced Design */}
                <div className="space-y-3">
                    <h4 className="font-medium text-sm text-white">Items:</h4>
                    <div className="space-y-2">
                        {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex gap-3 items-center p-2 bg-gray-800/50 rounded-md border border-gray-700">
                                {/* Product Image - Using new API field */}
                                {item.product_image ? (
                                    <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden border border-gray-700">
                                        <Image
                                            src={item.product_image}
                                            alt={item.product_name || (item.product ? `Product ${item.product.slice(0, 8)}` : 'Product image')}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                            sizes="48px"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 flex-shrink-0 bg-gray-800 rounded-md flex items-center justify-center border border-gray-700">
                                        <Package className="h-4 w-4 text-gray-500" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    {/* Product Name - Using new API field */}
                                    <span className="text-sm font-medium block truncate text-white">
                                        {item.product_name || (item.product ? `Product #${item.product.slice(0, 8)}` : 'Unknown Product')}
                                    </span>
                                    <div className="text-xs text-gray-400 space-y-1">
                                        <div>
                                            Qty: {item.quantity} • {formatCurrency(item.price)} each
                                        </div>
                                        {/* Size and Color - Using new API fields */}
                                        {(item.size || item.color) && (
                                            <div className="flex gap-2 flex-wrap">
                                                {item.size && (
                                                    <span>Size: {item.size}</span>
                                                )}
                                                {item.color && (
                                                    <span>Color: {item.color}</span>
                                                )}
                                            </div>
                                        )}
                                        {/* Variant SKU - Using new API field */}
                                        {item.variant_sku && (
                                            <div className="text-xs font-mono">SKU: {item.variant_sku}</div>
                                        )}
                                    </div>
                                </div>
                                <span className="text-sm font-semibold flex-shrink-0 text-white">
                                    {formatCurrency(item.subtotal)}
                                </span>
                            </div>
                        ))}
                        {order.items.length > 2 && (
                            <div className="text-sm text-gray-500 text-center py-1">
                                +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-2 pt-3 border-t border-gray-800">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="text-white">{formatCurrency(order.total)}</span>
                    </div>
                    {computedPrice(order.vat) !== 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">VAT:</span>
                            <span className="text-white">{formatCurrency(order.vat)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-semibold text-base pt-1 border-t border-gray-800">
                        <span className="text-white">Total:</span>
                        <span className="text-[#00bfff]">{formatCurrency(order.total)}</span>
                    </div>
                </div>

                {/* Shipping Address Preview */}
                {order.shipping_address && (
                    <div className="flex items-start gap-2 text-sm text-gray-400">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="truncate">{order.shipping_address}</span>
                    </div>
                )}

                {/* Action Button */}
                <Link href={`/orders/${order.id}`}>
                    <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-white border border-[#00bfff] rounded-md hover:bg-[#00bfff] hover:text-black transition-all duration-200 hover:shadow-md hover:shadow-[#00bfff]/30">
                        View Details
                    </button>
                </Link>
            </CardContent>
        </Card>
    );
}