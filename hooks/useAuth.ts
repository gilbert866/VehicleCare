import { authService } from '@/services/authService';
import { AuthCredentials, AuthState, User } from '@/types/auth';
import { useCallback, useEffect, useState } from 'react';

// Helper function to convert AuthUser to User
const convertAuthUserToUser = (authUser: any): User | null => {
    if (!authUser) return null;
    return {
        id: authUser.uid || authUser.id?.toString() || '0',
        name: authUser.displayName || authUser.username || authUser.email || 'User',
        email: authUser.email || '',
    };
};

export interface UseAuthReturn {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (credentials: AuthCredentials) => Promise<void>;
    register: (credentials: AuthCredentials) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        loading: true,
        error: null,
    });

    const updateState = useCallback((updates: Partial<AuthState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const login = useCallback(async (credentials: AuthCredentials) => {
        try {
            updateState({ loading: true, error: null });
            const authUser = await authService.signIn(credentials.email, credentials.password);
            const user = convertAuthUserToUser(authUser);
            updateState({ 
                user, 
                isAuthenticated: true, 
                loading: false 
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            updateState({ 
                error: errorMessage, 
                loading: false 
            });
        }
    }, [updateState]);

    const register = useCallback(async (credentials: AuthCredentials) => {
        try {
            updateState({ loading: true, error: null });
            const authUser = await authService.signUp(
                credentials.email, 
                credentials.password, 
                credentials.name || credentials.email, 
                credentials.email
            );
            const user = convertAuthUserToUser(authUser);
            updateState({ 
                user, 
                isAuthenticated: true, 
                loading: false 
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            updateState({ 
                error: errorMessage, 
                loading: false 
            });
        }
    }, [updateState]);

    const logout = useCallback(async () => {
        try {
            updateState({ loading: true });
            await authService.signOut();
            updateState({ 
                user: null, 
                isAuthenticated: false, 
                loading: false 
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Logout failed';
            updateState({ 
                error: errorMessage, 
                loading: false 
            });
        }
    }, [updateState]);

    const clearError = useCallback(() => {
        updateState({ error: null });
    }, [updateState]);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authUser = authService.getCurrentUser();
                const user = convertAuthUserToUser(authUser);
                updateState({ 
                    user, 
                    isAuthenticated: !!user, 
                    loading: false 
                });
            } catch (error) {
                updateState({ 
                    user: null, 
                    isAuthenticated: false, 
                    loading: false 
                });
            }
        };

        checkAuth();
    }, [updateState]);

    return {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        login,
        register,
        logout,
        clearError,
    };
}; 