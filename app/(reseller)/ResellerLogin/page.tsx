"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Lock, Mail } from "lucide-react";

export default function ResellerLogin() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        businessName: "",
        contactPerson: "",
        phoneNumber: "",
        businessAddress: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Mock authentication - replace with real API call
            if (isLogin) {
                console.log("Login attempt:", { email: formData.email });
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Redirect to dashboard
                window.location.href = "/reseller/dashboard";
            } else {
                console.log("Registration attempt:", formData);
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                setError("");
                alert("Registration successful! Please wait for approval.");
            }
        } catch (err) {
            setError("Authentication failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <img
                        src="https://1strep.com/cdn/shop/files/1stRep_White.png?v=1706179237"
                        alt="1stRep"
                        className="h-12 w-auto mx-auto"
                    />
                    <div>
                        <h1 className="text-3xl font-bold" data-testid="auth-title">
                            {isLogin ? "Reseller Portal" : "Apply for Partnership"}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {isLogin
                                ? "Access your wholesale account"
                                : "Join our gym partnership program"
                            }
                        </p>
                    </div>
                </div>

                {/* Auth Form */}
                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    className="pl-10"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    data-testid="input-email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="pl-10"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    data-testid="input-password"
                                />
                            </div>
                        </div>

                        {/* Registration Fields */}
                        {!isLogin && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">Business Name</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="businessName"
                                            name="businessName"
                                            placeholder="Your Gym Name"
                                            className="pl-10"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                            required
                                            data-testid="input-business-name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactPerson">Contact Person</Label>
                                    <Input
                                        id="contactPerson"
                                        name="contactPerson"
                                        placeholder="Full Name"
                                        value={formData.contactPerson}
                                        onChange={handleInputChange}
                                        required
                                        data-testid="input-contact-person"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="+44 7XXX XXXXXX"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                        data-testid="input-phone"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="businessAddress">Business Address</Label>
                                    <Input
                                        id="businessAddress"
                                        name="businessAddress"
                                        placeholder="Full business address"
                                        value={formData.businessAddress}
                                        onChange={handleInputChange}
                                        required
                                        data-testid="input-address"
                                    />
                                </div>
                            </>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                            data-testid="button-submit"
                        >
                            {isLoading
                                ? "Processing..."
                                : isLogin
                                    ? "Sign In"
                                    : "Submit Application"
                            }
                        </Button>
                    </form>

                    {/* Toggle Mode */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            {isLogin ? "New to our program?" : "Already have an account?"}
                            <Button
                                variant="ghost"
                                className="ml-1 p-0"
                                onClick={() => setIsLogin(!isLogin)}
                                data-testid="button-toggle-mode"
                            >
                                {isLogin ? "Apply for Partnership" : "Sign In"}
                            </Button>
                        </p>
                    </div>
                </Card>

                {/* Info Card */}
                <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-primary">Partnership Benefits</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Wholesale pricing with tier-based discounts</li>
                            <li>• Flexible credit terms and payment options</li>
                            <li>• Real-time inventory management</li>
                            <li>• Priority customer support</li>
                            <li>• Marketing support and co-branding opportunities</li>
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    );
}