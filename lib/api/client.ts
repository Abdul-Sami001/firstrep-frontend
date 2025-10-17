// lib/api/client.ts - Fixed version
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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
const API_TIMEOUT = 5000; // Reduced to 5s for better UX

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
        // Track performance
        const duration = Date.now() - (response.config.metadata?.startTime || Date.now());
        if (duration > 500) {
            console.warn(`Slow API call: ${response.config.url} took ${duration}ms`);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
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
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                }
                return Promise.reject(refreshError);
            }
        }

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