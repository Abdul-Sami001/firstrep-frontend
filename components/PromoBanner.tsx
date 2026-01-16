// components/PromoBanner.tsx
'use client';
import { X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useActivePromotions } from '@/hooks/useMarketing';

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { data: promotionsData, isLoading } = useActivePromotions();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Active promotions are already filtered by backend, just use them directly
  const activePromotions = useMemo(() => {
    if (!promotionsData || !Array.isArray(promotionsData)) return [];
    return promotionsData;
  }, [promotionsData]);

  // Format promotion text using discount_display from backend
  const formatPromoText = (promotion: any): string => {
    // Use discount_display if available (pre-formatted by backend)
    const discountText = promotion.discount_display || 
      (promotion.promotion_type === 'percentage' 
        ? `${promotion.discount_value}% off`
        : promotion.promotion_type === 'fixed'
        ? `£${promotion.discount_value} off`
        : 'Free shipping');
    
    const minPurchaseText = promotion.min_purchase_amount && Number(promotion.min_purchase_amount) > 0
      ? ` on orders over £${Number(promotion.min_purchase_amount).toFixed(2)}`
      : '';
    
    return `${promotion.name}${promotion.description ? ` - ${promotion.description}` : ''}. Use code ${promotion.code} for ${discountText}${minPurchaseText}.`;
  };

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

  // Don't show if no promotions, still loading, or user closed it
  if (!isVisible || isLoading || activePromotions.length === 0) return null;

  // Combine all promotion texts
  const promoTexts = activePromotions.map(formatPromoText).join(' • ');

  return (
    <div className="bg-[#000000] text-white py-2 px-4 text-sm relative overflow-hidden border-b border-gray-800" suppressHydrationWarning>
      <div className="flex items-center justify-center">
        <div className="flex animate-promo-scroll whitespace-nowrap">
          {/* Repeat text multiple times for seamless scroll */}
          {[...Array(4)].map((_, i) => (
            <span key={i} className="inline-block mr-8">
              {promoTexts} •
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