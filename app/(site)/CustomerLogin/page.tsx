"use client";
import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User } from "lucide-react";

export default function CustomerLogin() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (!isLogin && formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            const endpoint = isLogin ? "/api/auth/customer/login" : "/api/auth/customer/register";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Authentication failed");
                return;
            }

            // Show success message
            toast({
                title: isLogin ? "Welcome back!" : "Account created!",
                description: isLogin ? "You have been logged in successfully." : "Your account has been created successfully.",
            });

            // Redirect to home page
            setLocation("/");
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error("Auth error:", err);
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
                                onClick={() => setIsLogin(!isLogin)}
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
                                onClick={() => setLocation("/reseller")}
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