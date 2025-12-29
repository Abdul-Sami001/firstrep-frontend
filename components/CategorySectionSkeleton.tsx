// components/CategorySectionSkeleton.tsx - Dark Theme
import { Skeleton } from '@/components/ui/skeleton';

export default function CategorySectionSkeleton() {
  return (
    <section className="bg-[#000000] py-12 md:py-16 lg:py-20">
      <div className="mobile-container tablet-container desktop-container">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          {/* Text Content Skeleton */}
          <div className="flex-1 space-y-6 md:space-y-8">
            <Skeleton className="h-4 w-24 bg-gray-800" />
            <Skeleton className="h-12 w-64 bg-gray-800" />
            <Skeleton className="h-6 w-full max-w-2xl bg-gray-800" />
            <Skeleton className="h-6 w-3/4 max-w-2xl bg-gray-800" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 bg-gray-800" />
              <Skeleton className="h-12 w-32 bg-gray-800" />
            </div>
          </div>

          {/* Image Skeleton */}
          <div className="flex-1 w-full">
            <Skeleton className="aspect-[4/3] md:aspect-[16/10] lg:aspect-square w-full rounded-lg bg-gray-800" />
          </div>
        </div>
      </div>
    </section>
  );
}

