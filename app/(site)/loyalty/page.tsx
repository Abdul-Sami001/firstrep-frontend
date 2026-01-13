// app/(site)/loyalty/page.tsx
"use client";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useLoyaltyAccount, useLoyaltyTransactions, useRedeemLoyaltyPoints } from '@/hooks/useMarketing';
import { ArrowLeft, Coins, TrendingUp, History, Gift, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function LoyaltyPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { data: account, isLoading: accountLoading } = useLoyaltyAccount();
    const { data: transactions, isLoading: transactionsLoading } = useLoyaltyTransactions({ page_size: 20 });
    const redeemMutation = useRedeemLoyaltyPoints();

    const [redeemPoints, setRedeemPoints] = useState<string>('');

    const handleRedeem = () => {
        const points = parseInt(redeemPoints);
        if (!points || points <= 0) {
            toast({
                title: "Invalid amount",
                description: "Please enter a valid number of points to redeem.",
                variant: "destructive",
            });
            return;
        }

        if (account && points > account.points_balance) {
            toast({
                title: "Insufficient points",
                description: `You only have ${account.points_balance} points available.`,
                variant: "destructive",
            });
            return;
        }

        redeemMutation.mutate({ points }, {
            onSuccess: () => {
                setRedeemPoints('');
            },
        });
    };

    if (accountLoading) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="mt-2 text-gray-400 text-sm">Loading loyalty account...</p>
                </div>
            </div>
        );
    }

    if (!account) {
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
                                <Coins className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    No Loyalty Account
                                </h3>
                                <p className="text-gray-400">
                                    You don't have a loyalty account yet. Start shopping to earn points!
                                </p>
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
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">Loyalty Points</h1>
                    <p className="text-sm md:text-base text-gray-400">
                        Earn points with every purchase and redeem them for discounts
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Account Overview */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Points Balance Card */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-white flex items-center gap-2">
                                    <Coins className="h-5 w-5" />
                                    Your Points
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    {account.program_name}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-800 rounded-lg">
                                        <p className="text-sm text-gray-400 mb-1">Available Points</p>
                                        <p className="text-3xl font-bold text-white">{account.points_balance.toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 bg-gray-800 rounded-lg">
                                        <p className="text-sm text-gray-400 mb-1">Lifetime Points</p>
                                        <p className="text-3xl font-bold text-white">{account.lifetime_points.toLocaleString()}</p>
                                    </div>
                                </div>

                                <Separator className="bg-gray-800" />

                                {/* Redeem Points */}
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="redeem-points" className="text-sm text-gray-300 mb-2 block">
                                            Redeem Points
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="redeem-points"
                                                type="number"
                                                min="1"
                                                max={account.points_balance}
                                                value={redeemPoints}
                                                onChange={(e) => setRedeemPoints(e.target.value)}
                                                placeholder="Enter points to redeem"
                                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                                disabled={redeemMutation.isPending || account.points_balance === 0}
                                            />
                                            <Button
                                                onClick={handleRedeem}
                                                disabled={redeemMutation.isPending || account.points_balance === 0 || !redeemPoints}
                                                className="bg-white text-black hover:bg-gray-200"
                                            >
                                                {redeemMutation.isPending ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Redeeming...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Gift className="mr-2 h-4 w-4" />
                                                        Redeem
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Minimum redemption: 100 points (typically equals £1 discount)
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Transaction History */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-white flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    Transaction History
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    View your points activity
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {transactionsLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                    </div>
                                ) : !transactions || !transactions.results || transactions.results.length === 0 ? (
                                    <div className="text-center py-8">
                                        <History className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400">No transactions yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {transactions.results.map((transaction) => {
                                            const isPositive = transaction.transaction_type === 'earned' || transaction.transaction_type === 'adjusted';
                                            const isNegative = transaction.transaction_type === 'redeemed' || transaction.transaction_type === 'expired';
                                            
                                            // Ensure points_amount is a number (API returns points_amount, not points)
                                            const pointsValue = typeof transaction.points_amount === 'string' 
                                                ? parseFloat(transaction.points_amount) 
                                                : Number(transaction.points_amount) || 0;
                                            
                                            return (
                                                <div
                                                    key={transaction.id}
                                                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                                                >
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-white capitalize">
                                                            {transaction.transaction_type.replace('_', ' ')}
                                                        </p>
                                                        {transaction.description && (
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {transaction.description}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p
                                                            className={`text-lg font-semibold ${
                                                                isPositive
                                                                    ? 'text-green-400'
                                                                    : isNegative
                                                                    ? 'text-red-400'
                                                                    : 'text-gray-400'
                                                            }`}
                                                        >
                                                            {isPositive ? '+' : '-'}
                                                            {Math.abs(pointsValue).toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-gray-500">points</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
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
                                    <TrendingUp className="h-5 w-5" />
                                    How It Works
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-white">Earning Points</h4>
                                    <p className="text-xs text-gray-400">
                                        Earn points automatically with every purchase. Typically 1 point per £1 spent.
                                    </p>
                                </div>
                                <Separator className="bg-gray-800" />
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-white">Redeeming Points</h4>
                                    <p className="text-xs text-gray-400">
                                        Redeem your points for discounts on future purchases. Points never expire!
                                    </p>
                                </div>
                                <Separator className="bg-gray-800" />
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-white">Lifetime Points</h4>
                                    <p className="text-xs text-gray-400">
                                        Track all points you've ever earned, even after redemption.
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
