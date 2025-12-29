// components/GenderSelector.tsx - Dark Theme
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function GenderSelectorContent() {
  // Note: useSearchParams requires Suspense boundary in Next.js 13+
  // For now, we'll use a simpler approach without search params
  return (
    <div className="flex items-center justify-center gap-4 py-6 md:py-8">
      <Link href="/shop-clean?gender=men">
        <Button 
          variant="outline" 
          className="uppercase font-semibold border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-6 text-sm md:text-base"
        >
          Men
        </Button>
      </Link>
      <Link href="/shop-clean?gender=women">
        <Button 
          variant="outline" 
          className="uppercase font-semibold border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-6 text-sm md:text-base"
        >
          Women
        </Button>
      </Link>
    </div>
  );
}

export default function GenderSelector() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center gap-4 py-6 md:py-8">
        <Button 
          variant="outline" 
          className="uppercase font-semibold border-white/20 text-white disabled:opacity-50 px-8 py-6 text-sm md:text-base" 
          disabled
        >
          Men
        </Button>
        <Button 
          variant="outline" 
          className="uppercase font-semibold border-white/20 text-white disabled:opacity-50 px-8 py-6 text-sm md:text-base" 
          disabled
        >
          Women
        </Button>
      </div>
    }>
      <GenderSelectorContent />
    </Suspense>
  );
}

