// hooks/useProducts.ts - Production-Ready Hooks
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { productsApi, Product, ProductFilters } from '@/lib/api/products';
import { QUERY_KEYS } from '@/lib/utils/constants';

// Performance-optimized query options
const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const DEFAULT_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

export const useCategories = () => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTS.CATEGORIES,
        queryFn: productsApi.getCategories,
        staleTime: 30 * 60 * 1000, // 30 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
        retry: 2,
    });
};

export const useProducts = (filters?: ProductFilters & { page?: number; page_size?: number }) => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTS.LIST(filters),
        queryFn: () => productsApi.getProducts(filters),
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_CACHE_TIME,
        refetchOnWindowFocus: false,
        retry: 2,
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
        queryFn: () => productsApi.getProduct(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000, // 10 minutes for product details
        gcTime: 15 * 60 * 1000,
        retry: 2,
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