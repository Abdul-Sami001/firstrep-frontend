"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    Package,
    TrendingUp,
    AlertTriangle,
    ShoppingCart,
    DollarSign,
    Users,
    Eye,
    Plus,
    Minus
} from "lucide-react";

// Mock data for demonstration
const mockResellerData = {
    businessName: "Elite Fitness Gym",
    tier: "Gold",
    discountPercentage: 25,
    creditLimit: 5000,
    currentCredit: 1250,
    totalOrders: 47,
    monthlyRevenue: 12400,
    stockAlerts: 3
};

const mockInventory = [
    {
        id: "1",
        productName: "1st Rep Classic T-Shirt",
        sku: "1R-TS-001",
        size: "M",
        color: "Black",
        quantity: 15,
        reorderLevel: 10,
        wholesalePrice: 16.50,
        retailPrice: 22.00,
        lastOrdered: "2024-09-20"
    },
    {
        id: "2",
        productName: "1st Rep Classic Hoodie",
        sku: "1R-HD-001",
        size: "L",
        color: "Grey",
        quantity: 5,
        reorderLevel: 8,
        wholesalePrice: 30.00,
        retailPrice: 40.00,
        lastOrdered: "2024-09-18"
    },
    {
        id: "3",
        productName: "High Neck Sports Bra",
        sku: "1R-SB-001",
        size: "M",
        color: "Black",
        quantity: 2,
        reorderLevel: 5,
        wholesalePrice: 22.50,
        retailPrice: 30.00,
        lastOrdered: "2024-09-15"
    }
];

const mockOrders = [
    {
        id: "ORD-001",
        orderNumber: "ORD-1758805234-ABC12",
        status: "shipped",
        totalAmount: 450.00,
        orderDate: "2024-09-22",
        trackingNumber: "1Z999AA1234567890"
    },
    {
        id: "ORD-002",
        orderNumber: "ORD-1758805123-DEF34",
        status: "delivered",
        totalAmount: 320.00,
        orderDate: "2024-09-20",
        trackingNumber: "1Z999AA1234567891"
    }
];

