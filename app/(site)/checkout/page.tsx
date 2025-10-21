// app/(site)/checkout/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock, ShoppingBag, Truck, Loader2, AlertCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useUserProfile, useUpdateProfile } from "@/hooks/useAuth";
import { useCheckout } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface AddressForm {
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
}

export default function Checkout() {
    const router = useRouter();
    const { toast } = useToast();
    const { cartItems, total, subtotal, shipping } = useCart();
    const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile();
    const updateProfileMutation = useUpdateProfile();
    const checkoutMutation = useCheckout();

    const [isProcessing, setIsProcessing] = useState(false);
    const [addressForm, setAddressForm] = useState<AddressForm>({
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "UK"
    });
    const [formErrors, setFormErrors] = useState<Partial<AddressForm>>({});

    // Pre-fill address form from user profile
    useEffect(() => {
        if (profile) {
            setAddressForm({
                address: profile.address || "",
                city: profile.city || "",
                state: profile.state || "",
                zip_code: profile.zip_code || "",
                country: profile.country || "UK"
            });
        }
    }, [profile]);

    const validateForm = (): boolean => {
        const errors: Partial<AddressForm> = {};

        if (!addressForm.address.trim()) errors.address = "Address is required";
        if (!addressForm.city.trim()) errors.city = "City is required";
        if (!addressForm.state.trim()) errors.state = "State is required";
        if (!addressForm.zip_code.trim()) errors.zip_code = "Postal code is required";
        if (!addressForm.country.trim()) errors.country = "Country is required";

        // Basic postal code validation for UK
        if (addressForm.zip_code && !/^[A-Z]{1,2}[0-9]{1,2}[A-Z]?[0-9][A-Z]{2}$/i.test(addressForm.zip_code)) {
            errors.zip_code = "Please enter a valid UK postal code";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddressChange = (field: keyof AddressForm, value: string) => {
        setAddressForm(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            toast({
                title: "Please fix the errors",
                description: "All address fields are required.",
                variant: "destructive"
            });
            return;
        }

        setIsProcessing(true);

        try {
            // Update user profile with new address if changed
            const hasAddressChanged = profile && (
                profile.address !== addressForm.address ||
                profile.city !== addressForm.city ||
                profile.state !== addressForm.state ||
                profile.zip_code !== addressForm.zip_code ||
                profile.country !== addressForm.country
            );

            if (hasAddressChanged) {
                await updateProfileMutation.mutateAsync({
                    address: addressForm.address,
                    city: addressForm.city,
                    state: addressForm.state,
                    zip_code: addressForm.zip_code,
                    country: addressForm.country
                });
            }

            // Create order and Stripe checkout session
            const checkoutResponse = await checkoutMutation.mutateAsync({
                shipping_address: addressForm.address,
                city: addressForm.city,
                state: addressForm.state,
                zip_code: addressForm.zip_code,
                country: addressForm.country,
                payment_method: 'stripe'
            });

            // Redirect to Stripe Checkout
            if (checkoutResponse?.checkout_url) {
                window.location.href = checkoutResponse.checkout_url;
            } else {
                throw new Error("No checkout URL returned from server");
            }

        } catch (error: any) {
            console.error('Checkout failed:', error);
            toast({
                title: "Checkout failed",
                description: error.response?.data?.detail || error.message || "Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <div className="mobile-container tablet-container desktop-container py-8">
                    <div className="text-center space-y-4">
                        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
                        <h1 className="text-mobile-h2 md:text-tablet-h2 lg:text-desktop-h2 font-bold">Your cart is empty</h1>
                        <p className="text-sm md:text-base text-muted-foreground">Add some items to your cart before checking out.</p>
                        <Button onClick={() => router.push('/shop')}>
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="mobile-container tablet-container desktop-container py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-mobile-h2 md:text-tablet-h2 lg:text-desktop-h2 font-bold" data-testid="checkout-title">Checkout</h1>
                        <p className="text-sm md:text-base text-muted-foreground">Complete your order with 1stRep</p>
                    </div>

                    <div className="grid grid-cols-mobile md:grid-cols-tablet lg:grid-cols-desktop gap-mobile md:gap-tablet lg:gap-desktop">
                        {/* Checkout Form */}
                        <div className="space-y-6">
                            {/* Shipping Address */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        Shipping Address
                                    </CardTitle>
                                    <CardDescription>
                                        Where should we send your order?
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {profileLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                            <span>Loading your address...</span>
                                        </div>
                                    ) : profileError ? (
                                        <div className="text-center py-8">
                                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                                            <p className="text-sm text-destructive mb-2">Failed to load your address</p>
                                            <p className="text-xs text-muted-foreground">Please enter your address manually</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <Label htmlFor="address">Address</Label>
                                                <Input
                                                    id="address"
                                                    value={addressForm.address}
                                                    onChange={(e) => handleAddressChange('address', e.target.value)}
                                                    required
                                                    data-testid="input-address"
                                                    className={formErrors.address ? "border-destructive" : ""}
                                                />
                                                {formErrors.address && (
                                                    <p className="text-xs text-destructive mt-1">{formErrors.address}</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="city">City</Label>
                                                    <Input
                                                        id="city"
                                                        value={addressForm.city}
                                                        onChange={(e) => handleAddressChange('city', e.target.value)}
                                                        required
                                                        data-testid="input-city"
                                                        className={formErrors.city ? "border-destructive" : ""}
                                                    />
                                                    {formErrors.city && (
                                                        <p className="text-xs text-destructive mt-1">{formErrors.city}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="state">State/County</Label>
                                                    <Input
                                                        id="state"
                                                        value={addressForm.state}
                                                        onChange={(e) => handleAddressChange('state', e.target.value)}
                                                        required
                                                        data-testid="input-state"
                                                        className={formErrors.state ? "border-destructive" : ""}
                                                    />
                                                    {formErrors.state && (
                                                        <p className="text-xs text-destructive mt-1">{formErrors.state}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="zip_code">Postal Code</Label>
                                                    <Input
                                                        id="zip_code"
                                                        value={addressForm.zip_code}
                                                        onChange={(e) => handleAddressChange('zip_code', e.target.value)}
                                                        required
                                                        data-testid="input-postal-code"
                                                        className={formErrors.zip_code ? "border-destructive" : ""}
                                                    />
                                                    {formErrors.zip_code && (
                                                        <p className="text-xs text-destructive mt-1">{formErrors.zip_code}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="country">Country</Label>
                                                    <Input
                                                        id="country"
                                                        value={addressForm.country}
                                                        onChange={(e) => handleAddressChange('country', e.target.value)}
                                                        required
                                                        data-testid="input-country"
                                                        className={formErrors.country ? "border-destructive" : ""}
                                                    />
                                                    {formErrors.country && (
                                                        <p className="text-xs text-destructive mt-1">{formErrors.country}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Payment Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Payment
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        Secure payment powered by Stripe
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8">
                                        <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            You'll be redirected to Stripe for secure payment processing
                                        </p>
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
                                            <div key={`${item.id}-${item.variant}`} className="flex gap-3" data-testid={`order-item-${item.id}`}>
                                                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                                                    <span className="text-xs text-muted-foreground">Product</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-sm">{item.product_name}</h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.variant_name && `${item.variant_name} • `}Qty: {item.quantity}
                                                    </p>
                                                    <p className="text-sm font-semibold">
                                                        ${(item.price_at_time * item.quantity).toFixed(2)}
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
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Shipping</span>
                                            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold">
                                            <span>Total</span>
                                            <span data-testid="order-total">${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {subtotal < 75 && (
                                        <Badge variant="secondary" className="w-full justify-center">
                                            Add ${(75 - subtotal).toFixed(2)} more for free shipping
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Place Order Button */}
                            <Button
                                onClick={handlePlaceOrder}
                                className="w-full"
                                size="lg"
                                disabled={isProcessing || profileLoading}
                                data-testid="button-place-order"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Place Order - $${total.toFixed(2)}`
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                By placing your order, you agree to our Terms of Service and Privacy Policy.
                                Your payment will be processed securely by Stripe.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}