// hooks/useProducts.ts - Production-Ready Hooks
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { productsApi, Product, ProductFilters } from '@/lib/api/products';
import { QUERY_KEYS } from '@/lib/utils/constants';
import { isExpectedError, logError } from '@/lib/utils/errors';

// Performance-optimized query options
const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const DEFAULT_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

export const useCategories = () => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTS.CATEGORIES,
        queryFn: async () => {
            try {
                const result = await productsApi.getCategories();
                
                // Categories endpoint returns paginated response: { next, previous, results: [...] }
                // Extract the results array
                if (result && typeof result === 'object' && 'results' in result) {
                    const results = (result as any).results;
                    if (Array.isArray(results)) {
                        return results;
                    }
                }
                
                // Fallback: if it's already an array (shouldn't happen, but handle gracefully)
                if (Array.isArray(result)) {
                    return result;
                }
                
                // Return empty array if no valid data
                return [];
            } catch (error) {
                // Categories is a public endpoint - 401 here is a real error
                // Log and re-throw to let React Query handle it properly
                logError(error, 'useCategories');
                throw error; // Re-throw so React Query can handle error state
            }
        },
        staleTime: 30 * 60 * 1000, // 30 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
        retry: (failureCount, error) => {
            // Categories is public - retry on network errors, not on 4xx
            if (error && typeof error === 'object' && 'response' in error) {
                const status = (error as any).response?.status;
                // Don't retry on client errors (4xx) except 408, 429
                if (status >= 400 && status < 500 && ![408, 429].includes(status)) {
                    return false;
                }
            }
            return failureCount < 2;
        },
        retryDelay: 1000,
    });
};

export const useProducts = (filters?: ProductFilters & { page?: number; page_size?: number }) => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTS.LIST(filters),
        queryFn: async () => {
            try {
                return await productsApi.getProducts(filters);
            } catch (error) {
                // Products is a public endpoint - 401 here is a real error
                // Log and re-throw to let React Query handle it properly
                logError(error, 'useProducts');
                throw error;
            }
        },
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_CACHE_TIME,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            // Products is public - retry on network errors, not on 4xx
            if (error && typeof error === 'object' && 'response' in error) {
                const status = (error as any).response?.status;
                // Don't retry on client errors (4xx) except 408, 429
                if (status >= 400 && status < 500 && ![408, 429].includes(status)) {
                    return false;
                }
            }
            return failureCount < 2;
        },
        retryDelay: 1000,
    });
};

// Infinite scroll for mobile performance
export const useInfiniteProducts = (filters?: ProductFilters) => {
    return useInfiniteQuery({
        queryKey: QUERY_KEYS.PRODUCTS.INFINITE(filters),
        queryFn: ({ pageParam = 1 }) =>
            productsApi.getProducts({ ...filters, page: pageParam }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.next ? allPages.length + 1 : undefined,
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_CACHE_TIME,
        retry: 2,
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTS.DETAIL(id),
        queryFn: async () => {
            try {
                return await productsApi.getProduct(id);
            } catch (error) {
                // Product detail is a public endpoint - 401 here is a real error
                logError(error, 'useProduct');
                throw error;
            }
        },
        enabled: !!id,
        staleTime: 10 * 60 * 1000, // 10 minutes for product details
        gcTime: 15 * 60 * 1000,
        retry: (failureCount, error) => {
            // Product detail is public - retry on network errors, not on 4xx
            if (error && typeof error === 'object' && 'response' in error) {
                const status = (error as any).response?.status;
                if (status >= 400 && status < 500 && ![408, 429].includes(status)) {
                    return false;
                }
            }
            return failureCount < 2;
        },
    });
};

export const useMyProducts = (params?: { page?: number; page_size?: number }) => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTS.MY(params),
        queryFn: () => productsApi.getMyProducts(params),
        staleTime: 2 * 60 * 1000, // 2 minutes for seller products
        gcTime: 5 * 60 * 1000,
        retry: 2,
    });
};

// Search products (using backend search)
export const useSearchProducts = (query: string, filters?: Omit<ProductFilters, 'search'>) => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTS.SEARCH(query, filters),
        queryFn: () => productsApi.getProducts({ ...filters, search: query }),
        enabled: !!query && query.length > 2,
        staleTime: 2 * 60 * 1000, // 2 minutes for search
        gcTime: 5 * 60 * 1000,
        retry: 1,
    });
};

// Seller mutations
export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productsApi.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.MY() });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
        },
        onError: (error) => {
            console.error('Failed to create product:', error);
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
            productsApi.updateProduct(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.DETAIL(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.MY() });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
        },
        onError: (error) => {
            console.error('Failed to update product:', error);
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productsApi.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.MY() });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
        },
        onError: (error) => {
            console.error('Failed to delete product:', error);
        },
    });
};