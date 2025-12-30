// app/(reseller)/ResellerLogin/page.tsx - Redesigned to match reference site with toggle system
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Building2, User, Phone, MapPin, Home, Zap, Check } from "lucide-react";

type RoleType = 'reseller' | 'wholesaler' | null;
type ViewType = 'login' | 'role-selection' | 'application';

export default function ResellerLogin() {
    const router = useRouter();
    const { toast } = useToast();
    const [currentView, setCurrentView] = useState<ViewType>('login'); // Default to login
    const [selectedRole, setSelectedRole] = useState<RoleType>(null);
    const [showPassword, setShowPassword] = useState(false);
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

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // TODO: Implement actual reseller login API
            console.log("Reseller login attempt:", { email: formData.email });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Store reseller token (mock for now - replace with actual API response)
            if (typeof window !== 'undefined') {
                localStorage.setItem('reseller_token', 'mock_reseller_token_' + Date.now());
            }
            
            // Redirect to dashboard
            router.push("/ResellerDashboard");
        } catch (err) {
            setError("Authentication failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplicationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // TODO: Implement actual reseller registration API
            console.log(`${selectedRole} registration attempt:`, formData);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            toast({
                title: "Application Submitted",
                description: "Your application has been submitted successfully. We'll get back to you soon.",
            });
            
            // Reset form
            setFormData({
                email: "",
                password: "",
                businessName: "",
                contactPerson: "",
                phoneNumber: "",
                businessAddress: ""
            });
            setSelectedRole(null);
            setCurrentView('login');
        } catch (err) {
            setError("Failed to submit application. Please try again.");
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

    const handleRoleSelect = (role: 'reseller' | 'wholesaler') => {
        setSelectedRole(role);
        setCurrentView('application');
        setError("");
    };

    const handleBackToRoles = () => {
        setSelectedRole(null);
        setCurrentView('role-selection');
        setError("");
        setFormData({
            email: "",
            password: "",
            businessName: "",
            contactPerson: "",
            phoneNumber: "",
            businessAddress: ""
        });
    };

    const handleShowLogin = () => {
        setCurrentView('login');
        setError("");
    };

    const handleShowRoleSelection = () => {
        setCurrentView('role-selection');
        setError("");
    };

    return (
        <div className="min-h-screen bg-[#000000] flex">
            {/* Left Panel - Background Image with Content */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background Image with Animation */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-zoom-in"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084')`
                    }}
                />
                {/* Animated Gradient Overlay */}
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-black/80 animate-gradient-shift"
                />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-start p-12 xl:p-16 h-full">
                    {/* Logo */}
                    <Link href="/" className="mb-8">
                        <Image
                            src="/logo.png"
                            alt="1stRep"
                            width={120}
                            height={40}
                            className="h-8 w-auto object-contain"
                        />
                    </Link>

                    {/* Main Content */}
                    <div className="space-y-8 w-full flex-1">
                        <div>
                            <div className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-md mb-4">
                                <span className="text-xs font-semibold text-white uppercase tracking-wider">B2B Platform</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                Grow Your Business<br />With 1stRep
                            </h1>
                            <p className="text-lg text-gray-200 max-w-md leading-relaxed">
                                Join as a Reseller or Vendor. Resellers sell our products at wholesale pricing. Vendors add their own products to our marketplace.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">30%+</div>
                                <div className="text-sm text-gray-300">Avg. Margins</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">500+</div>
                                <div className="text-sm text-gray-300">Active Partners</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">48hr</div>
                                <div className="text-sm text-gray-300">Order Processing</div>
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className="pt-8 border-t border-white/20">
                            <p className="text-white italic text-lg leading-relaxed">
                                "1stRep's platform transformed how we do business. Great margins and incredible support."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Role Selection or Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-start p-6 md:p-8 lg:p-12 xl:p-16 bg-[#000000] overflow-y-auto">
                <div className="w-full max-w-2xl space-y-8">
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

                    {currentView === 'login' ? (
                        /* Login Form View */
                        <>
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                                    Reseller Portal
                                </h2>
                                <p className="text-gray-400 text-lg">
                                    Sign in to access your wholesale account
                                </p>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="space-y-5">
                                {error && (
                                    <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                                        <AlertDescription className="text-red-300">{error}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Business Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="loginEmail" className="text-gray-300">Business Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="loginEmail"
                                            name="email"
                                            type="email"
                                            placeholder="admin@1strep.com"
                                            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] h-12"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="loginPassword" className="text-gray-300">Password</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="p-0 h-auto text-xs text-gray-400 hover:text-white"
                                            onClick={() => {
                                                // TODO: Implement forgot password
                                            }}
                                        >
                                            Forgot Password?
                                        </Button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                                        <Input
                                            id="loginPassword"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] h-12"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-semibold uppercase text-sm md:text-base shadow-lg shadow-[#00bfff]/30 hover:shadow-[#00bfff]/40 transition-all duration-300 border-0"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Sign In to Portal"
                                    )}
                                </Button>
                            </form>

                            {/* Links */}
                            <div className="space-y-4 pt-4 border-t border-gray-800">
                                <div className="text-center">
                                    <p className="text-sm text-gray-400">
                                        New to 1stRep?{" "}
                                        <button
                                            onClick={handleShowRoleSelection}
                                            className="text-[#00bfff] hover:text-white underline font-medium"
                                        >
                                            Apply as Reseller or Vendor
                                        </button>
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-400">
                                        Looking to shop?{" "}
                                        <Link
                                            href="/CustomerLogin"
                                            className="text-[#00bfff] hover:text-white underline font-medium"
                                        >
                                            Customer Login
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : currentView === 'role-selection' ? (
                        /* Role Selection View */
                        <>
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                                    Choose Your Role
                                </h2>
                                <p className="text-gray-400 text-lg">
                                    Select how you want to grow your business
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Reseller Card */}
                                <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/50 hover:border-[#00bfff]/50 transition-all duration-300">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-3 bg-white/10 rounded-lg">
                                            <Home className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2">Apply as Reseller</h3>
                                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                                Sell the full 1stRep range of clothing and accessories and earn commission for each sale.
                                            </p>
                                            <ul className="space-y-2 mb-4">
                                                <li className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Check className="h-4 w-4 text-[#00bfff] flex-shrink-0" />
                                                    <span>Earn between 10-20% commission rate</span>
                                                </li>
                                                <li className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Check className="h-4 w-4 text-[#00bfff] flex-shrink-0" />
                                                    <span>Flexible payment term</span>
                                                </li>
                                                <li className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Check className="h-4 w-4 text-[#00bfff] flex-shrink-0" />
                                                    <span>Dedicated account manager</span>
                                                </li>
                                                <li className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Check className="h-4 w-4 text-[#00bfff] flex-shrink-0" />
                                                    <span>Sell your own items via the POS</span>
                                                </li>
                                            </ul>
                                            <Button
                                                onClick={() => handleRoleSelect('reseller')}
                                                className="w-full border border-white/20 bg-transparent hover:bg-white/10 text-white font-semibold"
                                            >
                                                Apply as Reseller
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Wholesaler Card */}
                                <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/50 hover:border-[#00bfff]/50 transition-all duration-300">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-3 bg-white/10 rounded-lg">
                                            <Zap className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2">Apply as Wholesaler</h3>
                                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                                Sell our premium athleisure range via wholesale pricing, with flexible credit terms and tiered discounts.
                                            </p>
                                            <ul className="space-y-2 mb-4">
                                                <li className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Check className="h-4 w-4 text-[#00bfff] flex-shrink-0" />
                                                    <span>Up to 35% wholesale discount</span>
                                                </li>
                                                <li className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Check className="h-4 w-4 text-[#00bfff] flex-shrink-0" />
                                                    <span>Tiered wholesale structure</span>
                                                </li>
                                                <li className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Check className="h-4 w-4 text-[#00bfff] flex-shrink-0" />
                                                    <span>Dedicated account manager</span>
                                                </li>
                                            </ul>
                                            <Button
                                                onClick={() => handleRoleSelect('wholesaler')}
                                                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold"
                                            >
                                                Apply as Wholesaler
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sign In Link */}
                            <div className="text-center pt-4 border-t border-gray-800">
                                <p className="text-sm text-gray-400">
                                    Already have an account?{" "}
                                    <button
                                        onClick={handleShowLogin}
                                        className="text-[#00bfff] hover:text-white underline font-medium"
                                    >
                                        Sign In
                                    </button>
                                </p>
                            </div>

                            {/* Customer Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-400">
                                    Not a business customer?{" "}
                                    <Link
                                        href="/CustomerLogin"
                                        className="text-[#00bfff] hover:text-white underline font-medium"
                                    >
                                        Shop as Individual Customer
                                    </Link>
                                </p>
                            </div>
                        </>
                    ) : (
                        /* Application Form View */
                        <>
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                                    Complete your profile
                                </h2>
                            </div>

                            <form onSubmit={handleApplicationSubmit} className="space-y-5">
                                {error && (
                                    <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                                        <AlertDescription className="text-red-300">{error}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Business Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-300">Business Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="admin@1strep.com"
                                            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] h-12"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] h-12"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Business Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="businessName" className="text-gray-300">Business Name</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="businessName"
                                            name="businessName"
                                            type="text"
                                            placeholder="Your Business Name"
                                            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] h-12"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Contact Person */}
                                <div className="space-y-2">
                                    <Label htmlFor="contactPerson" className="text-gray-300">Contact Person</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="contactPerson"
                                            name="contactPerson"
                                            type="text"
                                            placeholder="Full Name"
                                            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] h-12"
                                            value={formData.contactPerson}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="tel"
                                            placeholder="+44 7XXX XXXXXX"
                                            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] h-12"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Business Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="businessAddress" className="text-gray-300">Business Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="businessAddress"
                                            name="businessAddress"
                                            type="text"
                                            placeholder="Full business address"
                                            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] h-12"
                                            value={formData.businessAddress}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-semibold uppercase text-sm md:text-base shadow-lg shadow-[#00bfff]/30 hover:shadow-[#00bfff]/40 transition-all duration-300 border-0"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Submit Application"
                                    )}
                                </Button>
                            </form>

                            {/* Benefits Section */}
                            <div className="pt-6 border-t border-gray-800">
                                <h3 className="text-lg font-semibold text-white mb-4">What You Get:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-[#00bfff] flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-semibold text-white">Wholesale Pricing</div>
                                            <div className="text-sm text-gray-400">Tier-based volume discounts</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-[#00bfff] flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-semibold text-white">Flexible Terms</div>
                                            <div className="text-sm text-gray-400">Credit options & payment plans</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-[#00bfff] flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-semibold text-white">Real-Time Inventory</div>
                                            <div className="text-sm text-gray-400">Live stock management</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-[#00bfff] flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-semibold text-white">Priority Support</div>
                                            <div className="text-sm text-gray-400">Dedicated account manager</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Back Button */}
                            <div className="pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleBackToRoles}
                                    className="w-full text-gray-400 hover:text-white hover:bg-gray-900"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Change Role Selection
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}
