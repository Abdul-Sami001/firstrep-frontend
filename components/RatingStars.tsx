// components/RatingStars.tsx - Star Rating Display Component
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    showValue?: boolean;
    onChange?: (rating: number) => void;
    className?: string;
    'data-testid'?: string;
}

const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
};

const containerSizeClasses = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1.5',
};

export default function RatingStars({
    rating,
    maxRating = 5,
    size = 'md',
    interactive = false,
    showValue = false,
    onChange,
    className,
    'data-testid': testId,
}: RatingStarsProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    const displayRating = isHovering && hoverRating !== null ? hoverRating : rating;
    const filledStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 >= 0.5;

    const handleStarClick = (starRating: number) => {
        if (interactive && onChange) {
            onChange(starRating);
        }
    };

    const handleMouseEnter = (starRating: number) => {
        if (interactive) {
            setHoverRating(starRating);
            setIsHovering(true);
        }
    };

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(null);
            setIsHovering(false);
        }
    };

    return (
        <div 
            className={cn(
                'flex items-center',
                containerSizeClasses[size],
                className
            )}
            data-testid={testId}
        >
            <div 
                className={cn(
                    'flex items-center',
                    containerSizeClasses[size],
                    interactive && 'cursor-pointer'
                )}
                onMouseLeave={handleMouseLeave}
                role={interactive ? 'radiogroup' : undefined}
                aria-label={interactive ? 'Rate this item' : `Rating: ${rating} out of ${maxRating} stars`}
            >
                {Array.from({ length: maxRating }, (_, index) => {
                    const starRating = index + 1;
                    const isFilled = starRating <= filledStars;
                    const isHalfFilled = starRating === filledStars + 1 && hasHalfStar;

                    return (
                        <button
                            key={index}
                            type="button"
                            className={cn(
                                'transition-colors duration-150',
                                interactive && 'hover:scale-110',
                                !interactive && 'cursor-default'
                            )}
                            onClick={() => handleStarClick(starRating)}
                            onMouseEnter={() => handleMouseEnter(starRating)}
                            disabled={!interactive}
                            aria-label={`${starRating} star${starRating !== 1 ? 's' : ''}`}
                            data-testid={`star-${starRating}`}
                        >
                            <Star
                                className={cn(
                                    sizeClasses[size],
                                    {
                                        'text-yellow-400 fill-current': isFilled,
                                        'text-yellow-400 fill-current opacity-50': isHalfFilled,
                                        'text-gray-300': !isFilled && !isHalfFilled,
                                        'hover:text-yellow-400': interactive && !isFilled,
                                    }
                                )}
                            />
                        </button>
                    );
                })}
            </div>
            
            {showValue && (
                <span className="ml-2 text-sm text-muted-foreground">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