export default function ResellerDashboard() {
    const [selectedTab, setSelectedTab] = useState("overview");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-500";
            case "confirmed": return "bg-blue-500";
            case "shipped": return "bg-purple-500";
            case "delivered": return "bg-green-500";
            case "cancelled": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    const getLowStockItems = () => {
        return mockInventory.filter(item => item.quantity <= item.reorderLevel);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold" data-testid="dashboard-title">
                                Reseller Portal
                            </h1>
                            <p className="text-muted-foreground mt-1" data-testid="business-name">
                                {mockResellerData.businessName}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary" className="text-lg px-3 py-1" data-testid="tier-badge">
                                {mockResellerData.tier} Tier
                            </Badge>
                            <Badge variant="outline" data-testid="discount-badge">
                                {mockResellerData.discountPercentage}% Discount
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                        <TabsTrigger value="inventory" data-testid="tab-inventory">Inventory</TabsTrigger>
                        <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
                        <TabsTrigger value="pricing" data-testid="tab-pricing">Pricing</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Orders</p>
                                        <p className="text-2xl font-bold" data-testid="total-orders">
                                            {mockResellerData.totalOrders}
                                        </p>
                                    </div>
                                    <ShoppingCart className="h-8 w-8 text-primary" />
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                                        <p className="text-2xl font-bold" data-testid="monthly-revenue">
                                            £{mockResellerData.monthlyRevenue.toLocaleString()}
                                        </p>
                                    </div>
                                    <DollarSign className="h-8 w-8 text-green-500" />
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Credit Available</p>
                                        <p className="text-2xl font-bold" data-testid="credit-available">
                                            £{mockResellerData.creditLimit - mockResellerData.currentCredit}
                                        </p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-blue-500" />
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Stock Alerts</p>
                                        <p className="text-2xl font-bold text-red-500" data-testid="stock-alerts">
                                            {getLowStockItems().length}
                                        </p>
                                    </div>
                                    <AlertTriangle className="h-8 w-8 text-red-500" />
                                </div>
                            </Card>
                        </div>

                        {/* Credit Usage */}
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Credit Usage</h3>
                                    <span className="text-sm text-muted-foreground">
                                        £{mockResellerData.currentCredit} / £{mockResellerData.creditLimit}
                                    </span>
                                </div>
                                <Progress
                                    value={(mockResellerData.currentCredit / mockResellerData.creditLimit) * 100}
                                    className="w-full"
                                    data-testid="credit-progress"
                                />
                            </div>
                        </Card>

                        {/* Low Stock Alerts */}
                        {getLowStockItems().length > 0 && (
                            <Card className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                        <h3 className="text-lg font-semibold text-red-500">Low Stock Alerts</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {getLowStockItems().map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                                                <div>
                                                    <p className="font-medium">{item.productName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.size} • {item.color} • SKU: {item.sku}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-red-600">
                                                        {item.quantity} units remaining
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Reorder at {item.reorderLevel}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Inventory Tab */}
                    <TabsContent value="inventory" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Inventory Management</h2>
                            <Button onClick={() => console.log('Request stock')} data-testid="button-request-stock">
                                <Plus className="h-4 w-4 mr-2" />
                                Request Stock
                            </Button>
                        </div>

                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left p-4 font-semibold">Product</th>
                                            <th className="text-left p-4 font-semibold">SKU</th>
                                            <th className="text-left p-4 font-semibold">Variant</th>
                                            <th className="text-left p-4 font-semibold">Stock</th>
                                            <th className="text-left p-4 font-semibold">Wholesale Price</th>
                                            <th className="text-left p-4 font-semibold">Retail Price</th>
                                            <th className="text-left p-4 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockInventory.map((item) => (
                                            <tr key={item.id} className="border-b border-border">
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-medium" data-testid={`product-name-${item.id}`}>
                                                            {item.productName}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Last ordered: {item.lastOrdered}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm font-mono">{item.sku}</td>
                                                <td className="p-4">
                                                    <div className="text-sm">
                                                        <div>{item.size}</div>
                                                        <div className="text-muted-foreground">{item.color}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span
                                                            className={`font-medium ${item.quantity <= item.reorderLevel ? 'text-red-500' : 'text-foreground'}`}
                                                            data-testid={`stock-quantity-${item.id}`}
                                                        >
                                                            {item.quantity}
                                                        </span>
                                                        {item.quantity <= item.reorderLevel && (
                                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Reorder at {item.reorderLevel}
                                                    </p>
                                                </td>
                                                <td className="p-4 font-medium">£{item.wholesalePrice.toFixed(2)}</td>
                                                <td className="p-4 text-muted-foreground">£{item.retailPrice.toFixed(2)}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => console.log('View details', item.id)}
                                                            data-testid={`button-view-${item.id}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => console.log('Reorder', item.id)}
                                                            data-testid={`button-reorder-${item.id}`}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Orders Tab */}
                    <TabsContent value="orders" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Order History</h2>
                            <Button onClick={() => console.log('New order')} data-testid="button-new-order">
                                <Plus className="h-4 w-4 mr-2" />
                                New Order
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {mockOrders.map((order) => (
                                <Card key={order.id} className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-4">
                                                <p className="font-semibold text-lg" data-testid={`order-number-${order.id}`}>
                                                    {order.orderNumber}
                                                </p>
                                                <Badge
                                                    className={`${getStatusColor(order.status)} text-white`}
                                                    data-testid={`order-status-${order.id}`}
                                                >
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                                                <span>Order Date: {order.orderDate}</span>
                                                <span>Total: £{order.totalAmount.toFixed(2)}</span>
                                                {order.trackingNumber && (
                                                    <span>Tracking: {order.trackingNumber}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => console.log('Track order', order.id)}
                                                data-testid={`button-track-${order.id}`}
                                            >
                                                Track Order
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => console.log('View details', order.id)}
                                                data-testid={`button-details-${order.id}`}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Pricing Tab */}
                    <TabsContent value="pricing" className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Pricing Information</h2>
                            <p className="text-muted-foreground">
                                Your current tier: <span className="font-semibold text-primary">{mockResellerData.tier}</span>
                                {" "}({mockResellerData.discountPercentage}% discount on wholesale prices)
                            </p>
                        </div>

                        <Card className="p-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Tier Benefits</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="p-4 border border-border rounded-lg">
                                        <h4 className="font-medium text-yellow-600">Bronze Tier</h4>
                                        <p className="text-sm text-muted-foreground">10% discount</p>
                                        <p className="text-xs">£1,000 credit limit</p>
                                    </div>
                                    <div className="p-4 border border-border rounded-lg">
                                        <h4 className="font-medium text-gray-400">Silver Tier</h4>
                                        <p className="text-sm text-muted-foreground">15% discount</p>
                                        <p className="text-xs">£2,500 credit limit</p>
                                    </div>
                                    <div className="p-4 border border-primary rounded-lg bg-primary/5">
                                        <h4 className="font-medium text-yellow-500">Gold Tier</h4>
                                        <p className="text-sm text-muted-foreground">25% discount</p>
                                        <p className="text-xs">£5,000 credit limit</p>
                                    </div>
                                    <div className="p-4 border border-border rounded-lg">
                                        <h4 className="font-medium text-purple-600">Platinum Tier</h4>
                                        <p className="text-sm text-muted-foreground">35% discount</p>
                                        <p className="text-xs">£10,000 credit limit</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left p-4 font-semibold">Product</th>
                                            <th className="text-left p-4 font-semibold">Retail Price</th>
                                            <th className="text-left p-4 font-semibold">Wholesale Price</th>
                                            <th className="text-left p-4 font-semibold">Your Price</th>
                                            <th className="text-left p-4 font-semibold">Margin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockInventory.map((item) => {
                                            const yourPrice = item.wholesalePrice * (1 - mockResellerData.discountPercentage / 100);
                                            const margin = ((item.retailPrice - yourPrice) / item.retailPrice) * 100;

                                            return (
                                                <tr key={item.id} className="border-b border-border">
                                                    <td className="p-4">
                                                        <p className="font-medium">{item.productName}</p>
                                                        <p className="text-sm text-muted-foreground">{item.size} • {item.color}</p>
                                                    </td>
                                                    <td className="p-4">£{item.retailPrice.toFixed(2)}</td>
                                                    <td className="p-4 text-muted-foreground">£{item.wholesalePrice.toFixed(2)}</td>
                                                    <td className="p-4 font-medium text-primary">£{yourPrice.toFixed(2)}</td>
                                                    <td className="p-4 text-green-600 font-medium">
                                                        {margin.toFixed(1)}%
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}