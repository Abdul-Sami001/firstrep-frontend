// hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, LoginRequest, RegisterRequest, ProfileUpdateRequest, PasswordResetRequest, PasswordResetConfirmRequest } from '@/lib/api/users';
import { QUERY_KEYS } from '@/lib/utils/constants';
import { useToast } from '@/hooks/use-toast';

export const useLogin = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: LoginRequest) => usersApi.login(data),
        onSuccess: (response) => {
            // Store access token (refresh token is in httpOnly cookie)
            if (typeof window !== 'undefined') {
                localStorage.setItem('access_token', response.access);
            }
            // Invalidate user queries
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.CURRENT });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.PROFILE });

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
    const queryClient = useQueryClient();
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
            // Clear access token (refresh token cookie will be deleted by backend)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
            }
            // Clear all queries
            queryClient.clear();

            toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
            });
        },
        onError: () => {
            // Even if logout fails on backend, clear local state
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
            }
            queryClient.clear();
        },
    });
};

export const useCurrentUser = (enabled: boolean = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.USER.CURRENT,
        queryFn: usersApi.getCurrentUser,
        enabled, // Only fetch if enabled
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
            // Don't retry on 401 (unauthorized)
            if (error?.response?.status === 401) return false;
            return failureCount < 3;
        },
    });
};

export const useUserProfile = () => {
    return useQuery({
        queryKey: QUERY_KEYS.USER.PROFILE,
        queryFn: usersApi.getProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 3;
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