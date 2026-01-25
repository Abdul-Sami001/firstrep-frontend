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
    const { data: ordersData, isLoading, error } = useOrders({
        status: statusFilter === 'all' ? undefined : statusFilter
    });

    // Handle different response formats (array or paginated response)
    const orders = Array.isArray(ordersData) 
        ? ordersData 
        : (ordersData && typeof ordersData === 'object' && 'results' in ordersData 
            ? (ordersData as any).results 
            : []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
                    <p className="text-gray-400">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4 text-white">Error Loading Orders</h1>
                    <p className="text-gray-400 mb-8">There was a problem loading your orders.</p>
                    <Button onClick={() => window.location.reload()} className="bg-white text-black hover:bg-gray-200">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000]">
            {/* Header */}
            <div className="border-b border-gray-800 bg-[#000000]">
                <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                        Your Orders
                    </h1>
                    <p className="text-sm md:text-base text-gray-400">
                        Track and manage your orders
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="border-b border-gray-800 bg-[#000000]">
                <div className="mobile-container tablet-container desktop-container">
                    <div className="py-4">
                        <div className="flex items-center gap-4">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                    <SelectItem value="all" className="text-white">All Orders</SelectItem>
                                    <SelectItem value="pending" className="text-white">Pending</SelectItem>
                                    <SelectItem value="processing" className="text-white">Processing</SelectItem>
                                    <SelectItem value="shipped" className="text-white">Shipped</SelectItem>
                                    <SelectItem value="delivered" className="text-white">Delivered</SelectItem>
                                    <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="mobile-container tablet-container desktop-container py-8 md:py-12">
                {!Array.isArray(orders) || orders.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold mb-2 text-white">No Orders Found</h2>
                        <p className="text-gray-400 mb-8">
                            {statusFilter === 'all'
                                ? "You haven't placed any orders yet."
                                : `No orders with status "${statusFilter}".`
                            }
                        </p>
                        <Button asChild className="bg-white text-black hover:bg-gray-200">
                            <a href="/shop-clean">Start Shopping</a>
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