// lib/utils/constants.ts
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/token/',
        REGISTER: '/auth/register/',
        LOGOUT: '/auth/logout/',
        REFRESH: '/auth/token/refresh/',
        VERIFY_TOKEN: '/auth/token/verify/',
        ME: '/auth/me/',
        PROFILE: '/auth/profile/',
        VERIFY_EMAIL: '/auth/verify-email/',
    },
    PASSWORD_RESET: {
        REQUEST: '/password-reset/',
        CONFIRM: '/password-reset-confirm/',
    },
    PRODUCTS: {
        LIST: '/products/',
        DETAIL: (id: string) => `/products/${id}/`,
        SEARCH: '/products/search/',
        FEATURED: '/products/featured/',
        RELATED: (id: string) => `/products/${id}/related/`,
    },
    CART: {
        GET: '/cart/',
        ADD_ITEM: '/cart/items/',
        UPDATE_ITEM: (id: string) => `/cart/items/${id}/`,
        REMOVE_ITEM: (id: string) => `/cart/items/${id}/`,
        CLEAR: '/cart/',
        COUPON: '/cart/coupon/',
    },
    ORDERS: {
        LIST: '/orders/',
        DETAIL: (id: string) => `/orders/${id}/`,
        CREATE: '/orders/',
        CANCEL: (id: string) => `/orders/${id}/cancel/`,
        TRACK: (id: string) => `/orders/${id}/track/`,
    },
    PAYMENTS: {
        CREATE_INTENT: '/payments/create-intent/',
        CONFIRM: (id: string) => `/payments/${id}/confirm/`,
        METHODS: '/payments/methods/',
    },
} as const;

export const QUERY_KEYS = {
    PRODUCTS: {
        ALL: ['products'] as const,
        LIST: (filters?: any) => ['products', 'list', filters] as const,
        DETAIL: (id: string) => ['products', 'detail', id] as const,
        SEARCH: (query: string) => ['products', 'search', query] as const,
        FEATURED: ['products', 'featured'] as const,
        RELATED: (id: string) => ['products', 'related', id] as const,
    },
    CART: {
        ALL: ['cart'] as const,
        ITEMS: ['cart', 'items'] as const,
    },
    ORDERS: {
        ALL: ['orders'] as const,
        LIST: (params?: any) => ['orders', 'list', params] as const,
        DETAIL: (id: string) => ['orders', 'detail', id] as const,
    },
    USER: {
        PROFILE: ['user', 'profile'] as const,
        CURRENT: ['user', 'current'] as const,
    },
} as const;