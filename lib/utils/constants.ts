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
    MARKETING: {
        LOYALTY: {
            ACCOUNT: '/marketing/loyalty/account/',
            TRANSACTIONS: '/marketing/loyalty/transactions/',
            REDEEM: '/marketing/loyalty/redeem/',
        },
        REFERRALS: {
            LIST: '/marketing/referrals/',
            MY_CODE: '/marketing/referrals/my-code/',
        },
        GIFT_CARDS: {
            LIST: '/marketing/gift-cards/',
            DETAIL: (id: string) => `/marketing/gift-cards/${id}/`,
            REDEEM: (id: string) => `/marketing/gift-cards/${id}/redeem/`,
        },
    },
} as const;

// lib/utils/constants.ts - Updated Query Keys
export const QUERY_KEYS = {
    PRODUCTS: {
        ALL: ['products'] as const,
        LIST: (filters?: any) => ['products', 'list', filters] as const,
        INFINITE: (filters?: any) => ['products', 'infinite', filters] as const,
        DETAIL: (id: string) => ['products', 'detail', id] as const,
        SEARCH: (query: string, filters?: any) => ['products', 'search', query, filters] as const,
        CATEGORIES: ['products', 'categories'] as const,
        MY: (params?: any) => ['products', 'my', params] as const,
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
    REVIEWS: {
        ALL: ['reviews'] as const,
        LIST: (filters?: any) => ['reviews', 'list', filters] as const,
        DETAIL: (id: string) => ['reviews', 'detail', id] as const,
        PRODUCT: (productId: string, filters?: any) => ['reviews', 'product', productId, filters] as const,
        MY: () => ['reviews', 'my'] as const,
        STATS: (productId: string) => ['reviews', 'stats', productId] as const,
    },
    WISHLIST: {
        ALL: ['wishlist'] as const,
        ITEMS: ['wishlist', 'items'] as const,
        CHECK: (productId: string) => ['wishlist', 'check', productId] as const,
    },
    RESELLERS: {
        ME: ['resellers', 'me'] as const,
        ANALYTICS: ['resellers', 'analytics', 'overview'] as const,
        COMMISSIONS: (params?: any) => ['resellers', 'commissions', params] as const,
        COMMISSION_SUMMARY: ['resellers', 'commissions', 'summary'] as const,
        STOREFRONTS: ['resellers', 'storefronts'] as const,
        STOREFRONT_PRODUCTS: (storefrontId: string) => ['resellers', 'storefronts', storefrontId, 'products'] as const,
        MARKETING_ASSETS: ['resellers', 'marketing-assets'] as const,
        MARKETING_ASSET: (id: string) => ['resellers', 'marketing-assets', id] as const,
        APPLICATION: ['resellers', 'application'] as const,
    },
    MARKETING: {
        LOYALTY: {
            ACCOUNT: ['marketing', 'loyalty', 'account'] as const,
            TRANSACTIONS: (params?: any) => ['marketing', 'loyalty', 'transactions', params] as const,
        },
        REFERRALS: {
            MY_CODE: ['marketing', 'referrals', 'my-code'] as const,
            LIST: (params?: any) => ['marketing', 'referrals', 'list', params] as const,
        },
        GIFT_CARDS: {
            LIST: (params?: any) => ['marketing', 'gift-cards', 'list', params] as const,
            DETAIL: (id: string) => ['marketing', 'gift-cards', 'detail', id] as const,
            BY_CODE: (code: string) => ['marketing', 'gift-cards', 'by-code', code] as const,
        },
        PROMOTIONS: {
            ACTIVE: ['marketing', 'promotions', 'active'] as const,
        },
    },
    SUPPORT: {
        TICKETS: (params?: any) => ['support', 'tickets', params] as const,
        TICKET: (id: string) => ['support', 'ticket', id] as const,
        MESSAGES: (ticketId: string, params?: any) => ['support', 'messages', ticketId, params] as const,
        EVENTS: (ticketId: string) => ['support', 'events', ticketId] as const,
    },
} as const;