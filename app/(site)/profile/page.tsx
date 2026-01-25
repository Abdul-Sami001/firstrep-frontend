// app/(site)/profile/page.tsx - Fixed with Editable Names
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, useUpdateProfile } from '@/hooks/useAuth';
import { useWishlist } from '@/contexts/WishlistContext';
import { useMyReviews } from '@/hooks/useReviews';
import { useLoyaltyAccount, useMyReferralCode } from '@/hooks/useMarketing';
import { User, Mail, Phone, MapPin, Calendar, Save, ArrowLeft, Heart, Star, ExternalLink, Coins, Users, Gift } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import WishlistItem from '@/components/WishlistItem';
import ReviewCard from '@/components/ReviewCard';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const { user } = useAuth();
    const { data: profile, isLoading: profileLoading } = useUserProfile();
    const updateProfileMutation = useUpdateProfile();
    const { wishlistItems, totalItems: wishlistTotal } = useWishlist();
    const { data: myReviews } = useMyReviews({ page_size: 5 });
    const { data: loyaltyAccount } = useLoyaltyAccount();
    const { data: myReferralCode } = useMyReferralCode();

    const [isEditing, setIsEditing] = useState(false);
    
    // Parse full_name into first_name and last_name for UI
    const parseFullName = (fullName: string = '') => {
        const parts = fullName.trim().split(' ');
        return {
            first_name: parts[0] || '',
            last_name: parts.slice(1).join(' ') || '',
        };
    };

    // Parse address into components for UI (simple - just show full address in address field)
    // City, state, zip, country will be empty initially - user can fill them
    // When saving, we combine all into address field
    const parseAddress = (address: string = '') => {
        return {
            address: address || '',
            city: '',
            state: '',
            zip_code: '',
            country: '',
        };
    };

    const initialName = parseFullName(profile?.full_name || '');
    const initialAddress = parseAddress(profile?.address || '');
    
    const [formData, setFormData] = useState({
        first_name: user?.first_name || initialName.first_name,
        last_name: user?.last_name || initialName.last_name,
        phone: profile?.phone || '',
        address: initialAddress.address,
        city: initialAddress.city,
        state: initialAddress.state,
        zip_code: initialAddress.zip_code,
        country: initialAddress.country,
    });

    // Update formData when user or profile data changes
    useEffect(() => {
        if (user) {
            const nameParts = parseFullName(profile?.full_name || '');
            setFormData(prev => ({
                ...prev,
                first_name: user.first_name || nameParts.first_name,
                last_name: user.last_name || nameParts.last_name,
            }));
        }
    }, [user, profile]);

    useEffect(() => {
        if (profile) {
            const addressParts = parseAddress(profile.address || '');
            setFormData(prev => ({
                ...prev,
                phone: profile.phone || '',
                address: addressParts.address,
                city: addressParts.city,
                state: addressParts.state,
                zip_code: addressParts.zip_code,
                country: addressParts.country,
            }));
        }
    }, [profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSave = () => {
        // Combine full_name from first_name and last_name
        const full_name = `${formData.first_name} ${formData.last_name}`.trim();
        
        // Combine address components into single address field
        const addressParts = [
            formData.address,
            formData.city,
            formData.state,
            formData.zip_code,
            formData.country,
        ].filter(Boolean); // Remove empty strings
        const address = addressParts.join(', ');

        // Prepare data matching API structure
        const updateData = {
            full_name: full_name,
            phone: formData.phone,
            address: address,
        };

        // Single API call with combined data
        updateProfileMutation.mutate(updateData, {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const handleCancel = () => {
        const nameParts = parseFullName(profile?.full_name || '');
        const addressParts = parseAddress(profile?.address || '');
        setFormData({
            first_name: user?.first_name || nameParts.first_name,
            last_name: user?.last_name || nameParts.last_name,
            phone: profile?.phone || '',
            address: addressParts.address,
            city: addressParts.city,
            state: addressParts.state,
            zip_code: addressParts.zip_code,
            country: addressParts.country,
        });
        setIsEditing(false);
    };

    if (profileLoading) {
        return (
            <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="mt-2 text-gray-400 text-sm">Loading profile...</p>
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
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">Profile</h1>
                    <p className="text-sm md:text-base text-gray-400">
                        Manage your account information
                    </p>
                </div>

                {/* Layout */}
                <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">

                    {/* Profile Overview */}
                    <div className="lg:col-span-1">
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader className="text-center pb-4">
                                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 mx-auto mb-3 sm:mb-4">
                                    <AvatarImage src={profile?.avatar || undefined} alt={user?.first_name} />
                                    <AvatarFallback className="bg-white text-black text-lg sm:text-xl lg:text-2xl font-semibold">
                                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-lg sm:text-xl text-white">
                                    {user?.first_name} {user?.last_name}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-400">{user?.email}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center text-gray-400">
                                        <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                                        <span className="truncate">
                                            Member since {new Date(user?.date_joined || '').toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
                                        <span className="truncate">
                                            {user?.is_active ? 'Verified Account' : 'Pending Verification'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Details */}
                    <div className="lg:col-span-2">
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-lg sm:text-xl text-white">Personal Information</CardTitle>
                                        <CardDescription className="text-sm text-gray-400">
                                            Update your personal details and contact information
                                        </CardDescription>
                                    </div>
                                    {!isEditing && (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full sm:w-auto bg-white text-black hover:bg-gray-200"
                                        >
                                            Edit Profile
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 sm:space-y-6">

                                {/* Basic Info - Now Editable */}
                                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name" className="text-sm text-gray-300">First Name</Label>
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <Input
                                                id="first_name"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="text-sm bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                                placeholder="Enter your first name"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name" className="text-sm text-gray-300">Last Name</Label>
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <Input
                                                id="last_name"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="text-sm bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                                placeholder="Enter your last name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email - Read Only */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm text-gray-300">Email Address</Label>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        <Input
                                            id="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="bg-gray-800 border-gray-700 text-gray-400 text-sm"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Email cannot be changed. Contact support if needed.
                                    </p>
                                </div>

                                <Separator className="bg-gray-800" />

                                {/* Contact Info */}
                                <div className="space-y-4">
                                    <h3 className="text-base sm:text-lg font-semibold text-white">Contact Information</h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm text-gray-300">Phone Number</Label>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your phone number"
                                                className="text-sm bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="text-sm text-gray-300">Address</Label>
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <Input
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your address"
                                                className="text-sm bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Address Fields */}
                                    <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city" className="text-sm text-gray-300">City</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="City"
                                                className="text-sm bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state" className="text-sm text-gray-300">State</Label>
                                            <Input
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="State"
                                                className="text-sm bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zip_code" className="text-sm text-gray-300">ZIP Code</Label>
                                            <Input
                                                id="zip_code"
                                                name="zip_code"
                                                value={formData.zip_code}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="ZIP Code"
                                                className="text-sm bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country" className="text-sm text-gray-300">Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            placeholder="Country"
                                            className="text-sm bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={updateProfileMutation.isPending}
                                            className="w-full sm:w-auto bg-white text-black hover:bg-gray-200"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Wishlist Section */}
                <div className="mt-8">
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-white">
                                        <Heart className="h-5 w-5" />
                                        My Wishlist
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-400">
                                        Items you've saved for later
                                    </CardDescription>
                                </div>
                                <Link href="/wishlist">
                                    <Button variant="outline" size="sm" className="gap-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                                        View All
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {wishlistTotal === 0 ? (
                                <div className="text-center py-8">
                                    <Heart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Your wishlist is empty
                                    </h3>
                                    <p className="text-gray-400 mb-4">
                                        Start adding items you love to your wishlist.
                                    </p>
                                    <Link href="/shop-clean">
                                        <Button className="bg-white text-black hover:bg-gray-200">Start Shopping</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {wishlistItems.slice(0, 3).map((item) => (
                                        <WishlistItem
                                            key={item.id}
                                            item={item}
                                            data-testid={`profile-wishlist-item-${item.id}`}
                                        />
                                    ))}
                                    {wishlistTotal > 3 && (
                                        <div className="text-center pt-4">
                                            <Link href="/wishlist">
                                                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                                                    View {wishlistTotal - 3} more items
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Marketing Features Section */}
                <div className="mt-8">
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl text-white">Rewards & Benefits</CardTitle>
                            <CardDescription className="text-sm text-gray-400">
                                Manage your loyalty points, referrals, and gift cards
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Loyalty Points */}
                                <Link href="/loyalty" className="block">
                                    <div className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Coins className="h-5 w-5 text-yellow-400" />
                                            <h3 className="font-semibold text-white">Loyalty Points</h3>
                                        </div>
                                        {loyaltyAccount ? (
                                            <p className="text-2xl font-bold text-white mb-1">
                                                {loyaltyAccount.points_balance.toLocaleString()}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-400">Start earning points</p>
                                        )}
                                        <p className="text-xs text-gray-500">Earn and redeem points</p>
                                    </div>
                                </Link>

                                {/* Referrals */}
                                <Link href="/referrals" className="block">
                                    <div className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Users className="h-5 w-5 text-blue-400" />
                                            <h3 className="font-semibold text-white">Referrals</h3>
                                        </div>
                                        {myReferralCode ? (
                                            <p className="text-sm font-mono text-white mb-1">
                                                {myReferralCode.referral_code}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-400">Get your code</p>
                                        )}
                                        <p className="text-xs text-gray-500">Share and earn rewards</p>
                                    </div>
                                </Link>

                                {/* Gift Cards */}
                                <Link href="/gift-cards" className="block">
                                    <div className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Gift className="h-5 w-5 text-pink-400" />
                                            <h3 className="font-semibold text-white">Gift Cards</h3>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-1">Check balance</p>
                                        <p className="text-xs text-gray-500">Redeem gift cards</p>
                                    </div>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Reviews Section */}
                <div className="mt-8">
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-white">
                                        <Star className="h-5 w-5" />
                                        My Reviews
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-400">
                                        Reviews you've written
                                    </CardDescription>
                                </div>
                                {myReviews && myReviews.results && myReviews.results.length > 0 && (
                                    <Link href="/profile/reviews">
                                        <Button variant="outline" size="sm" className="gap-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                                            View All
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!myReviews || !myReviews.results || myReviews.results.length === 0 ? (
                                <div className="text-center py-8">
                                    <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        No reviews yet
                                    </h3>
                                    <p className="text-gray-400 mb-4">
                                        Share your experience by writing reviews for products you've purchased.
                                    </p>
                                    <Link href="/shop-clean">
                                        <Button className="bg-white text-black hover:bg-gray-200">Browse Products</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myReviews?.results?.slice(0, 3).map((review) => (
                                        <ReviewCard
                                            key={review.id}
                                            review={review}
                                            showActions={false}
                                            data-testid={`profile-review-${review.id}`}
                                        />
                                    ))}
                                    {myReviews?.results && myReviews.results.length > 3 && (
                                        <div className="text-center pt-4">
                                            <Link href="/profile/reviews">
                                                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                                                    View {myReviews.results.length - 3} more reviews
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}