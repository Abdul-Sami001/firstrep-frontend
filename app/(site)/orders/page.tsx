// app/(site)/orders/page.tsx - Orders List Page
'use client';
import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import OrderCard from '@/components/OrderCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Filter } from 'lucide-react';

export default function OrdersPage() {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const { data: orders, isLoading, error } = useOrders({
        status: statusFilter === 'all' ? undefined : statusFilter
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Error Loading Orders</h1>
                    <p className="text-muted-foreground mb-8">There was a problem loading your orders.</p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="border-b bg-background">
                <div className="mobile-container tablet-container desktop-container">
                    <div className="py-6">
                        <h1 className="text-mobile-h1 md:text-tablet-h1 lg:text-desktop-h1 font-bold mb-2">
                            Your Orders
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Track and manage your orders
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="border-b bg-background">
                <div className="mobile-container tablet-container desktop-container">
                    <div className="py-4">
                        <div className="flex items-center gap-4">
                            <Filter className="h-4 w-4" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Orders</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                {!orders || orders.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
                        <p className="text-muted-foreground mb-8">
                            {statusFilter === 'all'
                                ? "You haven't placed any orders yet."
                                : `No orders with status "${statusFilter}".`
                            }
                        </p>
                        <Button asChild>
                            <a href="/">Start Shopping</a>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}