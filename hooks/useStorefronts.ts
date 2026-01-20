// hooks/useStorefronts.ts - Public Storefront Hooks
import { useQuery } from '@tanstack/react-query';
import { storefrontsApi, PublicStorefront, StorefrontProductsParams, StorefrontSharing } from '@/lib/api/storefronts';
import { Product, PaginatedResponse } from '@/lib/api/products';
import { QUERY_KEYS } from '@/lib/utils/constants';

const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const DEFAULT_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

export const usePublicStorefront = (slug: string, enabled = true) =>
  useQuery<PublicStorefront>({
    queryKey: ['public-storefront', slug],
    queryFn: () => storefrontsApi.getPublicStorefront(slug),
    enabled: enabled && !!slug,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (storefront not found)
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });

export const usePublicStorefrontProducts = (
  slug: string,
  params?: StorefrontProductsParams,
  enabled = true
) =>
  useQuery<PaginatedResponse<Product>>({
    queryKey: ['public-storefront-products', slug, params],
    queryFn: () => storefrontsApi.getPublicStorefrontProducts(slug, params),
    enabled: enabled && !!slug,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (storefront not found)
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });

export const useStorefrontSharing = (storefrontId: string, enabled = true) =>
  useQuery<StorefrontSharing>({
    queryKey: ['storefront-sharing', storefrontId],
    queryFn: () => storefrontsApi.getStorefrontSharing(storefrontId),
    enabled: enabled && !!storefrontId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
  });

// Convenience exports
export type { PublicStorefront, StorefrontSharing };
