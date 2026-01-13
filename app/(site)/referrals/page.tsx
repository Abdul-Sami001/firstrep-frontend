// app/(site)/referrals/page.tsx
"use client";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useMyReferralCode, useReferrals, useCreateReferral } from '@/hooks/useMarketing';
import { ArrowLeft, Users, Copy, Check, ExternalLink, Loader2, Gift } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function ReferralsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { data: myCode, isLoading: codeLoading, refetch: refetchCode } = useMyReferralCode();
    const { data: referrals, isLoading: referralsLoading } = useReferrals({ page_size: 20 });
    const createReferralMutation = useCreateReferral();
    const [copied, setCopied] = useState(false);

    const referralUrl = typeof window !== 'undefined' && myCode?.referral_code
        ? `${window.location.origin}?ref=${myCode.referral_code}`
        : '';

    const copyToClipboard = async () => {
        if (!myCode?.referral_code) return;

        try {
            await navigator.clipboard.writeText(myCode.referral_code);
            setCopied(true);
            toast({
                title: "Copied!",
                description: "Referral code copied to clipboard.",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast({
                title: "Failed to copy",
                description: "Please copy the code manually.",
                variant: "destructive",
            });
        }
    };

    const copyUrlToClipboard = async () => {
        if (!referralUrl) return;

        try {
            await navigator.clipboard.writeText(referralUrl);
            toast({
                title: "Copied!",
                description: "Referral link copied to clipboard.",
            });
        } catch (err) {
            toast({
                title: "Failed to copy",
                description: "Please copy the link manually.",
                variant: "destructive",
            });
        }
    };

    if (codeLoading) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="mt-2 text-gray-400 text-sm">Loading referral information...</p>
                </div>
            </div>
        );
    }

    const handleCreateReferral = () => {
        createReferralMutation.mutate(undefined, {
            onSuccess: () => {
                refetchCode();
            },
        });
    };

    if (!myCode && !codeLoading) {
        return (
            <div className="min-h-screen bg-[#000000]">
                <div className="mobile-container tablet-container desktop-container py-8 md:py-12 lg:py-16">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-6 text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="pt-6">
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    No Referral Code
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    Create your referral code to start earning rewards when friends make purchases.
                                </p>
                                <Button
                                    onClick={handleCreateReferral}
                                    disabled={createReferralMutation.isPending}
                                    className="bg-white text-black hover:bg-gray-200"
                                >
                                    {createReferralMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Users className="mr-2 h-4 w-4" />
                                            Create Referral Code
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000]">
            <div className="mobile-container tablet-container desktop-container py-8 md:py-12 lg:py-16">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-6 text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">Referral Program</h1>
                    <p className="text-sm md:text-base text-gray-400">
                        Share your code and earn rewards when friends make purchases
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Referral Code Card */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-white flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Your Referral Code
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Share this code with friends to earn rewards
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-400 mb-2">Referral Code</p>
                                            <p className="text-2xl font-bold text-white font-mono">
                                                {myCode.referral_code}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={copyToClipboard}
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="mr-2 h-4 w-4" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-800 rounded-lg">
                                    <p className="text-sm text-gray-400 mb-2">Referral Link</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-white font-mono flex-1 truncate">
                                            {referralUrl || 'Loading...'}
                                        </p>
                                        <Button
                                            onClick={copyUrlToClipboard}
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white flex-shrink-0"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="p-3 bg-gray-800 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">Total Referrals</p>
                                        <p className="text-2xl font-bold text-white">{myCode.total_referrals}</p>
                                    </div>
                                    <div className="p-3 bg-gray-800 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">Completed</p>
                                        <p className="text-2xl font-bold text-white">{myCode.completed_referrals}</p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <p className="text-xs text-gray-500">
                                        Status: <span className="text-white capitalize">{myCode.status}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Created: {format(new Date(myCode.created_at), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Referrals List */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-white flex items-center gap-2">
                                    <Gift className="h-5 w-5" />
                                    Your Referrals
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Track your referral activity
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {referralsLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                    </div>
                                ) : !referrals || !referrals.results || referrals.results.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400 mb-2">No referrals yet</p>
                                        <p className="text-sm text-gray-500">
                                            Share your code to start earning rewards!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {referrals.results.map((referral) => (
                                            <div
                                                key={referral.id}
                                                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-white">
                                                        Referral #{referral.id.slice(0, 8).toUpperCase()}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1 capitalize">
                                                        Status: {referral.status}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {format(new Date(referral.created_at), 'MMM dd, yyyy')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                                            referral.status === 'completed'
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : referral.status === 'pending'
                                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                                : 'bg-gray-500/20 text-gray-400'
                                                        }`}
                                                    >
                                                        {referral.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Info Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-lg text-white flex items-center gap-2">
                                    <ExternalLink className="h-5 w-5" />
                                    How It Works
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-white">Share Your Code</h4>
                                    <p className="text-xs text-gray-400">
                                        Share your unique referral code with friends and family via email, social media, or word of mouth.
                                    </p>
                                </div>
                                <Separator className="bg-gray-800" />
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-white">They Make a Purchase</h4>
                                    <p className="text-xs text-gray-400">
                                        When someone uses your code at checkout and makes a qualifying purchase, both of you earn rewards!
                                    </p>
                                </div>
                                <Separator className="bg-gray-800" />
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-white">Earn Rewards</h4>
                                    <p className="text-xs text-gray-400">
                                        You'll receive your reward when the referral is completed. Rewards are typically discounts or points.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
