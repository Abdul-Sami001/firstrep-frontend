// components/reseller/dialogs/BulkAddProductsDialog.tsx
"use client";

import { useState, useMemo } from "react";
import { Search, Loader2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkAddStorefrontProducts } from "@/hooks/useResellers";
import { useProducts, useCategories } from "@/hooks/useProducts";
import type { ProductFilters } from "@/lib/api/products";
import { formatCurrency } from "@/lib/utils/formatters";
import { mutedText } from "../utils";

interface BulkAddProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storefrontId: string | null;
  onSuccess?: () => void;
}

export default function BulkAddProductsDialog({ open, onOpenChange, storefrontId, onSuccess }: BulkAddProductsDialogProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [ordering, setOrdering] = useState<ProductFilters['ordering']>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  
  const bulkAddProductsMutation = useBulkAddStorefrontProducts();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData || [];
  
  const { data: productsData, isLoading: loadingProducts } = useProducts({
    is_active: true,
    search: searchQuery || undefined,
    category__slug: categoryFilter || undefined,
    ordering: ordering,
    page_size: 50,
  });
  
  const availableProducts = productsData?.results || [];

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const selectAllProducts = () => {
    setSelectedProducts(new Set(availableProducts.map(p => p.id)));
  };

  const deselectAllProducts = () => {
    setSelectedProducts(new Set());
  };

  const handleSubmit = () => {
    if (!storefrontId || selectedProducts.size === 0) return;
    bulkAddProductsMutation.mutate(
      { storefrontId, product_ids: Array.from(selectedProducts) },
      {
        onSuccess: () => {
          setSelectedProducts(new Set());
          setSearchQuery("");
          setOrdering(undefined);
          setCategoryFilter("");
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  const handleClose = () => {
    setSelectedProducts(new Set());
    setSearchQuery("");
    setOrdering(undefined);
    setCategoryFilter("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0b0b0f] border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Products to Storefront</DialogTitle>
          <DialogDescription className="text-gray-400">
            Search and select products to add to your storefront.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#0f172a] border-gray-700 text-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm text-gray-400">Category</Label>
              <Select
                value={categoryFilter || "all"}
                onValueChange={(v) => setCategoryFilter(v === "all" ? "" : v)}
              >
                <SelectTrigger className="bg-[#0f172a] border-gray-700 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-400">Sort By</Label>
              <Select
                value={ordering || "title"}
                onValueChange={(v) => {
                  if (v === "title") {
                    setOrdering(undefined);
                  } else {
                    setOrdering(v as ProductFilters['ordering']);
                  }
                }}
              >
                <SelectTrigger className="bg-[#0f172a] border-gray-700 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="-title">Title (Z-A)</SelectItem>
                  <SelectItem value="price">Price (Low to High)</SelectItem>
                  <SelectItem value="-price">Price (High to Low)</SelectItem>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="-popularity">Least Popular</SelectItem>
                  <SelectItem value="created_at">Newest First</SelectItem>
                  <SelectItem value="-created_at">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {selectedProducts.size} product(s) selected
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectAllProducts}
                className="border-gray-700 text-white"
              >
                Select All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={deselectAllProducts}
                className="border-gray-700 text-white"
              >
                Deselect All
              </Button>
            </div>
          </div>
          <div className="border border-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto bg-[#0f172a]">
            {loadingProducts ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : availableProducts.length === 0 ? (
              <p className={mutedText}>No products found.</p>
            ) : (
              <div className="space-y-2">
                {availableProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-800 hover:bg-[#0b0b0f]"
                  >
                    <Checkbox
                      checked={selectedProducts.has(product.id)}
                      onCheckedChange={() => toggleProductSelection(product.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{product.title}</p>
                      <p className="text-xs text-gray-400">
                        {formatCurrency(product.current_price)} {product.currency}
                      </p>
                    </div>
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0].image}
                        alt={product.images[0].alt_text}
                        className="w-12 h-12 object-cover rounded border border-gray-800"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-700 text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={bulkAddProductsMutation.isPending || selectedProducts.size === 0}
              className="bg-[#00bfff] text-black hover:bg-[#00a8e6]"
            >
              {bulkAddProductsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add {selectedProducts.size > 0 && `${selectedProducts.size} `}Product{selectedProducts.size !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
