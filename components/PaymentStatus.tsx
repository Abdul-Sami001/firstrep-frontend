// components/PaymentStatus.tsx - Payment Status Display
import { Badge } from '@/components/ui/badge';
import { Payment } from '@/lib/api/payments';

interface PaymentStatusProps {
    status: Payment['status'];
    className?: string;
}

const statusConfig = {
    created: { label: 'Created', variant: 'secondary' as const },
    processing: { label: 'Processing', variant: 'default' as const },
    succeeded: { label: 'Paid', variant: 'default' as const },
    failed: { label: 'Failed', variant: 'destructive' as const },
    refunded: { label: 'Refunded', variant: 'outline' as const },
};

export default function PaymentStatus({ status, className }: PaymentStatusProps) {
    const config = statusConfig[status];

    return (
        <Badge variant={config.variant} className={className}>
            {config.label}
        </Badge>
    );
}