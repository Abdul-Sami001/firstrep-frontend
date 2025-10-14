"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
    const { cartItems, total, subtotal, shipping, clearCart } = useCart();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    console.log('Checkout page loaded - cartItems:', cartItems);
    console.log('Checkout page loaded - total items:', cartItems.length);

    const [customerInfo, setCustomerInfo] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "UK"
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        nameOnCard: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast({
                title: "Order confirmed!",
                description: `Your order of £${total.toFixed(2)} has been successfully processed. You'll receive a confirmation email shortly.`,
            });

            // Clear cart after successful order
            clearCart();

            // Redirect to home page
            window.location.href = '/';
        } catch (error) {
            toast({
                title: "Payment failed",
                description: "There was an issue processing your payment. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center space-y-4">
                        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
                        <h1 className="text-2xl font-bold">Your cart is empty</h1>
                        <p className="text-muted-foreground">Add some items to your cart before checking out.</p>
                        <Button onClick={() => window.location.href = '/shop'}>
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold" data-testid="checkout-title">Checkout</h1>
                        <p className="text-muted-foreground">Complete your order with 1stRep</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Checkout Form */}
                        <div className="space-y-6">
                            {/* Customer Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        Delivery Information
                                    </CardTitle>
                                    <CardDescription>
                                        Where should we send your order?
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                value={customerInfo.firstName}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                                                required
                                                data-testid="input-first-name"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                value={customerInfo.lastName}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                                                required
                                                data-testid="input-last-name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={customerInfo.email}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                            required
                                            data-testid="input-email"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            value={customerInfo.address}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                            required
                                            data-testid="input-address"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={customerInfo.city}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                                                required
                                                data-testid="input-city"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="postalCode">Postal Code</Label>
                                            <Input
                                                id="postalCode"
                                                value={customerInfo.postalCode}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
                                                required
                                                data-testid="input-postal-code"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Payment Information
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        Your payment information is secure and encrypted
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="nameOnCard">Name on Card</Label>
                                        <Input
                                            id="nameOnCard"
                                            value={paymentInfo.nameOnCard}
                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })}
                                            required
                                            data-testid="input-name-on-card"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="cardNumber">Card Number</Label>
                                        <Input
                                            id="cardNumber"
                                            placeholder="1234 5678 9012 3456"
                                            value={paymentInfo.cardNumber}
                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                                            required
                                            data-testid="input-card-number"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="expiryDate">Expiry Date</Label>
                                            <Input
                                                id="expiryDate"
                                                placeholder="MM/YY"
                                                value={paymentInfo.expiryDate}
                                                onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                                                required
                                                data-testid="input-expiry-date"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="cvv">CVV</Label>
                                            <Input
                                                id="cvv"
                                                placeholder="123"
                                                value={paymentInfo.cvv}
                                                onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                                                required
                                                data-testid="input-cvv"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Order Items */}
                                    <div className="space-y-3">
                                        {cartItems.map((item) => (
                                            <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3" data-testid={`order-item-${item.id}-${item.size}-${item.color}`}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-sm">{item.name}</h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.color} • {item.size} • Qty: {item.quantity}
                                                    </p>
                                                    <p className="text-sm font-semibold">
                                                        £{(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Order Totals */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal</span>
                                            <span>£{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Shipping</span>
                                            <span>{shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold">
                                            <span>Total</span>
                                            <span data-testid="order-total">£{total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {subtotal < 75 && (
                                        <Badge variant="secondary" className="w-full justify-center">
                                            Add £{(75 - subtotal).toFixed(2)} more for free shipping
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Complete Order Button */}
                            <form onSubmit={handleSubmit}>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isProcessing}
                                    data-testid="button-complete-order"
                                >
                                    {isProcessing ? "Processing..." : `Complete Order - £${total.toFixed(2)}`}
                                </Button>
                            </form>

                            <p className="text-xs text-muted-foreground text-center">
                                By completing your order, you agree to our Terms of Service and Privacy Policy.
                                Your payment will be processed securely.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}