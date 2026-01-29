// hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, LoginRequest, RegisterRequest, ProfileUpdateRequest, PasswordResetRequest, PasswordResetConfirmRequest } from '@/lib/api/users';
import { QUERY_KEYS } from '@/lib/utils/constants';
import { useToast } from '@/hooks/use-toast';

// Performance-optimized query configuration
const QUERY_CONFIG = {
    staleTime: 5 * 60 * 1000,        // 5 minutes
    cacheTime: 10 * 60 * 1000,       // 10 minutes
    retry: 2,                        // Reduced retries for speed
    retryDelay: 1000,                // 1 second delay
    refetchOnWindowFocus: false,     // Prevent unnecessary refetches
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: LoginRequest) => usersApi.login(data),
        onSuccess: (response) => {
            // Store access token
            if (typeof window !== 'undefined') {
                localStorage.setItem('access_token', response.access);
                // Dispatch custom event to notify AuthContext
                window.dispatchEvent(new Event('auth-token-changed'));
            }

            // Invalidate user queries
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.CURRENT });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.PROFILE });
            
            // Invalidate cart and wishlist queries to refresh navbar data
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });

            toast({
                title: "Welcome back!",
                description: "You have been logged in successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Login failed",
                description: error.response?.data?.detail || "Invalid email or password",
                variant: "destructive",
            });
        },
    });
};

export const useRegister = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: RegisterRequest) => usersApi.register(data),
        onSuccess: () => {
            toast({
                title: "Account created!",
                description: "Please check your email to verify your account.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Registration failed",
                description: error.response?.data?.detail || "Failed to create account",
                variant: "destructive",
            });
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: usersApi.logout,
        onSuccess: () => {
            // Clear access token
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                // Dispatch custom event to notify AuthContext
                window.dispatchEvent(new Event('auth-token-changed'));
            }
            // Clear all queries and refetch cart/wishlist to show empty state
            queryClient.clear();
            // Refetch cart and wishlist to ensure they show empty state
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });

            toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
            });
        },
        onError: () => {
            // Even if logout fails on backend, clear local state
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                // Dispatch custom event to notify AuthContext
                window.dispatchEvent(new Event('auth-token-changed'));
            }
            queryClient.clear();
            // Refetch cart and wishlist to ensure they show empty state
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
        },
    });
};

export const useCurrentUser = (enabled: boolean = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.USER.CURRENT,
        queryFn: usersApi.getCurrentUser,
        enabled,
        ...QUERY_CONFIG,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 2;
        },
    });
};

export const useUserProfile = (enabled: boolean = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.USER.PROFILE,
        queryFn: usersApi.getProfile,
        enabled,
        ...QUERY_CONFIG,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 2;
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: ProfileUpdateRequest) => usersApi.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.PROFILE });
            toast({
                title: "Profile updated",
                description: "Your profile has been updated successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Update failed",
                description: error.response?.data?.detail || "Failed to update profile",
                variant: "destructive",
            });
        },
    });
};

export const useVerifyEmail = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ uid, token }: { uid: string; token: string }) =>
            usersApi.verifyEmail(uid, token),
        onSuccess: () => {
            toast({
                title: "Email verified!",
                description: "Your email has been verified successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Verification failed",
                description: error.response?.data?.detail || "Invalid or expired verification link",
                variant: "destructive",
            });
        },
    });
};

export const usePasswordReset = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: PasswordResetRequest) => usersApi.requestPasswordReset(data),
        onSuccess: () => {
            toast({
                title: "Reset link sent",
                description: "Please check your email for password reset instructions.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Reset failed",
                description: error.response?.data?.detail || "Failed to send reset link",
                variant: "destructive",
            });
        },
    });
};

export const usePasswordResetConfirm = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: PasswordResetConfirmRequest) => usersApi.confirmPasswordReset(data),
        onSuccess: () => {
            toast({
                title: "Password reset!",
                description: "Your password has been reset successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Reset failed",
                description: error.response?.data?.detail || "Invalid or expired reset link",
                variant: "destructive",
            });
        },
    });
};