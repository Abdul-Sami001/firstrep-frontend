// lib/utils/formatters.ts
import { Product, SaleInfo } from '@/lib/api/products';

// Price utility functions for new pricing system
export const priceUtils = {
    /**
     * Get the display price for a product (current_price if on sale, otherwise retail_price)
     * Falls back to legacy price field for backward compatibility
     */
    getDisplayPrice: (product: Product | any): number => {
        if (product?.current_price != null) return Number(product.current_price);
        if (product?.retail_price != null) return Number(product.retail_price);
        if (product?.price != null) return Number(product.price);
        return 0;
    },

    /**
     * Get the retail/base price for a product
     * Falls back to legacy price field for backward compatibility
     */
    getRetailPrice: (product: Product | any): number => {
        if (product?.retail_price != null) return Number(product.retail_price);
        if (product?.price != null) return Number(product.price);
        return 0;
    },

    /**
     * Check if product is on sale
     */
    isOnSale: (product: Product | any): boolean => {
        return product?.is_on_sale === true;
    },

    /**
     * Get sale info if available
     */
    getSaleInfo: (product: Product | any): SaleInfo | null => {
        return product?.sale_info || null;
    },

    /**
     * Format price with currency symbol
     */
    formatPriceWithCurrency: (price: number, currency: string = 'GBP'): string => {
        const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency;
        return `${symbol}${Number(price).toFixed(2)}`;
    },
};

export const formatters = {
    // Price formatting
    formatPrice: (price: number, currency: string = 'GBP'): string => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency,
        }).format(price);
    },
    
    // Currency formatting (alias for formatPrice)
    formatCurrency: (price: number, currency: string = 'GBP'): string => {
        return formatters.formatPrice(price, currency);
    },

    // Date formatting
    formatDate: (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options,
        }).format(dateObj);
    },

    // Relative time
    formatRelativeTime: (date: string | Date): string => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return formatters.formatDate(dateObj);
    },

    // Text formatting
    truncateText: (text: string, maxLength: number): string => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    },

    // Slug generation
    generateSlug: (text: string): string => {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    // Phone formatting
    formatPhone: (phone: string): string => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    },
};

// Named exports for convenience
export const formatCurrency = formatters.formatCurrency;
export const formatPrice = formatters.formatPrice;
export const formatDate = formatters.formatDate;

// Price utility exports
export const getDisplayPrice = priceUtils.getDisplayPrice;
export const getRetailPrice = priceUtils.getRetailPrice;
export const isOnSale = priceUtils.isOnSale;
export const getSaleInfo = priceUtils.getSaleInfo;
export const formatPriceWithCurrency = priceUtils.formatPriceWithCurrency;