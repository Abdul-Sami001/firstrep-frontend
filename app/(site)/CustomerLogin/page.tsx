// app/(site)/CustomerLogin/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Change this import
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLogin, useRegister } from "@/hooks/useAuth";
import { Mail, Lock, User } from "lucide-react";

export default function CustomerLogin() {
    const router = useRouter(); // Change this line
    const { toast } = useToast();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: ""
    });
    const [error, setError] = useState("");

    // Use the new auth hooks
    const loginMutation = useLogin();
    const registerMutation = useRegister();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            if (!isLogin) {
                // Registration validation
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match");
                    return;
                }

                if (!formData.firstName || !formData.lastName) {
                    setError("First name and last name are required");
                    return;
                }

                // Register user
                registerMutation.mutate({
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                });
            } else {
                // Login user
                loginMutation.mutate({
                    email: formData.email,
                    password: formData.password,
                });
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error("Auth error:", err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Handle successful login/register
    if (loginMutation.isSuccess || registerMutation.isSuccess) {
        if (isLogin) {
            router.push("/"); // Change this line
        } else {
            // For registration, show email verification message
            setIsLogin(true);
            setFormData({ email: "", password: "", confirmPassword: "", firstName: "", lastName: "" });
        }
    }

    const isLoading = loginMutation.isPending || registerMutation.isPending;

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
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {isLogin
                                ? "Sign in to your 1stRep account"
                                : "Join the 1stRep community"
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

                        {/* First Name & Last Name (Registration only) */}
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            placeholder="John"
                                            className="pl-10"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required={!isLogin}
                                            data-testid="input-first-name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            className="pl-10"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required={!isLogin}
                                            data-testid="input-last-name"
                                        />
                                    </div>
                                </div>
                            </div>
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
                                    minLength={6}
                                    data-testid="input-password"
                                />
                            </div>
                        </div>

                        {/* Confirm Password (Registration only) */}
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        className="pl-10"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                        minLength={6}
                                        data-testid="input-confirm-password"
                                    />
                                </div>
                            </div>
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
                                    : "Create Account"
                            }
                        </Button>
                    </form>

                    {/* Toggle Mode */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <Button
                                variant="ghost"
                                className="ml-1 p-0 h-auto"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError("");
                                    setFormData({
                                        email: "",
                                        password: "",
                                        confirmPassword: "",
                                        firstName: "",
                                        lastName: ""
                                    });
                                }}
                                data-testid="button-toggle-mode"
                            >
                                {isLogin ? "Create Account" : "Sign In"}
                            </Button>
                        </p>
                    </div>

                    {/* Reseller Link */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-muted-foreground">
                            Looking for wholesale pricing?
                            <Button
                                variant="ghost"
                                className="ml-1 p-0 text-xs h-auto"
                                onClick={() => router.push("/reseller")} // Change this line
                                data-testid="link-reseller"
                            >
                                Apply for Reseller Account
                            </Button>
                        </p>
                    </div>
                </Card>

                {/* Benefits */}
                <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-primary">Account Benefits</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Track your orders and delivery status</li>
                            <li>• Save your favorite items for later</li>
                            <li>• Faster checkout with saved details</li>
                            <li>• Exclusive member offers and discounts</li>
                            <li>• Early access to new product launches</li>
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    );
}