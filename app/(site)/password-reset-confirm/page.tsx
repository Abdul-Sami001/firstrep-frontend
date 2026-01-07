// app/(site)/password-reset-confirm/page.tsx - Password Reset Confirmation Page
"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { usePasswordResetConfirm } from "@/hooks/useAuth";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function PasswordResetConfirmContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const passwordResetConfirmMutation = usePasswordResetConfirm();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isValidating, setIsValidating] = useState(true);
    const [isValid, setIsValid] = useState(false);

    // Extract uid and token from URL
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    // Validate that uid and token are present
    useEffect(() => {
        if (!uid || !token) {
            setIsValid(false);
            setIsValidating(false);
            setError("Invalid or missing reset link parameters. Please request a new password reset.");
        } else {
            setIsValid(true);
            setIsValidating(false);
        }
    }, [uid, token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        // Clear error when user starts typing
        if (error) {
            setError("");
        }
    };

    const validateForm = (): boolean => {
        if (!formData.password) {
            setError("Password is required");
            return false;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        if (!uid || !token) {
            setError("Invalid reset link. Please request a new password reset.");
            return;
        }

        try {
            passwordResetConfirmMutation.mutate(
                {
                    uid: uid,
                    token: token,
                    password: formData.password,
                },
                {
                    onSuccess: () => {
                        // Redirect to login page after successful reset
                        setTimeout(() => {
                            router.push("/CustomerLogin");
                        }, 2000);
                    },
                    onError: (err: any) => {
                        setError(err.response?.data?.detail || "Failed to reset password. Please try again.");
                    },
                }
            );
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error("Password reset error:", err);
        }
    };

    // Show loading state while validating URL parameters
    if (isValidating) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
                    <p className="text-gray-400">Validating reset link...</p>
                </div>
            </div>
        );
    }

    // Show error if invalid link
    if (!isValid) {
        return (
            <div className="min-h-screen bg-[#000000] flex">
                {/* Left Panel - Background Image with Content */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')`
                        }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="relative z-10 flex flex-col justify-start p-12 xl:p-16 h-full">
                        <div className="space-y-8 w-full">
                            <div>
                                <h1 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                                    Invalid Reset Link
                                </h1>
                                <p className="text-lg text-gray-300 max-w-md">
                                    The password reset link is invalid or has expired.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 md:p-8 lg:p-12 xl:p-16 bg-[#000000]">
                    <div className="w-full max-w-md mx-auto space-y-8">
                        <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-red-300">
                                {error || "Invalid or missing reset link parameters. Please request a new password reset."}
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                            <Link href="/CustomerLogin">
                                <Button className="w-full h-12 bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-semibold">
                                    Back to Login
                                </Button>
                            </Link>
                            <Link href="/CustomerLogin">
                                <Button variant="outline" className="w-full h-12 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                                    Request New Reset Link
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show success state if password was reset
    if (passwordResetConfirmMutation.isSuccess) {
        return (
            <div className="min-h-screen bg-[#000000] flex">
                {/* Left Panel */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')`
                        }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="relative z-10 flex flex-col justify-start p-12 xl:p-16 h-full">
                        <div className="space-y-8 w-full">
                            <div>
                                <h1 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                                    Password Reset<br />Successful
                                </h1>
                                <p className="text-lg text-gray-300 max-w-md">
                                    Your password has been reset successfully. You can now log in with your new password.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 md:p-8 lg:p-12 xl:p-16 bg-[#000000]">
                    <div className="w-full max-w-md mx-auto space-y-8">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Success!</h2>
                            <p className="text-gray-400">
                                Your password has been reset successfully. Redirecting to login...
                            </p>
                        </div>

                        <Link href="/CustomerLogin">
                            <Button className="w-full h-12 bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-semibold">
                                Go to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Main form view
    return (
        <div className="min-h-screen bg-[#000000] flex">
            {/* Left Panel - Background Image with Content */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')`
                    }}
                />
                <div className="absolute inset-0 bg-black/60" />
                
                <div className="relative z-10 flex flex-col justify-start p-12 xl:p-16 h-full">
                    <div className="space-y-8 w-full">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                                Reset Your<br />Password
                            </h1>
                            <p className="text-lg text-gray-300 max-w-md">
                                Enter your new password below. Make sure it's strong and secure.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                            <div>
                                <div className="text-3xl xl:text-4xl font-bold text-white mb-1">8+</div>
                                <div className="text-sm text-gray-400">Characters</div>
                            </div>
                            <div>
                                <div className="text-3xl xl:text-4xl font-bold text-white mb-1">Secure</div>
                                <div className="text-sm text-gray-400">Password</div>
                            </div>
                            <div>
                                <div className="text-3xl xl:text-4xl font-bold text-white mb-1">Safe</div>
                                <div className="text-sm text-gray-400">Account</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Reset Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-start p-6 md:p-8 lg:p-12 xl:p-16 bg-[#000000] overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo on Mobile */}
                    <Link href="/" className="lg:hidden mb-6">
                        <Image
                            src="/logo.png"
                            alt="1stRep"
                            width={120}
                            height={40}
                            className="h-8 w-auto object-contain"
                        />
                    </Link>

                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-white">
                            New Password
                        </h2>
                        <p className="text-gray-400">
                            Enter your new password to complete the reset process
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-red-300">{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-300">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your new password"
                                    className="pl-10 pr-10 h-12 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff]"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    minLength={8}
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
                            <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your new password"
                                    className="pl-10 pr-10 h-12 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff]"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-semibold uppercase text-sm shadow-lg shadow-[#00bfff]/30 hover:shadow-[#00bfff]/40 transition-all duration-300 border-0"
                            disabled={passwordResetConfirmMutation.isPending}
                        >
                            {passwordResetConfirmMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Resetting Password...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>

                    {/* Back to Login */}
                    <div className="text-center">
                        <Link href="/CustomerLogin">
                            <Button
                                variant="ghost"
                                className="p-0 h-auto text-sm text-gray-400 hover:text-white"
                            >
                                ← Back to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PasswordResetConfirmPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#000000] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
            }
        >
            <PasswordResetConfirmContent />
        </Suspense>
    );
}

