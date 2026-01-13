// app/(site)/gift-cards/page.tsx
"use client";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGiftCards, useRedeemGiftCard, useCreateGiftCard } from '@/hooks/useMarketing';
import { marketingApi } from '@/lib/api/marketing';
import { ArrowLeft, Gift, Search, Loader2, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function GiftCardsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { data: giftCards, isLoading: cardsLoading } = useGiftCards({ page_size: 20 });
    const redeemMutation = useRedeemGiftCard();
    const createMutation = useCreateGiftCard();

    const [searchCode, setSearchCode] = useState('');
    const [searchedCard, setSearchedCard] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    
    // Purchase form state
    const [showPurchaseForm, setShowPurchaseForm] = useState(false);
    const [purchaseAmount, setPurchaseAmount] = useState<string>('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [giftMessage, setGiftMessage] = useState('');

    const handleSearch = async () => {
        if (!searchCode.trim()) {
            toast({
                title: "Enter a code",
                description: "Please enter a gift card code to search.",
                variant: "destructive",
            });
            return;
        }

        setIsSearching(true);
        try {
            const result = await marketingApi.getGiftCardByCode(searchCode.trim());
            setSearchedCard(result);
        } catch (error: any) {
            setSearchedCard(null);
            if (error.response?.status === 404) {
                toast({
                    title: "Not found",
                    description: "Gift card not found. Please check the code and try again.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Error",
                    description: error.response?.data?.detail || "Failed to search for gift card. Please try again.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsSearching(false);
        }
    };

    const handleRedeem = (cardId: string, code: string) => {
        redeemMutation.mutate(
            {
                id: cardId,
                data: { code },
            },
            {
                onSuccess: () => {
                    setSearchedCard(null);
                    setSearchCode('');
                },
            }
        );
    };

    const handlePurchase = () => {
        const amount = parseFloat(purchaseAmount);
        if (!amount || amount <= 0) {
            toast({
                title: "Invalid amount",
                description: "Please enter a valid gift card amount.",
                variant: "destructive",
            });
            return;
        }

        if (amount < 5) {
            toast({
                title: "Minimum amount",
                description: "Gift card amount must be at least £5.",
                variant: "destructive",
            });
            return;
        }

        createMutation.mutate({
            amount,
            recipient_email: recipientEmail || undefined,
            recipient_name: recipientName || undefined,
            message: giftMessage || undefined,
        }, {
            onSuccess: () => {
                // Reset form
                setPurchaseAmount('');
                setRecipientEmail('');
                setRecipientName('');
                setGiftMessage('');
                setShowPurchaseForm(false);
            },
        });
    };

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
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">Gift Cards</h1>
                    <p className="text-sm md:text-base text-gray-400">
                        Check your gift card balance and redeem codes
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Purchase Gift Card Card */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-white flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Purchase Gift Card
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Buy a gift card for yourself or send it to someone special
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!showPurchaseForm ? (
                                    <Button
                                        onClick={() => setShowPurchaseForm(true)}
                                        className="w-full bg-white text-black hover:bg-gray-200"
                                    >
                                        <Gift className="mr-2 h-4 w-4" />
                                        Buy Gift Card
                                    </Button>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount" className="text-sm text-gray-300">
                                                Gift Card Amount (£)
                                            </Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                min="5"
                                                step="0.01"
                                                value={purchaseAmount}
                                                onChange={(e) => setPurchaseAmount(e.target.value)}
                                                placeholder="Enter amount (minimum £5)"
                                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="recipient-name" className="text-sm text-gray-300">
                                                Recipient Name (Optional)
                                            </Label>
                                            <Input
                                                id="recipient-name"
                                                type="text"
                                                value={recipientName}
                                                onChange={(e) => setRecipientName(e.target.value)}
                                                placeholder="Enter recipient's name"
                                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="recipient-email" className="text-sm text-gray-300">
                                                Recipient Email (Optional)
                                            </Label>
                                            <Input
                                                id="recipient-email"
                                                type="email"
                                                value={recipientEmail}
                                                onChange={(e) => setRecipientEmail(e.target.value)}
                                                placeholder="Enter recipient's email"
                                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                            />
                                            <p className="text-xs text-gray-500">
                                                If provided, gift card will be sent to this email
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-sm text-gray-300">
                                                Personal Message (Optional)
                                            </Label>
                                            <textarea
                                                id="message"
                                                value={giftMessage}
                                                onChange={(e) => setGiftMessage(e.target.value)}
                                                placeholder="Add a personal message"
                                                rows={3}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-white"
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setShowPurchaseForm(false);
                                                    setPurchaseAmount('');
                                                    setRecipientEmail('');
                                                    setRecipientName('');
                                                    setGiftMessage('');
                                                }}
                                                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handlePurchase}
                                                disabled={createMutation.isPending || !purchaseAmount}
                                                className="flex-1 bg-white text-black hover:bg-gray-200"
                                            >
                                                {createMutation.isPending ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                                        Purchase Gift Card
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Check Balance Card */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-white flex items-center gap-2">
                                    <Search className="h-5 w-5" />
                                    Check Gift Card Balance
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Enter a gift card code to check its balance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={searchCode}
                                        onChange={(e) => {
                                            setSearchCode(e.target.value);
                                            setSearchedCard(null);
                                        }}
                                        placeholder="Enter gift card code"
                                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 font-mono"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch();
                                            }
                                        }}
                                    />
                                    <Button
                                        onClick={handleSearch}
                                        disabled={isSearching || !searchCode.trim()}
                                        className="bg-white text-black hover:bg-gray-200"
                                    >
                                        {isSearching ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="mr-2 h-4 w-4" />
                                                Search
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {searchedCard && (
                                    <div className="p-4 bg-gray-800 rounded-lg space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Code</p>
                                                <p className="text-lg font-mono font-semibold text-white">
                                                    {searchedCard.code}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-400">Balance</p>
                                                <p className="text-2xl font-bold text-white">
                                                    £{parseFloat(searchedCard.balance).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        <Separator className="bg-gray-700" />

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-400">Status</p>
                                                <p className="text-white capitalize flex items-center gap-2 mt-1">
                                                    {searchedCard.status === 'active' ? (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                                            <span className="text-green-400">Active</span>
                                                        </>
                                                    ) : searchedCard.status === 'redeemed' ? (
                                                        <>
                                                            <XCircle className="h-4 w-4 text-red-400" />
                                                            <span className="text-red-400">Redeemed</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-400">Expired</span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                            {searchedCard.expires_at && (
                                                <div>
                                                    <p className="text-gray-400">Expires</p>
                                                    <p className="text-white mt-1">
                                                        {format(new Date(searchedCard.expires_at), 'MMM dd, yyyy')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {searchedCard.status === 'active' && parseFloat(searchedCard.balance) > 0 && (
                                            <Button
                                                onClick={() => handleRedeem(searchedCard.id, searchedCard.code)}
                                                disabled={redeemMutation.isPending}
                                                className="w-full bg-white text-black hover:bg-gray-200"
                                            >
                                                {redeemMutation.isPending ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Redeeming...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Gift className="mr-2 h-4 w-4" />
                                                        Redeem Gift Card
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* My Gift Cards */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-white flex items-center gap-2">
                                    <Gift className="h-5 w-5" />
                                    My Gift Cards
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Gift cards associated with your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {cardsLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                    </div>
                                ) : !giftCards || !giftCards.results || giftCards.results.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Gift className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400 mb-2">No gift cards found</p>
                                        <p className="text-sm text-gray-500">
                                            Gift cards you receive will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {giftCards.results.map((card) => (
                                            <div
                                                key={card.id}
                                                className="p-4 bg-gray-800 rounded-lg"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <p className="text-sm font-mono font-semibold text-white">
                                                            {card.code}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1 capitalize">
                                                            {card.status}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-white">
                                                            £{parseFloat(card.balance).toFixed(2)}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            of £{parseFloat(card.initial_balance).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {card.expires_at && (
                                                    <p className="text-xs text-gray-500">
                                                        Expires: {format(new Date(card.expires_at), 'MMM dd, yyyy')}
                                                    </p>
                                                )}

                                                {card.status === 'active' && parseFloat(card.balance) > 0 && (
                                                    <Button
                                                        onClick={() => handleRedeem(card.id, card.code)}
                                                        disabled={redeemMutation.isPending}
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full mt-3 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                                    >
                                                        Redeem
                                                    </Button>
                                                )}
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
                                    <Gift className="h-5 w-5" />
                                    About Gift Cards
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-white">Check Balance</h4>
                                    <p className="text-xs text-gray-400">
                                        Enter your gift card code above to check the balance and expiration date.
                                    </p>
                                </div>
                                <Separator className="bg-gray-800" />
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-white">Redeem at Checkout</h4>
                                    <p className="text-xs text-gray-400">
                                        Use your gift card code during checkout to apply the balance to your order.
                                    </p>
                                </div>
                                <Separator className="bg-gray-800" />
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-white">Partial Redemption</h4>
                                    <p className="text-xs text-gray-400">
                                        If your order is less than the gift card balance, the remaining amount stays on the card for future use.
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
