// components/ReviewList.tsx - List of Reviews with Pagination and Filters
import React, { useState } from 'react';
import { Filter, SortAsc, SortDesc, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ReviewCard from './ReviewCard';
import RatingSummary from './RatingSummary';
import { Review, ReviewFilters, PaginatedReviews, RatingStats } from '@/lib/api/reviews';
import { cn } from '@/lib/utils';

interface ReviewListProps {
    reviews: PaginatedReviews | undefined;
    ratingStats: RatingStats | undefined;
    productId: string;
    filters: ReviewFilters;
    onFiltersChange: (filters: ReviewFilters) => void;
    onPageChange: (page: number) => void;
    onEditReview?: (review: Review) => void;
    onDeleteReview?: (reviewId: string) => void;
    onFlagReview?: (reviewId: string) => void;
    isLoading?: boolean;
    className?: string;
    'data-testid'?: string;
}

const SORT_OPTIONS = [
    { value: '-created_at', label: 'Most Recent' },
    { value: 'created_at', label: 'Oldest First' },
    { value: '-helpful_count', label: 'Most Helpful' },
    { value: 'helpful_count', label: 'Least Helpful' },
    { value: '-rating', label: 'Highest Rating' },
    { value: 'rating', label: 'Lowest Rating' },
];

const RATING_FILTERS = [
    { value: '', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' },
];

export default function ReviewList({
    reviews,
    ratingStats,
    productId,
    filters,
    onFiltersChange,
    onPageChange,
    onEditReview,
    onDeleteReview,
    onFlagReview,
    isLoading = false,
    className,
    'data-testid': testId,
}: ReviewListProps) {
    const [showFilters, setShowFilters] = useState(false);

    const handleSortChange = (value: string) => {
        onFiltersChange({ ...filters, ordering: value as any });
    };

    const handleRatingFilter = (value: string) => {
        onFiltersChange({ 
            ...filters, 
            rating: value ? parseInt(value) : undefined 
        });
    };

    const handleVerifiedFilter = (value: string) => {
        onFiltersChange({ 
            ...filters, 
            is_verified_purchase: value === 'verified' ? true : value === 'unverified' ? false : undefined 
        });
    };

    const getCurrentPage = () => {
        if (!reviews?.next && !reviews?.previous) return 1;
        // This is a simplified calculation - in a real app you'd parse the URL
        return 1; // You'd implement proper page calculation based on your pagination logic
    };

    const getTotalPages = () => {
        if (!reviews?.count) return 0;
        return Math.ceil(reviews.count / 20); // Assuming 20 items per page
    };

    const renderPagination = () => {
        const currentPage = getCurrentPage();
        const totalPages = getTotalPages();
        
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!reviews?.previous || isLoading}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!reviews?.next || isLoading}
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        );
    };

    const renderLoadingSkeletons = () => (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    );

    const renderEmptyState = () => (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-lg font-semibold mb-2 text-white">No reviews yet</h3>
            <p className="text-gray-400 mb-4">
                Be the first to share your experience with this product.
            </p>
        </div>
    );

    const activeFiltersCount = Object.values(filters).filter(value => 
        value !== undefined && value !== null && value !== ''
    ).length;

    return (
        <div className={cn('space-y-6', className)} data-testid={testId}>
            {/* Rating Summary */}
            {ratingStats && ratingStats.review_count > 0 && (
                <RatingSummary 
                    stats={ratingStats}
                    productId={productId}
                    showDistribution={true}
                    showReviewsLink={false}
                />
            )}

            {/* Filters and Sort */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-2 border-gray-700 text-white hover:bg-gray-800"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-1 bg-[#00bfff]/20 text-[#00bfff] border-[#00bfff]/30">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select value={filters.ordering || '-created_at'} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-40 border-gray-700 text-white bg-gray-900">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-800">
                                {SORT_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-800">
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="border border-gray-800 rounded-lg p-4 space-y-4 bg-gray-900">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Rating Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Rating</label>
                                <Select value={filters.rating?.toString() || ''} onValueChange={handleRatingFilter}>
                                    <SelectTrigger className="border-gray-700 text-white bg-gray-900">
                                        <SelectValue placeholder="All ratings" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-800">
                                        {RATING_FILTERS.map((option) => (
                                            <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-800">
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Verified Purchase Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Verified Purchase</label>
                                <Select 
                                    value={
                                        filters.is_verified_purchase === true ? 'verified' :
                                        filters.is_verified_purchase === false ? 'unverified' : 'all'
                                    } 
                                    onValueChange={handleVerifiedFilter}
                                >
                                    <SelectTrigger className="border-gray-700 text-white bg-gray-900">
                                        <SelectValue placeholder="All reviews" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-800">
                                        <SelectItem value="all" className="text-white hover:bg-gray-800">All Reviews</SelectItem>
                                        <SelectItem value="verified" className="text-white hover:bg-gray-800">Verified Only</SelectItem>
                                        <SelectItem value="unverified" className="text-white hover:bg-gray-800">Unverified Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onFiltersChange({})}
                                    className="w-full border-gray-700 text-white hover:bg-gray-800"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Reviews Count */}
            {reviews && reviews.results && (
                <div className="text-sm text-gray-400">
                    Showing {reviews.results.length} of {reviews.count} review{reviews.count !== 1 ? 's' : ''}
                </div>
            )}

            {/* Reviews List */}
            {isLoading ? (
                renderLoadingSkeletons()
            ) : !reviews || !reviews.results || reviews.results.length === 0 ? (
                renderEmptyState()
            ) : (
                <div className="space-y-4">
                    {reviews.results.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onEdit={onEditReview}
                            onDelete={onDeleteReview}
                            onFlag={onFlagReview}
                            data-testid={`review-card-${review.id}`}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {reviews && reviews.results && reviews.results.length > 0 && (
                <div className="pt-6">
                    {renderPagination()}
                </div>
            )}
        </div>
    );
}
