// hooks/useResellers.ts
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import resellersApi, {
  CommissionListParams,
  CreateStorefrontPayload,
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
  staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnMount: false, // Don't refetch if data exists in cache
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
    queryFn: async () => {
      const data = await resellersApi.getStorefronts();
      // Handle both array and paginated response
      if (Array.isArray(data)) {
        return data;
      }
      // If it's a paginated response, return the results array
      if (data && typeof data === 'object' && 'results' in data) {
        const paginatedData = data as { results: Storefront[] };
        if (Array.isArray(paginatedData.results)) {
          return paginatedData.results;
        }
      }
      // Fallback to empty array
      return [];
    },
    ...DEFAULT_QUERY_CONFIG,
  });

export const useResellerStorefrontProducts = (storefrontId: string, enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.RESELLERS.STOREFRONT_PRODUCTS(storefrontId),
    queryFn: async () => {
      const data = await resellersApi.getStorefrontProducts(storefrontId);
      // Ensure we always return an array
      if (Array.isArray(data)) {
        return data;
      }
      // Handle paginated response if needed
      if (data && typeof data === 'object' && 'results' in data) {
        const paginatedData = data as { results: StorefrontProduct[] };
        if (Array.isArray(paginatedData.results)) {
          return paginatedData.results;
        }
      }
      // Fallback to empty array
      return [];
    },
    enabled,
    ...DEFAULT_QUERY_CONFIG,
  });

export const useResellerMarketingAssets = () =>
  useQuery({
    queryKey: QUERY_KEYS.RESELLERS.MARKETING_ASSETS,
    queryFn: async () => {
      const data = await resellersApi.getMarketingAssets();
      // Handle both array and paginated response
      if (Array.isArray(data)) {
        return data;
      }
      // If it's a paginated response, return the results array
      if (data && typeof data === 'object' && 'results' in data) {
        const paginatedData = data as { results: MarketingAsset[] };
        if (Array.isArray(paginatedData.results)) {
          return paginatedData.results;
        }
      }
      // Fallback to empty array
      return [];
    },
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
  
  const query = useQuery<ResellerApplication>({
    queryKey: QUERY_KEYS.RESELLERS.APPLICATION,
    queryFn: resellersApi.getMyApplication,
    enabled,
    ...DEFAULT_QUERY_CONFIG,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (no application exists)
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  // Handle errors separately using useEffect
  useEffect(() => {
    if (query.error && (query.error as any)?.response?.status !== 404) {
      toast({
        title: 'Failed to load application',
        description: (query.error as any)?.response?.data?.detail || 'Could not load application status.',
        variant: 'destructive',
      });
    }
  }, [query.error, toast]);

  return query;
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

export const useCreateStorefront = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateStorefrontPayload) => resellersApi.createStorefront(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESELLERS.STOREFRONTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESELLERS.ANALYTICS });
      toast({
        title: 'Storefront created',
        description: 'Your storefront has been created successfully.',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message || 
                          error?.response?.data?.slug?.[0] ||
                          error?.response?.data?.non_field_errors?.[0] ||
                          'Failed to create storefront. Please try again.';
      toast({
        title: 'Creation failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateStorefront = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Storefront> }) => 
      resellersApi.updateStorefront(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESELLERS.STOREFRONTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESELLERS.ANALYTICS });
      // Optionally update the specific storefront in cache
      queryClient.setQueryData([QUERY_KEYS.RESELLERS.STOREFRONTS], (old: Storefront[] | undefined) => {
        if (!old) return old;
        return old.map(sf => sf.id === variables.id ? data : sf);
      });
      toast({
        title: 'Storefront updated',
        description: 'Your storefront has been updated successfully.',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message || 
                          error?.response?.data?.slug?.[0] ||
                          error?.response?.data?.non_field_errors?.[0] ||
                          'Failed to update storefront. Please try again.';
      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

export const useBulkAddStorefrontProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ storefrontId, product_ids }: { storefrontId: string; product_ids: string[] }) =>
      resellersApi.bulkAddStorefrontProducts(storefrontId, product_ids),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.RESELLERS.STOREFRONT_PRODUCTS(variables.storefrontId) 
      });
      toast({
        title: 'Products added',
        description: `Successfully added ${variables.product_ids.length} product(s) to the storefront.`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message ||
                          'Failed to add products. Please try again.';
      toast({
        title: 'Add failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

export const useRemoveStorefrontProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ storefrontId, productId }: { storefrontId: string; productId: string }) =>
      resellersApi.removeStorefrontProduct(storefrontId, productId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.RESELLERS.STOREFRONT_PRODUCTS(variables.storefrontId) 
      });
      toast({
        title: 'Product removed',
        description: 'The product has been removed from the storefront.',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message ||
                          'Failed to remove product. Please try again.';
      toast({
        title: 'Remove failed',
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

