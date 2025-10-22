// components/ReviewForm.tsx - Create/Edit Review Form Component
import React, { useState, useRef } from 'react';
import { Upload, X, Star, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import RatingStars from './RatingStars';
import { CreateReviewRequest, UpdateReviewRequest, Review } from '@/lib/api/reviews';
import { fileValidator, createPreviewUrl, revokePreviewUrl } from '@/lib/utils/fileUpload';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
    productId: string;
    productName?: string;
    initialData?: Review;
    onSubmit: (data: CreateReviewRequest | UpdateReviewRequest) => void;
    onCancel?: () => void;
    isLoading?: boolean;
    error?: string;
    className?: string;
    'data-testid'?: string;
}

interface MediaPreview {
    file: File;
    preview: string;
    type: 'image' | 'video';
}

export default function ReviewForm({
    productId,
    productName,
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    error,
    className,
    'data-testid': testId,
}: ReviewFormProps) {
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [mediaFiles, setMediaFiles] = useState<MediaPreview[]>([]);
    const [mediaToRemove, setMediaToRemove] = useState<string[]>([]);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditing = !!initialData;

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (rating === 0) {
            errors.rating = 'Please select a rating';
        }

        if (!title.trim()) {
            errors.title = 'Title is required';
        } else if (title.trim().length < 5) {
            errors.title = 'Title must be at least 5 characters';
        }

        if (!content.trim()) {
            errors.content = 'Review content is required';
        } else if (content.trim().length < 20) {
            errors.content = 'Review must be at least 20 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        
        files.forEach(file => {
            const validation = fileValidator.validateFile(file);
            if (!validation.isValid) {
                setValidationErrors(prev => ({
                    ...prev,
                    media: validation.error || 'Invalid file'
                }));
                return;
            }

            const preview = createPreviewUrl(file);
            const type = fileValidator.getFileType(file);
            
            if (type !== 'unknown') {
                setMediaFiles(prev => [...prev, {
                    file,
                    preview,
                    type: type as 'image' | 'video'
                }]);
            }
        });

        // Clear the input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeMediaFile = (index: number) => {
        const mediaToRemove = mediaFiles[index];
        revokePreviewUrl(mediaToRemove.preview);
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingMedia = (mediaId: string) => {
        setMediaToRemove(prev => [...prev, mediaId]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const submitData = {
            rating,
            title: title.trim(),
            content: content.trim(),
            media: mediaFiles.map(m => m.file),
            ...(isEditing && { remove_media: mediaToRemove })
        };

        onSubmit(submitData);
    };

    const handleCancel = () => {
        // Clean up preview URLs
        mediaFiles.forEach(media => {
            revokePreviewUrl(media.preview);
        });
        onCancel?.();
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className={cn('space-y-6', className)}
            data-testid={testId}
        >
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold">
                    {isEditing ? 'Edit Review' : 'Write a Review'}
                </h3>
                {productName && (
                    <p className="text-sm text-muted-foreground mt-1">
                        for {productName}
                    </p>
                )}
            </div>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Rating */}
            <div className="space-y-2">
                <Label htmlFor="rating">Rating *</Label>
                <div className="flex items-center gap-2">
                    <RatingStars
                        rating={rating}
                        interactive={true}
                        onChange={setRating}
                        size="lg"
                        data-testid="rating-input"
                    />
                    <span className="text-sm text-muted-foreground">
                        {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select rating'}
                    </span>
                </div>
                {validationErrors.rating && (
                    <p className="text-sm text-red-600">{validationErrors.rating}</p>
                )}
            </div>

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">Review Title *</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    maxLength={200}
                    data-testid="title-input"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{validationErrors.title}</span>
                    <span>{title.length}/200</span>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
                <Label htmlFor="content">Your Review *</Label>
                <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tell others about your experience with this product..."
                    rows={6}
                    maxLength={2000}
                    data-testid="content-input"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{validationErrors.content}</span>
                    <span>{content.length}/2000</span>
                </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-2">
                <Label>Photos/Videos (Optional)</Label>
                <div className="space-y-4">
                    {/* File Input */}
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                            Click to upload photos or videos
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Images: JPG, PNG, WebP (max 5MB) • Videos: MP4, WebM (max 50MB)
                        </p>
                    </div>
                    
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {/* Media Previews */}
                    {mediaFiles.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {mediaFiles.map((media, index) => (
                                <div key={index} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                                    {media.type === 'image' ? (
                                        <img
                                            src={media.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <video
                                            src={media.preview}
                                            className="w-full h-full object-cover"
                                            muted
                                        />
                                    )}
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-1 right-1 h-6 w-6 p-0"
                                        onClick={() => removeMediaFile(index)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Existing Media (for editing) */}
                    {initialData?.media && initialData.media.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-sm">Current Media</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {initialData.media
                                    .filter(media => !mediaToRemove.includes(media.id))
                                    .map((media) => (
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
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-1 right-1 h-6 w-6 p-0"
                                            onClick={() => removeExistingMedia(media.id)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                        {media.caption && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                                                {media.caption}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {validationErrors.media && (
                        <p className="text-sm text-red-600">{validationErrors.media}</p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="submit"
                    disabled={isLoading || rating === 0}
                    className="flex-1"
                    data-testid="submit-review"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {isEditing ? 'Updating...' : 'Submitting...'}
                        </>
                    ) : (
                        isEditing ? 'Update Review' : 'Submit Review'
                    )}
                </Button>
                
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}
