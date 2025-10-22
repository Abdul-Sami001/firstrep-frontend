// components/RatingDistribution.tsx - Bar Chart of Ratings Component
import React from 'react';
import { RatingStats } from '@/lib/api/reviews';
import { cn } from '@/lib/utils';

interface RatingDistributionProps {
    stats: RatingStats;
    onRatingClick?: (rating: number) => void;
    className?: string;
    'data-testid'?: string;
}

export default function RatingDistribution({
    stats,
    onRatingClick,
    className,
    'data-testid': testId,
}: RatingDistributionProps) {
    const { rating_distribution, review_count } = stats;

    const getPercentage = (rating: number) => {
        const count = rating_distribution[rating.toString()] || 0;
        return review_count > 0 ? Math.round((count / review_count) * 100) : 0;
    };

    const getBarWidth = (rating: number) => {
        const percentage = getPercentage(rating);
        return `${Math.max(percentage, 2)}%`; // Minimum 2% width for visibility
    };

    const renderStar = (filled: boolean, index: number) => (
        <span
            key={index}
            className={cn(
                'text-sm',
                filled ? 'text-yellow-400' : 'text-gray-300'
            )}
        >
            ★
        </span>
    );

    return (
        <div 
            className={cn('space-y-3', className)}
            data-testid={testId}
        >
            <h4 className="text-sm font-medium">Rating Breakdown</h4>
            
            <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                    const count = rating_distribution[rating.toString()] || 0;
                    const percentage = getPercentage(rating);
                    const isClickable = !!onRatingClick;

                    return (
                        <div 
                            key={rating}
                            className={cn(
                                'flex items-center gap-3 text-sm',
                                isClickable && 'cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors'
                            )}
                            onClick={() => onRatingClick?.(rating)}
                            data-testid={`rating-bar-${rating}`}
                        >
                            {/* Star Rating */}
                            <div className="flex items-center gap-1 w-16">
                                <span className="w-4 text-right">{rating}</span>
                                <div className="flex">
                                    {renderStar(true, 0)}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div 
                                    className={cn(
                                        'h-full transition-all duration-300',
                                        rating >= 4 ? 'bg-green-500' :
                                        rating >= 3 ? 'bg-yellow-500' :
                                        'bg-red-500'
                                    )}
                                    style={{ width: getBarWidth(rating) }}
                                    data-testid={`rating-progress-${rating}`}
                                />
                            </div>

                            {/* Count and Percentage */}
                            <div className="flex items-center gap-1 w-16 text-right">
                                <span className="text-muted-foreground">
                                    {count}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    ({percentage}%)
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary */}
            <div className="pt-2 border-t text-xs text-muted-foreground">
                Based on {review_count} review{review_count !== 1 ? 's' : ''}
            </div>
        </div>
    );
}
