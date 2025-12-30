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
        <Command className="bg-[#000000] text-white">
          <CommandInput
            placeholder="Search products..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="bg-[#000000] text-white placeholder:text-gray-500 border-b border-gray-800 focus:border-[#00bfff] h-14 text-base [&_svg]:text-gray-500"
          />
          <CommandList className="max-h-[400px] overflow-y-auto">
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
                <CommandGroup 
                  heading={`Found ${products.length} product${products.length !== 1 ? 's' : ''}`}
                  className="[&_[cmdk-group-heading]]:text-gray-400 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:font-semibold"
                >
                  {products.slice(0, 8).map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.id}
                      onSelect={() => handleSelectProduct(product.id)}
                      className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-900 data-[selected='true']:bg-gray-900 data-[selected='true']:text-white"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-800">
                        <Image
                          src={product.images?.[0]?.image || '/placeholder-product.jpg'}
                          alt={product.images?.[0]?.alt_text || product.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {product.category?.name || 'Uncategorized'}
                        </p>
                        <p className="text-sm font-semibold text-[#00bfff] mt-1">
                          {product.currency || '$'}{typeof product.price === 'number' ? product.price.toFixed(2) : (product.price ? Number(product.price).toFixed(2) : '0.00')}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                {products.length > 8 && (
                  <div className="border-t border-gray-800 p-4">
                    <button
                      onClick={handleViewAll}
                      className="w-full text-center text-sm text-[#00bfff] hover:text-white font-medium transition-colors"
                    >
                      View all {products.length} results →
                    </button>
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

