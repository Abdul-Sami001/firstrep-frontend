// hooks/useResellers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import resellersApi, {
  CommissionListParams,
  MarketingAsset,
  PaginatedResponse,
  ResellerAnalyticsOverview,
  ResellerCommission,
  ResellerApplication,
  ResellerApplicationPayload,
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

export const useResellerApplication = (enabled = true) => {
  const { toast } = useToast();
  
  return useQuery<ResellerApplication>({
    queryKey: QUERY_KEYS.RESELLERS.APPLICATION,
    queryFn: resellersApi.getMyApplication,
    enabled,
    ...DEFAULT_QUERY_CONFIG,
    retry: false, // Don't retry on 404 (no application exists)
    onError: (error: any) => {
      // 404 is expected if no application exists, don't show error
      if (error?.response?.status !== 404) {
        toast({
          title: 'Failed to load application',
          description: error?.response?.data?.detail || 'Could not load application status.',
          variant: 'destructive',
        });
      }
    },
  });
};

export const useSubmitResellerApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: ResellerApplicationPayload) => resellersApi.submitApplication(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.RESELLERS.APPLICATION, data);
      toast({
        title: 'Application submitted',
        description: 'Your reseller application has been submitted successfully. We will review it and get back to you within 2-3 business days.',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message || 
                          error?.response?.data?.non_field_errors?.[0] ||
                          'Failed to submit application. Please try again.';
      toast({
        title: 'Application failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

// Convenience types for consumers
export type {
  ResellerProfile,
  ResellerAnalyticsOverview,
  ResellerCommission,
  ResellerApplication,
  PaginatedResponse,
  Storefront,
  StorefrontProduct,
  MarketingAsset,
};

