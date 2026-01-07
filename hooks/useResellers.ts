// hooks/useResellers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import resellersApi, {
  CommissionListParams,
  MarketingAsset,
  PaginatedResponse,
  ResellerAnalyticsOverview,
  ResellerCommission,
  ResellerProfile,
  Storefront,
  StorefrontProduct,
  UpdateProfilePayload,
} from '@/lib/api/resellers';
import { QUERY_KEYS } from '@/lib/utils/constants';
import { useToast } from './use-toast';

const DEFAULT_QUERY_CONFIG = {
  staleTime: 2 * 60 * 1000,
  cacheTime: 5 * 60 * 1000,
  retry: 1,
  refetchOnWindowFocus: false,
};

export const useResellerProfile = (enabled: boolean = true) =>
  useQuery({
    queryKey: QUERY_KEYS.RESELLERS.ME,
    queryFn: resellersApi.getMe,
    enabled,
    ...DEFAULT_QUERY_CONFIG,
  });

export const useUpdateResellerProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => resellersApi.updateProfile(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.RESELLERS.ME, data);
      toast({
        title: 'Profile updated',
        description: 'Your reseller profile was updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error?.response?.data?.detail || 'Could not update profile.',
        variant: 'destructive',
      });
    },
  });
};

export const useResellerAnalytics = () =>
  useQuery({
    queryKey: QUERY_KEYS.RESELLERS.ANALYTICS,
    queryFn: resellersApi.getAnalyticsOverview,
    ...DEFAULT_QUERY_CONFIG,
  });

export const useResellerCommissions = (params?: CommissionListParams) =>
  useQuery({
    queryKey: QUERY_KEYS.RESELLERS.COMMISSIONS(params),
    queryFn: () => resellersApi.getCommissions(params),
    ...DEFAULT_QUERY_CONFIG,
  });

export const useResellerCommissionSummary = () =>
  useQuery({
    queryKey: QUERY_KEYS.RESELLERS.COMMISSION_SUMMARY,
    queryFn: resellersApi.getCommissionSummary,
    ...DEFAULT_QUERY_CONFIG,
  });

export const useResellerStorefronts = () =>
  useQuery({
    queryKey: QUERY_KEYS.RESELLERS.STOREFRONTS,
    queryFn: resellersApi.getStorefronts,
    ...DEFAULT_QUERY_CONFIG,
  });

export const useResellerStorefrontProducts = (storefrontId: string, enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.RESELLERS.STOREFRONT_PRODUCTS(storefrontId),
    queryFn: () => resellersApi.getStorefrontProducts(storefrontId),
    enabled,
    ...DEFAULT_QUERY_CONFIG,
  });

export const useResellerMarketingAssets = () =>
  useQuery({
    queryKey: QUERY_KEYS.RESELLERS.MARKETING_ASSETS,
    queryFn: resellersApi.getMarketingAssets,
    ...DEFAULT_QUERY_CONFIG,
  });

export const useResellerMarketingAsset = (id: string, enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.RESELLERS.MARKETING_ASSET(id),
    queryFn: () => resellersApi.getMarketingAsset(id),
    enabled,
    ...DEFAULT_QUERY_CONFIG,
  });

// Convenience types for consumers
export type {
  ResellerProfile,
  ResellerAnalyticsOverview,
  ResellerCommission,
  PaginatedResponse,
  Storefront,
  StorefrontProduct,
  MarketingAsset,
};

