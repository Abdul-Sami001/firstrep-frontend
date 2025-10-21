// contexts/AuthContext.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import { User } from '@/lib/api/users';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasToken, setHasToken] = useState(false);

    // Only call useCurrentUser if we have a token
    const { data: user, isLoading, error } = useCurrentUser(hasToken);
    const logoutMutation = useLogout();

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        setHasToken(!!token);
        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        if (user) {
            setIsAuthenticated(true);
        } else if (error && !isLoading && hasToken) {
            // Only set to false if we had a token but got an error
            setIsAuthenticated(false);
            setHasToken(false);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
            }
        }
    }, [user, error, isLoading]);

    const logout = () => {
        logoutMutation.mutate();
        setIsAuthenticated(false);
        setHasToken(false);
    };

    const value: AuthContextType = {
        user: user || null,
        isLoading: hasToken ? isLoading : false,
        isAuthenticated,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};