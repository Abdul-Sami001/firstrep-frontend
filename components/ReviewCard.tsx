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
    productId?: string;
    className?: string;
    'data-testid'?: string;
}

export default function ReviewCard({
    review,
    onEdit,
    onDelete,
    onFlag,
    showActions = true,
    productId,
    className,
    'data-testid': testId,
}: ReviewCardProps) {
    const { user } = useAuth();
    const toggleHelpfulMutation = useToggleHelpful(review.id, productId);
    
    // Compare user IDs as strings to handle type mismatches
    // Also handle cases where user might not be loaded yet
    const currentUserId = user?.id ? String(user.id).trim() : null;
    const reviewUserId = review.user ? String(review.user).trim() : null;
    
    // If onEdit and onDelete are provided AND showActions is true, treat as own review
    // This handles cases where user ID comparison might fail due to timing or format issues
    // Also check if user IDs match as fallback
    const isOwnReview = (showActions && onEdit && onDelete) || !!(currentUserId && reviewUserId && currentUserId === reviewUserId);
    
    const hasVotedHelpful = review.helpful_votes?.some(vote => {
        const voteUserId = vote.user ? String(vote.user).trim() : null;
        return currentUserId && voteUserId && currentUserId === voteUserId;
    }) || false;

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
                'border border-gray-800 rounded-lg p-4 md:p-6 space-y-3 bg-gray-900',
                className
            )}
            data-testid={testId}
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={review.user_name || 'User'} />
                        <AvatarFallback className="bg-gray-800 text-white">
                            {getUserInitials(review.user_name)}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-white">
                                {review.user_name || 'Anonymous'}
                            </span>
                            {review.is_verified_purchase && (
                                <Badge variant="secondary" className="text-xs bg-green-900/30 text-green-400 border-green-800">
                                    Verified Purchase
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <RatingStars rating={review.rating} size="sm" />
                            <span className="text-xs text-gray-400">
                                {formatDate(review.created_at)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions Menu */}
                {showActions && (
                    <div className="flex items-center gap-2">
                        {/* If onEdit and onDelete are provided, show edit/delete buttons (user's own review) */}
                        {onEdit && onDelete ? (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(review)}
                                    className="h-8 px-3 text-gray-400 hover:text-white hover:bg-gray-800"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(review.id)}
                                    className="h-8 px-3 text-red-400 hover:text-red-300 hover:bg-gray-800"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                                    <DropdownMenuItem onClick={() => onFlag?.(review.id)} className="text-white hover:bg-gray-800">
                                        <Flag className="h-4 w-4 mr-2" />
                                        Report Review
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                )}
            </div>

            {/* Review Content */}
            <div className="space-y-2">
                <h4 className="font-medium text-sm text-white">{review.title}</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                    {review.content}
                </p>
            </div>

            {/* Media Gallery */}
            {review.media && review.media.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {review.media.map((media) => (
                        <div key={media.id} className="relative aspect-square bg-gray-800 rounded-md overflow-hidden">
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

            {/* Helpful Votes - Hide for own reviews (when onEdit/onDelete are provided) */}
            {!(onEdit && onDelete) && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleHelpful}
                        disabled={toggleHelpfulMutation.isPending}
                        className={cn(
                            'gap-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800',
                            hasVotedHelpful && 'text-[#00bfff]'
                        )}
                    >
                        <ThumbsUp className={cn('h-3 w-3', hasVotedHelpful && 'fill-current')} />
                        Helpful ({review.helpful_count})
                    </Button>

                    {review.is_flagged && (
                        <Badge variant="destructive" className="text-xs bg-red-900/30 text-red-400 border-red-800">
                            Flagged
                        </Badge>
                    )}
                </div>
            )}
            
            {/* Show flagged badge even for own reviews */}
            {(onEdit && onDelete) && review.is_flagged && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                    <Badge variant="destructive" className="text-xs bg-red-900/30 text-red-400 border-red-800">
                        Flagged
                    </Badge>
                </div>
            )}
        </div>
    );
}
