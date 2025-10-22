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
import { User, Mail, Phone, MapPin, Calendar, Save, ArrowLeft, Heart, Star, ExternalLink } from 'lucide-react';
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

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone_number: profile?.phone_number || '',
        address: profile?.address || '',
        city: profile?.city || '',
        state: profile?.state || '',
        zip_code: profile?.zip_code || '',
        country: profile?.country || '',
    });

    // Update formData when user or profile data changes
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
            }));
        }
    }, [user]);

    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                phone_number: profile.phone_number || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                zip_code: profile.zip_code || '',
                country: profile.country || '',
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
        // Combine all data into single object
        const updateData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zip_code,
            country: formData.country,
        };

        // Single API call with combined data
        updateProfileMutation.mutate(updateData, {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const handleCancel = () => {
        setFormData({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            phone_number: profile?.phone_number || '',
            address: profile?.address || '',
            city: profile?.city || '',
            state: profile?.state || '',
            zip_code: profile?.zip_code || '',
            country: profile?.country || '',
        });
        setIsEditing(false);
    };

    if (profileLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground text-sm">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4 h-10 px-3"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
                        Manage your account information
                    </p>
                </div>

                {/* Layout */}
                <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">

                    {/* Profile Overview */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="text-center pb-4">
                                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 mx-auto mb-3 sm:mb-4">
                                    <AvatarImage src={profile?.avatar} alt={user?.first_name} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-lg sm:text-xl lg:text-2xl font-semibold">
                                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-lg sm:text-xl">
                                    {user?.first_name} {user?.last_name}
                                </CardTitle>
                                <CardDescription className="text-sm">{user?.email}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                                        <span className="truncate">
                                            Member since {new Date(user?.date_joined || '').toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
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
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-lg sm:text-xl">Personal Information</CardTitle>
                                        <CardDescription className="text-sm">
                                            Update your personal details and contact information
                                        </CardDescription>
                                    </div>
                                    {!isEditing && (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full sm:w-auto"
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
                                        <Label htmlFor="first_name" className="text-sm">First Name</Label>
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <Input
                                                id="first_name"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="text-sm"
                                                placeholder="Enter your first name"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name" className="text-sm">Last Name</Label>
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <Input
                                                id="last_name"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="text-sm"
                                                placeholder="Enter your last name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email - Read Only */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm">Email Address</Label>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <Input
                                            id="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="bg-muted text-sm"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Email cannot be changed. Contact support if needed.
                                    </p>
                                </div>

                                <Separator />

                                {/* Contact Info */}
                                <div className="space-y-4">
                                    <h3 className="text-base sm:text-lg font-semibold">Contact Information</h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone_number" className="text-sm">Phone Number</Label>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <Input
                                                id="phone_number"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your phone number"
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="text-sm">Address</Label>
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <Input
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your address"
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Address Fields */}
                                    <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city" className="text-sm">City</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="City"
                                                className="text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state" className="text-sm">State</Label>
                                            <Input
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="State"
                                                className="text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zip_code" className="text-sm">ZIP Code</Label>
                                            <Input
                                                id="zip_code"
                                                name="zip_code"
                                                value={formData.zip_code}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="ZIP Code"
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country" className="text-sm">Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            placeholder="Country"
                                            className="text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            className="w-full sm:w-auto"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={updateProfileMutation.isPending}
                                            className="w-full sm:w-auto"
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
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                        <Heart className="h-5 w-5" />
                                        My Wishlist
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        Items you've saved for later
                                    </CardDescription>
                                </div>
                                <Link href="/wishlist">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        View All
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {wishlistTotal === 0 ? (
                                <div className="text-center py-8">
                                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Your wishlist is empty
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Start adding items you love to your wishlist.
                                    </p>
                                    <Link href="/shop">
                                        <Button>Start Shopping</Button>
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
                                                <Button variant="outline">
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

                {/* Reviews Section */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                        <Star className="h-5 w-5" />
                                        My Reviews
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        Reviews you've written
                                    </CardDescription>
                                </div>
                                {myReviews && myReviews.results.length > 0 && (
                                    <Link href="/profile/reviews">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            View All
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!myReviews || myReviews.results.length === 0 ? (
                                <div className="text-center py-8">
                                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        No reviews yet
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Share your experience by writing reviews for products you've purchased.
                                    </p>
                                    <Link href="/shop">
                                        <Button>Browse Products</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myReviews.results.slice(0, 3).map((review) => (
                                        <ReviewCard
                                            key={review.id}
                                            review={review}
                                            showActions={false}
                                            data-testid={`profile-review-${review.id}`}
                                        />
                                    ))}
                                    {myReviews.results.length > 3 && (
                                        <div className="text-center pt-4">
                                            <Link href="/profile/reviews">
                                                <Button variant="outline">
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