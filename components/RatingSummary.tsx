// components/RatingSummary.tsx - Aggregate Rating Statistics Component
import React from 'react';
import Link from 'next/link';
import { RatingStats } from '@/lib/api/reviews';
import RatingStars from './RatingStars';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RatingSummaryProps {
    stats: RatingStats;
    productId: string;
    showDistribution?: boolean;
    showReviewsLink?: boolean;
    className?: string;
    'data-testid'?: string;
}

export default function RatingSummary({
    stats,
    productId,
    showDistribution = true,
    showReviewsLink = true,
    className,
    'data-testid': testId,
}: RatingSummaryProps) {
    const { average_rating, review_count, verified_count, rating_distribution } = stats;

    const formatRating = (rating: number) => {
        return rating.toFixed(1);
    };

    const getRatingText = (rating: number) => {
        if (rating >= 4.5) return 'Excellent';
        if (rating >= 4.0) return 'Very Good';
        if (rating >= 3.5) return 'Good';
        if (rating >= 3.0) return 'Fair';
        if (rating >= 2.0) return 'Poor';
        return 'Very Poor';
    };

    const verifiedPercentage = review_count > 0 
        ? Math.round((verified_count / review_count) * 100) 
        : 0;

    return (
        <div 
            className={cn('space-y-3', className)}
            data-testid={testId}
        >
            {/* Main Rating Display */}
            <div className="flex items-center gap-4">
                <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">
                        {formatRating(average_rating)}
                    </div>
                    <RatingStars 
                        rating={average_rating} 
                        size="md" 
                        data-testid="rating-stars-summary"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                        {getRatingText(average_rating)}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">
                            {review_count} review{review_count !== 1 ? 's' : ''}
                        </span>
                        {verified_count > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {verified_count} verified
                            </Badge>
                        )}
                    </div>
                    
                    {verifiedPercentage > 0 && (
                        <div className="text-xs text-muted-foreground">
                            {verifiedPercentage}% verified purchases
                        </div>
                    )}
                </div>
            </div>

            {/* Rating Distribution */}
            {showDistribution && rating_distribution && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Rating Breakdown</h4>
                    <div className="space-y-1">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = rating_distribution[star.toString()] || 0;
                            const percentage = review_count > 0 
                                ? Math.round((count / review_count) * 100) 
                                : 0;

                            return (
                                <div key={star} className="flex items-center gap-2 text-sm">
                                    <span className="w-4 text-right">{star}</span>
                                    <RatingStars rating={1} size="sm" maxRating={1} />
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="w-8 text-right text-muted-foreground">
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Reviews Link */}
            {showReviewsLink && review_count > 0 && (
                <div className="pt-2 border-t">
                    <Link 
                        href={`/product/${productId}/reviews`}
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                        data-testid="link-see-all-reviews"
                    >
                        See all {review_count} review{review_count !== 1 ? 's' : ''} →
                    </Link>
                </div>
            )}
        </div>
    );
}
