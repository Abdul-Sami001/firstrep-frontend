// lib/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for httpOnly cookies
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
    (config) => {
        // Add access token if available (for authenticated requests)
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token using the httpOnly cookie
                const refreshResponse = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {}, {
                    withCredentials: true,
                });

                const { access } = refreshResponse.data;

                // Store new access token
                if (typeof window !== 'undefined') {
                    localStorage.setItem('access_token', access);
                }

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed - DON'T redirect automatically
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    // Remove automatic redirect - let components handle it
                }
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        if (!error.response) {
            console.error('Network error:', error.message);
        }

        return Promise.reject(error);
    }
);

// Generic API methods
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