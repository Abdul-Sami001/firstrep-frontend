// lib/api/users/index.ts
import { api } from '../client';

// Types matching your Django backend
export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    date_joined: string;
    last_login?: string;
}

export interface UserProfile {
    id: string;
    user: string;
    phone_number?: string;
    date_of_birth?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    avatar?: string;
    preferences?: {
        newsletter: boolean;
        sms_notifications: boolean;
        email_notifications: boolean;
    };
}

export interface AuthResponse {
    access: string;
    refresh?: string; // Not returned due to httpOnly cookie
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

export interface ProfileUpdateRequest {
    phone_number?: string;
    date_of_birth?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    avatar?: string;
    preferences?: {
        newsletter?: boolean;
        sms_notifications?: boolean;
        email_notifications?: boolean;
    };
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirmRequest {
    uid: string;
    token: string;
    password: string;
}

// API Methods - Production Ready
export const usersApi = {
    // Authentication
    login: (data: LoginRequest): Promise<AuthResponse> =>
        api.post<AuthResponse>('/auth/token/', data),

    register: (data: RegisterRequest): Promise<{ detail: string }> =>
        api.post<{ detail: string }>('/auth/register/', data),

    logout: (): Promise<{ detail: string }> =>
        api.post<{ detail: string }>('/auth/logout/', {}),

    refreshToken: (): Promise<{ access: string }> =>
        api.post<{ access: string }>('/auth/token/refresh/', {}),

    verifyToken: (token: string): Promise<{ detail: string }> =>
        api.post<{ detail: string }>('/auth/token/verify/', { token }),

    // User profile
    getCurrentUser: (): Promise<User> =>
        api.get<User>('/auth/me/'),

    getProfile: (): Promise<UserProfile> =>
        api.get<UserProfile>('/auth/profile/'),

    updateProfile: (data: ProfileUpdateRequest): Promise<UserProfile> =>
        api.patch<UserProfile>('/auth/profile/', data),

    // Email verification
    verifyEmail: (uid: string, token: string): Promise<{ detail: string }> =>
        api.get<{ detail: string }>(`/auth/verify-email/?uid=${uid}&token=${token}`),

    // Password reset
    requestPasswordReset: (data: PasswordResetRequest): Promise<{ detail: string }> =>
        api.post<{ detail: string }>('/password-reset/', data),

    confirmPasswordReset: (data: PasswordResetConfirmRequest): Promise<{ detail: string }> =>
        api.post<{ detail: string }>('/password-reset-confirm/', data),
};