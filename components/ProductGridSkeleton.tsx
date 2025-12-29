// components/ProductGridSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridSkeletonProps {
  count?: number;
  columns?: 'mobile' | 'tablet' | 'desktop';
}

export default function ProductGridSkeleton({ 
  count = 8, 
  columns = 'desktop' 
}: ProductGridSkeletonProps) {
  const gridCols = {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols.mobile} ${gridCols.tablet} ${gridCols.desktop} gap-4 md:gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[2/3] w-full rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

