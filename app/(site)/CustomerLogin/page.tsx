// app/(site)/CustomerLogin/page.tsx - Complete with Forgot Password
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLogin, useRegister, usePasswordReset } from "@/hooks/useAuth";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export default function CustomerLogin() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Use the new auth hooks
    const loginMutation = useLogin();
    const registerMutation = useRegister();
    const passwordResetMutation = usePasswordReset();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            if (showForgotPassword) {
                // Handle forgot password
                if (!formData.email) {
                    setError("Please enter your email address");
                    return;
                }

                passwordResetMutation.mutate({ email: formData.email });
                return;
            }

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

    // Handle successful operations
    if (loginMutation.isSuccess) {
        router.push("/");
    }

    if (registerMutation.isSuccess) {
        setIsLogin(true);
        setFormData({ email: "", password: "", confirmPassword: "", firstName: "", lastName: "" });
        setSuccess("Registration successful! Please check your email to verify your account.");
    }

    if (passwordResetMutation.isSuccess) {
        setShowForgotPassword(false);
        setSuccess("Password reset link sent to your email!");
        setFormData({ email: "", password: "", confirmPassword: "", firstName: "", lastName: "" });
    }

    const isLoading = loginMutation.isPending || registerMutation.isPending || passwordResetMutation.isPending;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="text-3xl font-bold tracking-tight" data-testid="auth-title">
                        1strep
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold" data-testid="auth-title">
                            {showForgotPassword
                                ? "Reset Password"
                                : isLogin
                                    ? "Welcome Back"
                                    : "Create Account"
                            }
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {showForgotPassword
                                ? "Enter your email to receive a password reset link"
                                : isLogin
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

                        {success && (
                            <Alert className="border-green-200 bg-green-50 text-green-800">
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        {/* Back to Login Button (Forgot Password) */}
                        {showForgotPassword && (
                            <div className="mb-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setError("");
                                        setSuccess("");
                                    }}
                                    className="p-0 h-auto text-sm"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Login
                                </Button>
                            </div>
                        )}

                        {/* First Name & Last Name (Registration only) */}
                        {!isLogin && !showForgotPassword && (
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

                        {/* Password (Login and Registration only) */}
                        {!showForgotPassword && (
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        className="pl-10 pr-10"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required={!showForgotPassword}
                                        minLength={6}
                                        data-testid="input-password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 h-auto p-1 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Confirm Password (Registration only) */}
                        {!isLogin && !showForgotPassword && (
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
                            className="w-full h-12 text-base font-semibold"
                            disabled={isLoading}
                            data-testid="button-submit"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : showForgotPassword ? (
                                "Send Reset Link"
                            ) : isLogin ? (
                                "Sign In"
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>

                    {/* Forgot Password Link (Login only) */}
                    {isLogin && !showForgotPassword && (
                        <div className="mt-4 text-center">
                            <Button
                                variant="ghost"
                                className="p-0 h-auto text-sm text-muted-foreground"
                                onClick={() => {
                                    setShowForgotPassword(true);
                                    setError("");
                                    setSuccess("");
                                }}
                                data-testid="button-forgot-password"
                            >
                                Forgot your password?
                            </Button>
                        </div>
                    )}

                    {/* Toggle Mode */}
                    {!showForgotPassword && (
                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <Button
                                    variant="ghost"
                                    className="ml-1 p-0 h-auto"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError("");
                                        setSuccess("");
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
                    )}

                    {/* Reseller Link */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-muted-foreground">
                            Looking for wholesale pricing?
                            <Button
                                variant="ghost"
                                className="ml-1 p-0 text-xs h-auto"
                                onClick={() => router.push("/reseller")}
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