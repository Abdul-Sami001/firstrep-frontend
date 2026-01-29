// app/(site)/CustomerLogin/page.tsx - Redesigned to match reference site
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLogin, useRegister, usePasswordReset } from "@/hooks/useAuth";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export default function CustomerLogin() {
    const router = useRouter();
    const { toast } = useToast();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
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

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, authLoading, router]);

    // Handle successful login - redirect
    useEffect(() => {
        if (loginMutation.isSuccess) {
            router.push("/");
        }
    }, [loginMutation.isSuccess, router]);

    // Handle successful registration
    useEffect(() => {
        if (registerMutation.isSuccess) {
            setIsLogin(true);
            setFormData({ email: "", password: "", confirmPassword: "", firstName: "", lastName: "" });
            setSuccess("Registration successful! Please check your email to verify your account.");
        }
    }, [registerMutation.isSuccess]);

    // Handle successful password reset
    useEffect(() => {
        if (passwordResetMutation.isSuccess) {
            setShowForgotPassword(false);
            setSuccess("Password reset link sent to your email!");
            setFormData({ email: "", password: "", confirmPassword: "", firstName: "", lastName: "" });
        }
    }, [passwordResetMutation.isSuccess]);

    const isLoading = loginMutation.isPending || registerMutation.isPending || passwordResetMutation.isPending;

    // Show loading state while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    // Don't render login form if already authenticated (redirect will happen)
    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#000000] flex">
            {/* Left Panel - Background Image with Content */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                {/* Background Image - You can replace this with actual image URL */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')`
                    }}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-start p-12 xl:p-16 h-full">
                    {/* Main Content - Aligned with right side form header */}
                    <div className="space-y-8 w-full">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                                Elevate Your<br />Performance
                            </h1>
                            <p className="text-lg text-gray-300 max-w-md">
                                Join thousands of athletes who trust 1stRep for premium activewear that delivers results.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                            <div>
                                <div className="text-3xl xl:text-4xl font-bold text-white mb-1">50K+</div>
                                <div className="text-sm text-gray-400">Active Members</div>
                            </div>
                            <div>
                                <div className="text-3xl xl:text-4xl font-bold text-white mb-1">100+</div>
                                <div className="text-sm text-gray-400">Products</div>
                            </div>
                            <div>
                                <div className="text-3xl xl:text-4xl font-bold text-white mb-1">4.9★</div>
                                <div className="text-sm text-gray-400">Rating</div>
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className="pt-8 border-t border-white/10">
                            <p className="text-lg text-white italic mb-2">
                                "The best activewear I've ever owned. Quality and performance unmatched."
                            </p>
                            <p className="text-sm text-gray-400">- Sarah M., Professional Athlete</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login/Register Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-start p-6 md:p-8 lg:p-12 xl:p-16 bg-[#000000]">
                <div className="w-full max-w-md space-y-8">
                    {/* Form Header */}
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-white">
                            {showForgotPassword
                                ? "Reset Password"
                                : isLogin
                                    ? "Welcome Back"
                                    : "Create Account"
                            }
                        </h2>
                        <p className="text-gray-400">
                            {showForgotPassword
                                ? "Enter your email to receive a password reset link"
                                : isLogin
                                    ? "Sign in to access your account"
                                    : "Join the 1stRep community"
                            }
                        </p>
                    </div>

                    {/* Social Login Buttons - Only show on login/register, not forgot password */}
                    {!showForgotPassword && (
                        <>
                            <div className="space-y-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 bg-white hover:bg-gray-100 text-gray-900 border-gray-300 font-medium"
                                    onClick={() => {
                                        // TODO: Implement Google OAuth
                                        toast({
                                            title: "Coming Soon",
                                            description: "Google login will be available soon.",
                                        });
                                    }}
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Continue with Google
                                </Button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-[#000000] text-gray-400">Or continue with email</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Auth Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                                <AlertDescription className="text-red-300">{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="bg-green-900/20 border-green-800">
                                <AlertDescription className="text-green-300">{success}</AlertDescription>
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
                                    className="p-0 h-auto text-sm text-gray-400 hover:text-white"
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
                                    <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            placeholder="John"
                                            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff]"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required={!isLogin}
                                            data-testid="input-first-name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff]"
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
                            <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff]"
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                                    {isLogin && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="p-0 h-auto text-xs text-gray-400 hover:text-white"
                                            onClick={() => {
                                                setShowForgotPassword(true);
                                                setError("");
                                                setSuccess("");
                                            }}
                                            data-testid="button-forgot-password"
                                        >
                                            Forgot Password?
                                        </Button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        className="pl-10 pr-10 h-12 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff]"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required={!showForgotPassword}
                                        minLength={6}
                                        data-testid="input-password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Confirm Password (Registration only) */}
                        {!isLogin && !showForgotPassword && (
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff]"
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
                            className="w-full h-12 bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-semibold uppercase text-sm shadow-lg shadow-[#00bfff]/30 hover:shadow-[#00bfff]/40 transition-all duration-300 border-0"
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

                    {/* Toggle Mode */}
                    {!showForgotPassword && (
                        <div className="text-center">
                            <p className="text-sm text-gray-400">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                <Button
                                    variant="ghost"
                                    className="p-0 h-auto text-sm text-[#00bfff] hover:text-white underline"
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

                    {/* B2B Link */}
                    {!showForgotPassword && (
                        <div className="text-center pt-4 border-t border-gray-800">
                            <p className="text-sm text-gray-400">
                                Looking to grow your business?{" "}
                                <Button
                                    variant="ghost"
                                    className="p-0 h-auto text-sm text-[#00bfff] hover:text-white underline"
                                    onClick={() => router.push("/ResellerLogin")}
                                    data-testid="link-reseller"
                                >
                                    Join Our B2B Platform
                                </Button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
