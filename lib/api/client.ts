// lib/api/client.ts - Production-ready with industry-standard error handling
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { UnauthorizedError, NetworkError, logError } from '@/lib/utils/errors';
import { isPublicEndpoint, isProtectedEndpoint, isGuestCapableEndpoint } from '@/lib/utils/api-endpoints';

// Extend Axios types to include metadata
declare module 'axios' {
    interface AxiosRequestConfig {
        metadata?: {
            startTime: number;
        };
    }
}

// Performance-optimized configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const API_TIMEOUT = 10000; // Reduced to 5s for better UX

// Create axios instance with performance monitoring
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor with performance tracking
apiClient.interceptors.request.use(
    (config) => {
        // Add performance tracking
        config.metadata = { startTime: Date.now() };

        // Add access token if available
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor with performance monitoring
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Track performance (only in development)
        if (process.env.NODE_ENV === 'development') {
            const duration = Date.now() - (response.config.metadata?.startTime || Date.now());
            if (duration > 500) {
                console.warn(`Slow API call: ${response.config.url} took ${duration}ms`);
            }
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const requestUrl = originalRequest?.url || '';
        // Normalize URL - handle both absolute and relative URLs
        const normalizedUrl = requestUrl.startsWith('http') 
            ? requestUrl 
            : requestUrl.startsWith('/')
            ? `${API_BASE_URL}${requestUrl}`
            : `${API_BASE_URL}/${requestUrl}`;

        // Handle 401 unauthorized - try to refresh token for authenticated requests
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Only attempt token refresh for protected endpoints
            // Public endpoints shouldn't need auth, so 401 is a real error
            if (isProtectedEndpoint(normalizedUrl) || isGuestCapableEndpoint(normalizedUrl)) {
                originalRequest._retry = true;

                try {
                    const refreshResponse = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {}, {
                        withCredentials: true,
                    });

                    const { access } = refreshResponse.data;
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('access_token', access);
                    }

                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // Clear invalid token
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('access_token');
                    }
                    
                    // For protected endpoints, 401 is expected for unauthenticated users
                    return Promise.reject(
                        new UnauthorizedError('Authentication required', error.response)
                    );
                }
            } else {
                // Public endpoint returned 401 - this is a real error, not expected
                logError(error, 'API Client - Public Endpoint 401');
                return Promise.reject(
                    new UnauthorizedError('Unexpected authentication error on public endpoint', error.response)
                );
            }
        }

        // Handle network errors
        if (!error.response) {
            logError(new NetworkError(error.message), 'API Client');
            return Promise.reject(new NetworkError(error.message));
        }

        // Log all errors (expected errors will be filtered by logError function)
        logError(error, 'API Client');

        return Promise.reject(error);
    }
);

// Generic API methods with performance optimization
export const api = {
    get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
        apiClient.get(url, config).then(res => res.data),

    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
        apiClient.post(url, data, config).then(res => res.data),

    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
        apiClient.put(url, data, config).then(res => res.data),

    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
        apiClient.patch(url, data, config).then(res => res.data),

    delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
        apiClient.delete(url, config).then(res => res.data),
};

export default apiClient;