// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, Product, ProductFilters } from '@/lib/api/products';
import { QUERY_KEYS } from '@/lib/utils/constants';

export const useProducts = (filters?: ProductFilters & { page?: number; page_size?: number }) => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTS.LIST(filters),
        queryFn: () => productsApi.getProducts(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTS.DETAIL(id),
        queryFn: () => productsApi.getProduct(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useSearchProducts = (query: string, filters?: Omit<ProductFilters, 'search'>) => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTS.SEARCH(query),
        queryFn: () => productsApi.searchProducts(query, filters),
        enabled: !!query && query.length > 2,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useFeaturedProducts = () => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTS.FEATURED,
        queryFn: productsApi.getFeaturedProducts,
        staleTime: 15 * 60 * 1000, // 15 minutes
    });
};

export const useRelatedProducts = (productId: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.PRODUCTS.RELATED(productId),
        queryFn: () => productsApi.getRelatedProducts(productId),
        enabled: !!productId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useAddProductReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, review }: { productId: string; review: { rating: number; comment: string } }) =>
            productsApi.addProductReview(productId, review),
        onSuccess: (_, { productId }) => {
            // Invalidate product details to refetch with new review
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.DETAIL(productId) });
        },
    });
};