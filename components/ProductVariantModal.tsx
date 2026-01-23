// components/ProductVariantModal.tsx - Variant Selection Modal for Product Cards
'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Loader2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { ProductVariant } from '@/lib/api/products';
import { useToast } from '@/hooks/use-toast';

interface ProductVariantModalProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductVariantModal({
  productId,
  open,
  onOpenChange,
}: ProductVariantModalProps) {
  const { data: product, isLoading, error } = useProduct(productId);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Reset selected variant when modal opens/closes or product changes
  useEffect(() => {
    if (open && product?.variants?.length) {
      const active = product.variants.find(v => v?.is_active) || product.variants?.[0];
      setSelectedVariant(active || null);
    } else if (!open) {
      setSelectedVariant(null);
    }
  }, [open, product]);

  const toNum = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v || 0)));

  // Get pricing information using new pricing system
  const getDisplayPrice = () => {
    if (selectedVariant?.price_override != null) {
      return toNum(selectedVariant.price_override);
    }
    return product?.current_price ?? product?.retail_price ?? product?.price ?? 0;
  };

  const getRetailPrice = () => {
    if (selectedVariant?.price_override != null) {
      return toNum(selectedVariant.price_override);
    }
    return product?.retail_price ?? product?.price ?? 0;
  };

  const isOnSale = product?.is_on_sale ?? false;
  const saleInfo = product?.sale_info;
  const displayPrice = getDisplayPrice();
  const retailPrice = getRetailPrice();

  // Get available sizes based on selected color (if any)
  const availableSizes = useMemo(() => {
    const currentColor = (selectedVariant?.attributes as any)?.color;
    const variants = (product?.variants ?? []).filter(v => {
      if (!v.is_active) return false;
      if (currentColor) {
        return (v.attributes as any)?.color === currentColor;
      }
      return true;
    });

    return Array.from(
      new Set(
        variants
          .map(v => (v.attributes as any)?.size)
          .filter(Boolean)
      )
    );
  }, [product?.variants, selectedVariant]);

  // Get available colors based on selected size (if any)
  const availableColors = useMemo(() => {
    const currentSize = (selectedVariant?.attributes as any)?.size;
    const variants = (product?.variants ?? []).filter(v => {
      if (!v.is_active) return false;
      if (currentSize) {
        return (v.attributes as any)?.size === currentSize;
      }
      return true;
    });

    return Array.from(
      new Set(
        variants
          .map(v => (v.attributes as any)?.color)
          .filter(Boolean)
      )
    );
  }, [product?.variants, selectedVariant]);

  const primaryImage = product?.images?.find(img => img?.position === 0)?.image ||
    product?.images?.[0]?.image ||
    null;

  const handleAddToCart = () => {
    if (!product || !selectedVariant || (selectedVariant?.stock ?? 0) <= 0) {
      toast({
        title: 'Invalid Selection',
        description: 'Please select a valid variant',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingToCart(true);
    addToCart(
      product?.id || '',
      selectedVariant?.id || '',
      1
    );
    
    // Show success toast and close modal
    toast({
      title: 'Added to Cart',
      description: 'Item has been added to your cart successfully!',
    });
    
    // Reset loading state and close modal after a brief delay
    setTimeout(() => {
      setIsAddingToCart(false);
      onOpenChange(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-gray-800 text-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#00bfff]" />
            <span className="ml-3 text-gray-300">Loading product...</span>
          </div>
        ) : error || !product ? (
          <div className="text-center py-12">
            <Alert variant="destructive" className="bg-red-900/20 border-red-800">
              <AlertDescription className="text-red-300">
                Failed to load product. Please try again.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl font-bold text-white">
                {product?.title || 'Select Variant'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Choose your preferred color and size
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Product Image */}
              {primaryImage && (
                <div className="relative aspect-[3/4] w-full max-w-xs mx-auto bg-gray-900 rounded-lg overflow-hidden">
                  <Image
                    src={primaryImage}
                    alt={product?.title || 'Product image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    quality={90}
                  />
                </div>
              )}

              {/* Price */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-2xl md:text-3xl font-bold text-white">
                    {product?.currency || 'GBP'}{' '}
                    {Number(displayPrice).toFixed(2)}
                  </span>
                  {isOnSale && retailPrice > displayPrice && (
                    <span className="text-lg md:text-xl text-gray-500 line-through">
                      {product?.currency || 'GBP'}{' '}
                      {Number(retailPrice).toFixed(2)}
                    </span>
                  )}
                </div>
                {isOnSale && saleInfo && (
                  <span className="text-sm text-green-400 font-medium">
                    Save {product?.currency || 'GBP'}{' '}
                    {Number(saleInfo.discount_amount || 0).toFixed(2)}
                    {saleInfo.discount_percentage && (
                      <span> ({Number(saleInfo.discount_percentage).toFixed(0)}% off)</span>
                    )}
                  </span>
                )}
              </div>

              {/* Stock Warning */}
              {(!selectedVariant || (selectedVariant?.stock ?? 0) <= 0) && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                  <AlertDescription className="text-red-300">
                    This variant is currently out of stock.
                  </AlertDescription>
                </Alert>
              )}

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div>
                  <label className="block text-sm md:text-base font-semibold text-white mb-3">
                    Color: <span className="text-gray-300 font-normal">
                      {(selectedVariant?.attributes as any)?.color || availableColors[0]}
                    </span>
                  </label>
                  <div className="flex gap-2 md:gap-3 flex-wrap">
                    {availableColors.map(color => {
                      const currentSize = (selectedVariant?.attributes as any)?.size;
                      const variant = product?.variants?.find(
                        v => {
                          const variantColor = (v.attributes as any)?.color;
                          const variantSize = (v.attributes as any)?.size;
                          return variantColor === color &&
                            v.is_active &&
                            (!currentSize || variantSize === currentSize);
                        }
                      );
                      const isSelected = (selectedVariant?.attributes as any)?.color === color;
                      const isOutOfStock = !variant || (variant?.stock ?? 0) <= 0;

                      return (
                        <button
                          key={color}
                          onClick={() => {
                            if (variant && !isOutOfStock) {
                              setSelectedVariant(variant);
                            }
                          }}
                          disabled={isOutOfStock}
                          className={`px-4 py-2 md:px-5 md:py-2.5 border rounded-md text-sm md:text-base font-medium touch-target transition-all ${
                            isSelected
                              ? 'border-[#00bfff] bg-[#00bfff]/20 text-white'
                              : isOutOfStock
                              ? 'border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
                              : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white bg-gray-900/50'
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <div>
                  <label className="block text-sm md:text-base font-semibold text-white mb-3">
                    Size: <span className="text-gray-300 font-normal">
                      {(selectedVariant?.attributes as any)?.size || 'Select a size'}
                    </span>
                  </label>
                  <div className="flex gap-2 md:gap-3 flex-wrap">
                    {availableSizes.map(size => {
                      const currentColor = (selectedVariant?.attributes as any)?.color;
                      const variant = product?.variants?.find(
                        v => {
                          const variantColor = (v.attributes as any)?.color;
                          const variantSize = (v.attributes as any)?.size;
                          return variantSize === size &&
                            v.is_active &&
                            (!currentColor || variantColor === currentColor);
                        }
                      );
                      const isSelected = (selectedVariant?.attributes as any)?.size === size;
                      const isOutOfStock = !variant || (variant?.stock ?? 0) <= 0;

                      return (
                        <button
                          key={size}
                          onClick={() => {
                            if (!isOutOfStock && variant) {
                              setSelectedVariant(variant);
                            }
                          }}
                          disabled={isOutOfStock}
                          className={`px-4 py-2 md:px-5 md:py-2.5 border rounded-md text-sm md:text-base font-medium touch-target transition-all min-w-[50px] ${
                            isSelected
                              ? 'border-[#00bfff] bg-[#00bfff]/20 text-white'
                              : isOutOfStock
                              ? 'border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
                              : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white bg-gray-900/50'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || (selectedVariant?.stock ?? 0) <= 0 || isAddingToCart}
                  className="w-full bg-[#00bfff] hover:bg-[#0099cc] text-white font-semibold uppercase text-sm md:text-base py-4 md:py-5 px-6 md:px-8 rounded-md shadow-lg shadow-[#00bfff]/50 hover:shadow-xl hover:shadow-[#00bfff]/60 transition-all duration-300 border-0 flex items-center justify-center gap-2 disabled:bg-gray-800 disabled:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      <span>
                        {!selectedVariant || (selectedVariant?.stock ?? 0) <= 0
                          ? 'Out of Stock'
                          : 'Add to Cart'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
