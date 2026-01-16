"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchProducts } from '@/hooks/useProducts';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  
  const { data, isLoading, isError } = useSearchProducts(debouncedQuery);

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open]);

  const handleSelectProduct = (productId: string) => {
    onOpenChange(false);
    router.push(`/product/${productId}`);
  };

  const handleViewAll = () => {
    onOpenChange(false);
    router.push(`/shop-clean?search=${encodeURIComponent(debouncedQuery)}`);
  };

  const products = data?.results || [];
  const hasResults = products.length > 0;
  const showResults = debouncedQuery.length > 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 bg-[#000000] border-gray-800 max-w-2xl">
        <DialogTitle className="sr-only">Search Products</DialogTitle>
        <Command 
          className="bg-[#000000] text-white"
          shouldFilter={false}
        >
          <CommandInput
            placeholder="Search products..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="bg-[#000000] text-white placeholder:text-gray-500 border-b border-gray-800 focus:border-[#00bfff] h-14 text-base [&_svg]:text-gray-500"
          />
          <CommandList className="max-h-[500px] overflow-y-auto">
            {!showResults ? (
              <CommandEmpty className="py-8 text-center text-gray-400">
                <p className="text-sm">Type at least 3 characters to search</p>
              </CommandEmpty>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#00bfff]" />
              </div>
            ) : isError ? (
              <CommandEmpty className="py-8 text-center text-gray-400">
                <p className="text-sm">Error loading results. Please try again.</p>
              </CommandEmpty>
            ) : !hasResults ? (
              <CommandEmpty className="py-8 text-center text-gray-400">
                <p className="text-sm">No products found for &quot;{debouncedQuery}&quot;</p>
              </CommandEmpty>
            ) : (
              <>
                {/* Product List - Always show when there are results */}
                <div className="px-4 pt-3 pb-2">
                  <p className="text-xs uppercase font-semibold text-gray-400">
                    {products.length} product{products.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="space-y-2 px-2 pb-2">
                  {products.slice(0, 10).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      className="flex items-center gap-4 p-4 mx-2 my-1 rounded-lg cursor-pointer hover:bg-gray-900/50 transition-colors border border-transparent hover:border-gray-800"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-800 border border-gray-700">
                        {product.images?.[0]?.image ? (
                          <Image
                            src={product.images[0].image}
                            alt={product.images[0]?.alt_text || product.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate mb-1">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-400 mb-1">
                          {product.category?.name || 'Uncategorized'}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-[#00bfff]">
                            {product.currency || '£'}{typeof product.current_price === 'number' 
                              ? product.current_price.toFixed(2) 
                              : (product.current_price 
                                  ? Number(product.current_price).toFixed(2) 
                                  : (product.retail_price 
                                      ? Number(product.retail_price).toFixed(2) 
                                      : (product.price 
                                          ? Number(product.price).toFixed(2) 
                                          : '0.00')))}
                          </p>
                          {product.is_on_sale && product.retail_price && product.current_price && product.retail_price > product.current_price && (
                            <p className="text-xs text-gray-500 line-through">
                              {product.currency || '£'}{Number(product.retail_price).toFixed(2)}
                            </p>
                          )}
                          {product.is_on_sale && (
                            <span className="text-xs bg-red-900/30 text-red-400 border border-red-800 px-1.5 py-0.5 rounded">
                              SALE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* View All Link - Always show when there are results */}
                <div className="border-t border-gray-800 p-4 bg-gray-900/30">
                  <button
                    onClick={handleViewAll}
                    className="w-full text-center text-sm text-[#00bfff] hover:text-white font-semibold transition-colors flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-800/50"
                  >
                    <span>View all {products.length} results</span>
                    <span>→</span>
                  </button>
                </div>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

