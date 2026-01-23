// components/reseller/dialogs/RemoveProductDialog.tsx
"use client";

import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRemoveStorefrontProduct } from "@/hooks/useResellers";

interface RemoveProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
  storefrontId: string | null;
  onSuccess?: () => void;
}

export default function RemoveProductDialog({ open, onOpenChange, productId, storefrontId, onSuccess }: RemoveProductDialogProps) {
  const removeProductMutation = useRemoveStorefrontProduct();

  const handleRemove = () => {
    if (!productId || !storefrontId) return;
    removeProductMutation.mutate(
      { storefrontId, productId },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#0b0b0f] border-gray-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Product</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Are you sure you want to remove this product from the storefront? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-700 text-white">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {removeProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
