import { backendAuthService } from '@/services/backendAuthService';
import { BackendAuthUser } from '@/types/auth';
import { useCallback, useEffect, useState } from 'react';

export interface UseAuthReturn {
    user: BackendAuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    signIn: (emailOrUsername: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string, username: string) => Promise<void>;
    signOut: () => Promise<void>;
    clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<BackendAuthUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const signIn = useCallback(async (emailOrUsername: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await backendAuthService.login(emailOrUsername, password);
            await backendAuthService.storeToken(response.token);
            setUser(response.user);
            setIsAuthenticated(true);
            console.log('useAuth - Sign in successful, user:', response.user);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setError(errorMessage);
            console.error('useAuth - Sign in error:', errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const signUp = useCallback(async (email: string, password: string, displayName: string, username: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await backendAuthService.register(email, password, displayName, 'customer', username);
            await backendAuthService.storeToken(response.token);
            setUser(response.user);
            setIsAuthenticated(true);
            console.log('useAuth - Sign up successful, user:', response.user);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            setError(errorMessage);
            console.error('useAuth - Sign up error:', errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            setLoading(true);
            await backendAuthService.clearStoredData();
            setUser(null);
            setIsAuthenticated(false);
            console.log('useAuth - Sign out successful');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Logout failed';
            setError(errorMessage);
            console.error('useAuth - Sign out error:', errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log('useAuth - Checking authentication status...');
                const isAuth = await backendAuthService.isAuthenticated();
                console.log('useAuth - Is authenticated:', isAuth);
                
                if (isAuth) {
                    // Try to get stored user data
                    const userData = await backendAuthService.getUserData();
                    if (userData) {
                        setUser(userData);
                        setIsAuthenticated(true);
                        console.log('useAuth - User restored from stored data:', userData);
                    } else {
                        // If no user data but token exists, create minimal user
                        const token = await backendAuthService.getToken();
                        if (token) {
                            const minimalUser: BackendAuthUser = {
                                id: 0,
                                username: 'user',
                                email: 'user@example.com',
                                role: 'customer'
                            };
                            setUser(minimalUser);
                            setIsAuthenticated(true);
                            console.log('useAuth - User restored from token with minimal data');
                        } else {
                            setIsAuthenticated(false);
                            setUser(null);
                        }
                    }
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                    console.log('useAuth - No valid authentication found');
                }
            } catch (error) {
                console.error('useAuth - Error checking authentication:', error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
                console.log('useAuth - Authentication check complete');
            }
        };

        checkAuth();
    }, []);

    return {
        user,
        isAuthenticated,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        clearError,
    };
}; 