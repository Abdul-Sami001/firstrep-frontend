// app/(reseller)/ResellerLogin/page.tsx - Redesigned to match reference site with toggle system
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLogin } from "@/hooks/useAuth";
import { useAuth } from "@/contexts/AuthContext";
import { useSubmitResellerApplication, useResellerApplication } from "@/hooks/useResellers";
import { ResellerApplication } from "@/lib/api/resellers";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, Building2, User, Phone, MapPin, Home, Zap, Check, Globe, FileText, Users } from "lucide-react";

type RoleType = 'reseller' | 'wholesaler' | null;
type ViewType = 'login' | 'role-selection' | 'application';

export default function ResellerLogin() {
    const router = useRouter();
    const { toast } = useToast();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const loginMutation = useLogin();
    const submitApplicationMutation = useSubmitResellerApplication();
    const { data: existingApplication, isLoading: applicationLoading } = useResellerApplication(isAuthenticated);
    
    // Type guard for application - check if it's a valid ResellerApplication object
    const application: ResellerApplication | undefined = existingApplication;
    const hasApplication = application && application.id;
    
    const [currentView, setCurrentView] = useState<ViewType>('login'); // Default to login
    const [selectedRole, setSelectedRole] = useState<RoleType>(null);
    const [showPassword, setShowPassword] = useState(false);
    
    // Login form data
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    
    // Application form data
    const [applicationData, setApplicationData] = useState({
        company_name: "",
        website_url: "",
        app_url: "",
        description: "",
        location_description: "",
        expected_traffic: ""
    });
    
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Check if user is authenticated and has existing application
    useEffect(() => {
        if (!authLoading && isAuthenticated && !applicationLoading) {
            if (hasApplication) {
                // User has an application, show status
                setCurrentView('application');
            } else if (currentView === 'login') {
                // User is authenticated but no application, show role selection
                setCurrentView('role-selection');
            }
        }
    }, [isAuthenticated, authLoading, hasApplication, applicationLoading, currentView]);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        loginMutation.mutate(
            { email: loginData.email, password: loginData.password },
            {
                onSuccess: () => {
                    // After successful login, check if user has application or show role selection
                    setCurrentView('role-selection');
                },
                onError: () => {
                    setError("Authentication failed. Please try again.");
                },
                onSettled: () => setIsLoading(false),
            }
        );
    };

    const handleApplicationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isAuthenticated) {
            setError("Please log in first to submit an application.");
            setCurrentView('login');
            return;
        }

        // Prepare application payload (matching backend API)
        const payload = {
            company_name: applicationData.company_name,
            website_url: applicationData.website_url || undefined,
            app_url: applicationData.app_url || undefined,
            description: applicationData.description || undefined,
            location_description: applicationData.location_description || undefined,
            expected_traffic: applicationData.expected_traffic || undefined,
        };

        submitApplicationMutation.mutate(payload, {
            onSuccess: () => {
                // Reset form
                setApplicationData({
                    company_name: "",
                    website_url: "",
                    app_url: "",
                    description: "",
                    location_description: "",
                    expected_traffic: ""
                });
                setSelectedRole(null);
            },
            onError: (err: any) => {
                const errorMessage = err?.response?.data?.detail || 
                                   err?.response?.data?.message || 
                                   err?.response?.data?.non_field_errors?.[0] ||
                                   "Failed to submit application. Please try again.";
                setError(errorMessage);
            },
        });
    };

    const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleApplicationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setApplicationData(prev => ({
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
        setApplicationData({
            company_name: "",
            website_url: "",
            app_url: "",
            description: "",
            location_description: "",
            expected_traffic: ""
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
                                            value={loginData.email}
                                            onChange={handleLoginInputChange}
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
                                            value={loginData.password}
                                            onChange={handleLoginInputChange}
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
                            {hasApplication && application ? (
                                /* Application Status View */
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                                            Application Status
                                        </h2>
                                        <p className="text-gray-400 text-lg">
                                            Your reseller application has been submitted
                                        </p>
                                    </div>

                                    <Alert className={`${
                                        application.status === 'approved' ? 'bg-green-900/20 border-green-800' :
                                        application.status === 'rejected' ? 'bg-red-900/20 border-red-800' :
                                        'bg-yellow-900/20 border-yellow-800'
                                    }`}>
                                        <AlertDescription className="text-white">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">Status:</span>
                                                    <span className="uppercase">{application.status.replace('_', ' ')}</span>
                                                </div>
                                                {application.status === 'rejected' && application.review_notes && (
                                                    <div className="mt-2 pt-2 border-t border-red-800">
                                                        <span className="font-semibold">Reason:</span>
                                                        <p className="text-gray-300">{application.review_notes}</p>
                                                    </div>
                                                )}
                                                {application.status === 'approved' && (
                                                    <div className="mt-2">
                                                        <p className="text-green-300">Congratulations! Your application has been approved. You can now access the reseller dashboard.</p>
                                                        <Button
                                                            onClick={() => router.push('/ResellerDashboard')}
                                                            className="mt-4 bg-green-600 hover:bg-green-700"
                                                        >
                                                            Go to Dashboard
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </AlertDescription>
                                    </Alert>

                                    <div className="bg-gray-900/50 rounded-lg p-6 space-y-4 border border-gray-800">
                                        <h3 className="text-lg font-semibold text-white">Application Details</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Company Name:</span>
                                                <span className="text-white">{application.company_name}</span>
                                            </div>
                                            {application.website_url && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Website:</span>
                                                    <span className="text-white">{application.website_url}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Submitted:</span>
                                                <span className="text-white">
                                                    {new Date(application.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* New Application Form */
                                <>
                                    {!isAuthenticated && (
                                        <Alert className="bg-yellow-900/20 border-yellow-800 mb-6">
                                            <AlertDescription className="text-yellow-300">
                                                Please log in first to submit an application. If you don't have an account, please register first.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="space-y-2">
                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                                            Complete your profile
                                        </h2>
                                        <p className="text-gray-400 text-lg">
                                            Tell us about your business
                                        </p>
                                    </div>

                                    <form onSubmit={handleApplicationSubmit} className="space-y-5">
                                        {error && (
                                            <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                                                <AlertDescription className="text-red-300">{error}</AlertDescription>
                                            </Alert>
                                        )}

                                        {/* Company Name - Required */}
                                        <div className="space-y-2">
                                            <Label htmlFor="company_name" className="text-gray-300">
                                                Company Name <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                <Input
                                                    id="company_name"
                                                    name="company_name"
                                                    type="text"
                                                    placeholder="Your Company Name"
                                                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] h-12"
                                                    value={applicationData.company_name}
                                                    onChange={handleApplicationInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Website URL - Optional */}
                                        <div className="space-y-2">
                                            <Label htmlFor="website_url" className="text-gray-300">Website URL</Label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                <Input
                                                    id="website_url"
                                                    name="website_url"
                                                    type="url"
                                                    placeholder="https://yourwebsite.com"
                                                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] h-12"
                                                    value={applicationData.website_url}
                                                    onChange={handleApplicationInputChange}
                                                />
                                            </div>
                                        </div>

                                        {/* App URL - Optional */}
                                        <div className="space-y-2">
                                            <Label htmlFor="app_url" className="text-gray-300">App URL (if applicable)</Label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                <Input
                                                    id="app_url"
                                                    name="app_url"
                                                    type="url"
                                                    placeholder="https://yourapp.com"
                                                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] h-12"
                                                    value={applicationData.app_url}
                                                    onChange={handleApplicationInputChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Description - Optional */}
                                        <div className="space-y-2">
                                            <Label htmlFor="description" className="text-gray-300">How will you promote the brand?</Label>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                placeholder="Describe how you plan to promote and sell 1stRep products..."
                                                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] min-h-[100px]"
                                                value={applicationData.description}
                                                onChange={handleApplicationInputChange}
                                            />
                                        </div>

                                        {/* Location Description - Optional */}
                                        <div className="space-y-2">
                                            <Label htmlFor="location_description" className="text-gray-300">Physical Locations / Screens</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                                <Textarea
                                                    id="location_description"
                                                    name="location_description"
                                                    placeholder="Describe your physical locations, screens, or where customers will see products..."
                                                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] min-h-[100px]"
                                                    value={applicationData.location_description}
                                                    onChange={handleApplicationInputChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Expected Traffic - Optional */}
                                        <div className="space-y-2">
                                            <Label htmlFor="expected_traffic" className="text-gray-300">Expected Traffic</Label>
                                            <div className="relative">
                                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                <Input
                                                    id="expected_traffic"
                                                    name="expected_traffic"
                                                    type="text"
                                                    placeholder="e.g., 1000+ visitors/month, 500+ members"
                                                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00bfff] h-12"
                                                    value={applicationData.expected_traffic}
                                                    onChange={handleApplicationInputChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-gradient-to-r from-[#00bfff] via-[#0ea5e9] to-[#3b82f6] hover:from-[#0099cc] hover:via-[#00bfff] hover:to-[#0ea5e9] text-white font-semibold uppercase text-sm md:text-base shadow-lg shadow-[#00bfff]/30 hover:shadow-[#00bfff]/40 transition-all duration-300 border-0"
                                            disabled={submitApplicationMutation.isPending || !isAuthenticated}
                                        >
                                            {submitApplicationMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                "Submit Application"
                                            )}
                                        </Button>
                                    </form>
                                </>
                            )}

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
