// components/OrderStatus.tsx - Order Status Display
import { Badge } from '@/components/ui/badge';
import { Order } from '@/lib/api/orders';

interface OrderStatusProps {
    status: Order['status'];
    className?: string;
}

const statusConfig = {
    pending: { label: 'Pending', variant: 'secondary' as const },
    processing: { label: 'Processing', variant: 'default' as const },
    shipped: { label: 'Shipped', variant: 'default' as const },
    delivered: { label: 'Delivered', variant: 'default' as const },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const },
    refunded: { label: 'Refunded', variant: 'outline' as const },
};

export default function OrderStatus({ status, className }: OrderStatusProps) {
    const config = statusConfig[status];

    return (
        <Badge variant={config.variant} className={className}>
            {config.label}
        </Badge>
    );
}