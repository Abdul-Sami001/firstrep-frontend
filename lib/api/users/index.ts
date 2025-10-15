// lib/api/users/index.ts
import { api } from '../client';

// Types based on your Django backend
export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    date_joined: string;
}

export interface UserProfile {
    id: number;
    user: User;
    phone?: string;
    date_of_birth?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    avatar?: string;
    created_at: string;
    updated_at: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

export interface AuthResponse {
    access: string; // Only access token, refresh is in httpOnly cookie
}

export interface ProfileUpdateRequest {
    phone?: string;
    date_of_birth?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirmRequest {
    uid: string;
    token: string;
    password: string;
}

// API Methods matching your Django URLs
export const usersApi = {
    // Authentication
    login: (data: LoginRequest) =>
        api.post<AuthResponse>('/auth/token/', data),

    register: (data: RegisterRequest) =>
        api.post<{ detail: string }>('/auth/register/', data),

    logout: () =>
        api.post<{ detail: string }>('/auth/logout/'),

    refreshToken: () =>
        api.post<{ access: string }>('/auth/token/refresh/'),

    verifyToken: (token: string) =>
        api.post('/auth/token/verify/', { token }),

    // User profile
    getCurrentUser: () =>
        api.get<User>('/auth/me/'),

    getProfile: () =>
        api.get<UserProfile>('/auth/profile/'),

    updateProfile: (data: ProfileUpdateRequest) =>
        api.patch<UserProfile>('/auth/profile/', data),

    // Email verification
    verifyEmail: (uid: string, token: string) =>
        api.get<{ detail: string }>(`/auth/verify-email/?uid=${uid}&token=${token}`),

    // Password reset
    requestPasswordReset: (data: PasswordResetRequest) =>
        api.post<{ detail: string }>('/password-reset/', data),

    confirmPasswordReset: (data: PasswordResetConfirmRequest) =>
        api.post<{ detail: string }>('/password-reset-confirm/', data),
};