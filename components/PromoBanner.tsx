// components/PromoBanner.tsx
'use client';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Render placeholder on server to match client structure
  if (!isMounted) {
    return (
      <div className="bg-[#000000] text-white py-2 px-4 text-sm relative overflow-hidden" suppressHydrationWarning>
        <div className="flex items-center justify-center">
          <div className="flex whitespace-nowrap opacity-0">
            <span className="inline-block mr-8">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isVisible) return null;

  const promoText = "Holiday Magic - Start of 2026 will see our brand new product line. Claim 15% discount on your first order when you register with us.";

  return (
    <div className="bg-[#000000] text-white py-2 px-4 text-sm relative overflow-hidden border-b border-gray-800" suppressHydrationWarning>
      <div className="flex items-center justify-center">
        <div className="flex animate-promo-scroll whitespace-nowrap">
          {/* Repeat text multiple times for seamless scroll */}
          {[...Array(4)].map((_, i) => (
            <span key={i} className="inline-block mr-8">
              {promoText} •
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 touch-target-sm hover:opacity-80 transition-opacity text-white"
        data-testid="button-close-promo"
        suppressHydrationWarning
        aria-label="Close promo banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}