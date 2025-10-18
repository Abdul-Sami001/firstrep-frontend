// components/OrderCard.tsx - Order Summary Card
import Link from 'next/link';
import { Calendar, Package, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderStatus from '@/components/OrderStatus';
import { Order } from '@/lib/api/orders';

interface OrderCardProps {
    order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <Card className="hover-elevate transition-all duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <OrderStatus status={order.status} />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {/* Items Preview */}
                <div className="space-y-2">
                    <h4 className="font-medium text-sm">Items:</h4>
                    <div className="space-y-1">
                        {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
                                <span>Item #{item.product.slice(0, 8)}</span>
                                <span>Qty: {item.quantity}</span>
                            </div>
                        ))}
                        {order.items.length > 3 && (
                            <div className="text-sm text-muted-foreground">
                                +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm">Total</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(order.total)}</span>
                </div>

                {/* Action Button */}
                <Link href={`/orders/${order.id}`}>
                    <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors">
                        View Details
                    </button>
                </Link>
            </CardContent>
        </Card>
    );
}