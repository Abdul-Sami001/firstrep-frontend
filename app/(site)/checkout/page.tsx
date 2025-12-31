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
import { CreditCard, Lock, ShoppingBag, Truck, Loader2, AlertCircle, MapPin, Shield, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useUserProfile, useUpdateProfile } from "@/hooks/useAuth";
import { useCheckout } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";

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

    // Calculate VAT (20% UK standard rate)
    const vatRate = 0.20;
    const vat = subtotal * vatRate;
    const totalWithVAT = subtotal + vat + shipping;

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
            <div className="min-h-screen bg-[#000000]">
                <div className="mobile-container tablet-container desktop-container py-12 md:py-16 lg:py-20">
                    <div className="text-center space-y-6 max-w-md mx-auto">
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-gray-900 border border-gray-800">
                                <ShoppingBag className="h-12 w-12 text-gray-400" />
                            </div>
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Your cart is empty</h1>
                        <p className="text-sm md:text-base text-gray-400">Add some items to your cart before checking out.</p>
                        <Link href="/shop-clean">
                            <Button 
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white hover:text-black"
                            >
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000]">
            <div className="mobile-container tablet-container desktop-container py-8 md:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 md:mb-12">
                        <Link href="/shop-clean">
                            <Button 
                                variant="ghost" 
                                className="mb-6 text-gray-400 hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Shopping
                            </Button>
                        </Link>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2" data-testid="checkout-title">
                            Checkout
                        </h1>
                        <p className="text-sm md:text-base text-gray-400">Complete your order with 1stRep</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Checkout Form - Left Column (2/3) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <Card className="bg-gray-900/30 border-gray-800">
                                <CardHeader className="border-b border-gray-800">
                                    <CardTitle className="flex items-center gap-3 text-white">
                                        <div className="p-2 rounded-lg bg-[#00bfff]/10 border border-[#00bfff]/20">
                                            <MapPin className="h-5 w-5 text-[#00bfff]" />
                                        </div>
                                        Shipping Address
                                    </CardTitle>
                                    <CardDescription className="text-gray-400 mt-2">
                                        Where should we send your order?
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    {profileLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="h-6 w-6 animate-spin mr-2 text-[#00bfff]" />
                                            <span className="text-gray-400">Loading your address...</span>
                                        </div>
                                    ) : profileError ? (
                                        <div className="text-center py-8 p-4 rounded-lg bg-red-900/20 border border-red-800/50">
                                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                                            <p className="text-sm text-red-400 mb-2">Failed to load your address</p>
                                            <p className="text-xs text-gray-400">Please enter your address manually</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <Label htmlFor="address" className="text-gray-300 mb-2">Street Address</Label>
                                                <Input
                                                    id="address"
                                                    value={addressForm.address}
                                                    onChange={(e) => handleAddressChange('address', e.target.value)}
                                                    required
                                                    data-testid="input-address"
                                                    className={`bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] ${formErrors.address ? "border-red-500" : ""}`}
                                                    placeholder="123 Main Street"
                                                />
                                                {formErrors.address && (
                                                    <p className="text-xs text-red-400 mt-1">{formErrors.address}</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="city" className="text-gray-300 mb-2">City</Label>
                                                    <Input
                                                        id="city"
                                                        value={addressForm.city}
                                                        onChange={(e) => handleAddressChange('city', e.target.value)}
                                                        required
                                                        data-testid="input-city"
                                                        className={`bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] ${formErrors.city ? "border-red-500" : ""}`}
                                                        placeholder="London"
                                                    />
                                                    {formErrors.city && (
                                                        <p className="text-xs text-red-400 mt-1">{formErrors.city}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="state" className="text-gray-300 mb-2">State/County</Label>
                                                    <Input
                                                        id="state"
                                                        value={addressForm.state}
                                                        onChange={(e) => handleAddressChange('state', e.target.value)}
                                                        required
                                                        data-testid="input-state"
                                                        className={`bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] ${formErrors.state ? "border-red-500" : ""}`}
                                                        placeholder="Greater London"
                                                    />
                                                    {formErrors.state && (
                                                        <p className="text-xs text-red-400 mt-1">{formErrors.state}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="zip_code" className="text-gray-300 mb-2">Postal Code</Label>
                                                    <Input
                                                        id="zip_code"
                                                        value={addressForm.zip_code}
                                                        onChange={(e) => handleAddressChange('zip_code', e.target.value)}
                                                        required
                                                        data-testid="input-postal-code"
                                                        className={`bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] ${formErrors.zip_code ? "border-red-500" : ""}`}
                                                        placeholder="SW1A 1AA"
                                                    />
                                                    {formErrors.zip_code && (
                                                        <p className="text-xs text-red-400 mt-1">{formErrors.zip_code}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="country" className="text-gray-300 mb-2">Country</Label>
                                                    <Input
                                                        id="country"
                                                        value={addressForm.country}
                                                        onChange={(e) => handleAddressChange('country', e.target.value)}
                                                        required
                                                        data-testid="input-country"
                                                        className={`bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] ${formErrors.country ? "border-red-500" : ""}`}
                                                        placeholder="United Kingdom"
                                                    />
                                                    {formErrors.country && (
                                                        <p className="text-xs text-red-400 mt-1">{formErrors.country}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Payment Information */}
                            <Card className="bg-gray-900/30 border-gray-800">
                                <CardHeader className="border-b border-gray-800">
                                    <CardTitle className="flex items-center gap-3 text-white">
                                        <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                                            <Shield className="h-5 w-5 text-green-400" />
                                        </div>
                                        Payment
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 text-gray-400 mt-2">
                                        <Lock className="h-4 w-4" />
                                        Secure payment powered by Stripe
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="text-center py-8">
                                        <div className="flex justify-center mb-4">
                                            <div className="p-4 rounded-full bg-gray-800 border border-gray-700">
                                                <CreditCard className="h-10 w-10 text-[#00bfff]" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            You'll be redirected to Stripe for secure payment processing
                                        </p>
                                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                            <Lock className="h-3 w-3" />
                                            <span>256-bit SSL encryption</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary - Right Column (1/3) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                <Card className="bg-gray-900/30 border-gray-800">
                                    <CardHeader className="border-b border-gray-800">
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <ShoppingBag className="h-5 w-5 text-[#00bfff]" />
                                            Order Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-6">
                                        {/* Order Items */}
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
                                            {cartItems.map((item) => (
                                                <div 
                                                    key={`${item.id}-${item.variant}`} 
                                                    className="flex gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-800"
                                                    data-testid={`order-item-${item.id}`}
                                                >
                                                    {/* Product Image - Using new API field (product_image) or mapped image */}
                                                    {(item.product_image || (item as any).image) ? (
                                                        <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-700">
                                                            <Image
                                                                src={(item.product_image || (item as any).image) as string}
                                                                alt={item.product_name}
                                                                width={64}
                                                                height={64}
                                                                className="w-full h-full object-cover"
                                                                sizes="64px"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-800 rounded-md flex items-center justify-center border border-gray-700 flex-shrink-0">
                                                            <span className="text-xs text-gray-500">No image</span>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-sm text-white mb-1 line-clamp-2">{item.product_name}</h3>
                                                        <div className="flex flex-wrap gap-2 mb-1">
                                                            {/* Size - Using new API field with fallback */}
                                                            {(item.size || item.variant_name) && (
                                                                <span className="text-xs text-gray-400">
                                                                    Size: <span className="text-gray-300 font-medium">{item.size || item.variant_name}</span>
                                                                </span>
                                                            )}
                                                            {/* Color - Using new API field */}
                                                            {item.color && (
                                                                <span className="text-xs text-gray-400">
                                                                    Color: <span className="text-gray-300 font-medium">{item.color}</span>
                                                                </span>
                                                            )}
                                                            {/* Fallback to variant_name if size/color not available */}
                                                            {!item.size && !item.color && item.variant_name && (
                                                                <span className="text-xs text-gray-400">
                                                                    <span className="text-gray-300 font-medium">{item.variant_name}</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 mb-1">
                                                            Qty: {item.quantity}
                                                        </p>
                                                        <p className="text-sm font-bold text-white">
                                                            ${(Number(item.price_at_time) * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <Separator className="bg-gray-800" />

                                        {/* Order Totals */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Subtotal</span>
                                                <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">VAT (20%)</span>
                                                <span className="text-white font-medium">${vat.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Shipping</span>
                                                <span className="text-white font-medium">
                                                    {shipping === 0 ? (
                                                        <span className="text-green-400">FREE</span>
                                                    ) : (
                                                        `$${shipping.toFixed(2)}`
                                                    )}
                                                </span>
                                            </div>
                                            <Separator className="bg-gray-800" />
                                            <div className="flex justify-between font-bold text-lg pt-1">
                                                <span className="text-white">Total</span>
                                                <span className="text-white" data-testid="order-total">${totalWithVAT.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {subtotal < 75 && (
                                            <div className="p-3 rounded-lg bg-[#00bfff]/10 border border-[#00bfff]/20">
                                                <p className="text-xs text-[#00bfff] text-center">
                                                    Add <span className="font-semibold">${(75 - subtotal).toFixed(2)}</span> more for free shipping
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Place Order Button */}
                                <Button
                                    onClick={handlePlaceOrder}
                                    className="w-full bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-semibold uppercase text-sm shadow-lg shadow-[#00bfff]/30 hover:shadow-[#00bfff]/40 transition-all duration-300 border-0 h-14"
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
                                    `Place Order - $${totalWithVAT.toFixed(2)}`
                                )}
                                </Button>

                                <p className="text-xs text-gray-500 text-center leading-relaxed">
                                    By placing your order, you agree to our{" "}
                                    <Link href="/terms-of-service" className="text-[#00bfff] hover:underline">Terms of Service</Link>
                                    {" "}and{" "}
                                    <Link href="/privacy-policy" className="text-[#00bfff] hover:underline">Privacy Policy</Link>.
                                    Your payment will be processed securely by Stripe.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}