// components/ui/responsive-image.tsx
import Image from 'next/image';
import { useState } from 'react';

interface ResponsiveImageProps {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    sizes?: string;
    quality?: number;
}

export default function ResponsiveImage({
    src,
    alt,
    className = '',
    priority = false,
    sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
    quality = 85
}: ResponsiveImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div className={`bg-muted flex items-center justify-center ${className}`}>
                <span className="text-muted-foreground text-sm">Image unavailable</span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                sizes={sizes}
                priority={priority}
                quality={quality}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
            />
        </div>
    );
}