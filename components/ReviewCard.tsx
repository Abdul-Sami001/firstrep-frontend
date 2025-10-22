// components/ReviewCard.tsx - Display Single Review Component
import React from 'react';
import { ThumbsUp, Edit, Trash2, Flag, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Review } from '@/lib/api/reviews';
import RatingStars from './RatingStars';
import { useAuth } from '@/contexts/AuthContext';
import { useToggleHelpful } from '@/hooks/useReviews';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
    review: Review;
    onEdit?: (review: Review) => void;
    onDelete?: (reviewId: string) => void;
    onFlag?: (reviewId: string) => void;
    showActions?: boolean;
    className?: string;
    'data-testid'?: string;
}

export default function ReviewCard({
    review,
    onEdit,
    onDelete,
    onFlag,
    showActions = true,
    className,
    'data-testid': testId,
}: ReviewCardProps) {
    const { user } = useAuth();
    const toggleHelpfulMutation = useToggleHelpful(review.id);
    
    const isOwnReview = user?.id === review.user;
    const hasVotedHelpful = review.helpful_votes?.some(vote => vote.user === user?.id) || false;

    const handleToggleHelpful = () => {
        toggleHelpfulMutation.mutate();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getUserInitials = (name?: string) => {
        if (!name) return 'A';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div 
            className={cn(
                'border rounded-lg p-4 space-y-3',
                className
            )}
            data-testid={testId}
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={review.user_name || 'User'} />
                        <AvatarFallback>
                            {getUserInitials(review.user_name)}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                                {review.user_name || 'Anonymous'}
                            </span>
                            {review.is_verified_purchase && (
                                <Badge variant="secondary" className="text-xs">
                                    Verified Purchase
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <RatingStars rating={review.rating} size="sm" />
                            <span className="text-xs text-muted-foreground">
                                {formatDate(review.created_at)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions Menu */}
                {showActions && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {isOwnReview && (
                                <>
                                    <DropdownMenuItem onClick={() => onEdit?.(review)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Review
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => onDelete?.(review.id)}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Review
                                    </DropdownMenuItem>
                                </>
                            )}
                            {!isOwnReview && (
                                <DropdownMenuItem onClick={() => onFlag?.(review.id)}>
                                    <Flag className="h-4 w-4 mr-2" />
                                    Report Review
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Review Content */}
            <div className="space-y-2">
                <h4 className="font-medium text-sm">{review.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.content}
                </p>
            </div>

            {/* Media Gallery */}
            {review.media && review.media.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {review.media.map((media) => (
                        <div key={media.id} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                            {media.media_type === 'image' ? (
                                <img
                                    src={media.file}
                                    alt={media.caption || 'Review image'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                    src={media.file}
                                    className="w-full h-full object-cover"
                                    controls
                                />
                            )}
                            {media.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                                    {media.caption}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Helpful Votes */}
            <div className="flex items-center justify-between pt-2 border-t">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleHelpful}
                    disabled={toggleHelpfulMutation.isPending}
                    className={cn(
                        'gap-2 text-xs',
                        hasVotedHelpful && 'text-primary'
                    )}
                >
                    <ThumbsUp className={cn('h-3 w-3', hasVotedHelpful && 'fill-current')} />
                    Helpful ({review.helpful_count})
                </Button>

                {review.is_flagged && (
                    <Badge variant="destructive" className="text-xs">
                        Flagged
                    </Badge>
                )}
            </div>
        </div>
    );
}
