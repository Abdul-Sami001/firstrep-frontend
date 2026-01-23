// components/reseller/types.ts - Shared types for reseller components
import { Storefront } from "@/hooks/useResellers";
import { StorefrontType } from "@/lib/api/resellers";

export interface StorefrontFormData {
  name?: string;
  slug?: string;
  type?: StorefrontType;
  address_line1?: string;
  city?: string;
  country?: string;
  notes?: string;
  commission_rate_override?: string | number;
  is_active?: boolean;
}

export interface BulkAddProductsState {
  storefrontId: string | null;
  selectedProducts: Set<string>;
  searchQuery: string;
  categoryFilter: string;
  ordering: string | undefined;
}

export interface StorefrontDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface EditStorefrontDialogProps extends StorefrontDialogProps {
  storefront: Storefront | null;
}
