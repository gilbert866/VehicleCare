import { authService, AuthUser } from '@/services/authService';
import { useEffect, useState } from 'react';

export interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  signIn: (emailOrUsername: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUserProfile: (uid: string) => Promise<any>;
  updateUserProfile: (uid: string, updates: any) => Promise<void>;
  isAuthenticated: () => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isAuth = await authService.isAuthenticated();
        if (isAuth) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (emailOrUsername: string, password: string): Promise<void> => {
    try {
      const authUser = await authService.signIn(emailOrUsername, password);
      console.log('useAuth - signIn successful, setting user:', authUser);
      setUser(authUser);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string, username: string): Promise<void> => {
    try {
      const authUser = await authService.signUp(email, password, displayName, username);
      console.log('useAuth - signUp successful, setting user:', authUser);
      setUser(authUser);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const getUserProfile = async (uid: string) => {
    return await authService.getUserProfile(uid);
  };

  const updateUserProfile = async (uid: string, updates: any) => {
    await authService.updateUserProfile(uid, updates);
  };

  const isAuthenticated = async (): Promise<boolean> => {
    return await authService.isAuthenticated();
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    getUserProfile,
    updateUserProfile,
    isAuthenticated
  };
} 