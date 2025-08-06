import { BackendAuthUser } from '@/types/auth';
import { backendAuthService } from './backendAuthService';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  username?: string;
  backendUser?: BackendAuthUser;
}

export interface AuthErrorResponse {
  code: string;
  message: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

class AuthService {
  private currentBackendUser: BackendAuthUser | null = null;

  // Sign up with email and password using backend
  async signUp(email: string, password: string, displayName: string, username: string): Promise<AuthUser> {
    try {
      // Register with backend using provided username
      const backendResponse = await backendAuthService.register(email, password, displayName, 'customer', username);

      // Store the backend user and token
      this.currentBackendUser = backendResponse.user;
      console.log('Auth service - Storing token during signup:', backendResponse.token ? 'Token exists' : 'No token');
      await backendAuthService.storeToken(backendResponse.token);

      return {
        uid: backendResponse.user?.id?.toString() || '0',
        email: email,
        displayName: displayName,
        username: backendResponse.user?.username || username,
        backendUser: backendResponse.user
      };
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Sign in with email and password using backend
  async signIn(emailOrUsername: string, password: string): Promise<AuthUser> {
    try {
      // Login with backend (can handle both email and username)
      const backendResponse = await backendAuthService.login(emailOrUsername, password);
      
      // Store the backend user and token
      this.currentBackendUser = backendResponse.user;
      console.log('Auth service - Storing token during signin:', backendResponse.token ? 'Token exists' : 'No token');
      await backendAuthService.storeToken(backendResponse.token);

      return {
        uid: backendResponse.user?.id?.toString() || '0',
        email: backendResponse.user?.email || emailOrUsername,
        displayName: backendResponse.user?.username || emailOrUsername, // Use username as display name
        username: backendResponse.user?.username || emailOrUsername,
        backendUser: backendResponse.user
      };
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Get current backend user
  getCurrentBackendUser(): BackendAuthUser | null {
    return this.currentBackendUser;
  }

  // Get user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      if (this.currentBackendUser) {
        return {
          uid: this.currentBackendUser.id?.toString() || '0',
          email: this.currentBackendUser.email || '',
          displayName: this.currentBackendUser.username || '',
          username: this.currentBackendUser.username || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
      return null;
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      // In a real implementation, you'd make an API call to update the user profile
      console.log('Update user profile:', { uid, updates });
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Check if username is available
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      return await backendAuthService.isUsernameAvailable(username);
    } catch (error: any) {
      console.error('Error checking username availability:', error);
      return false;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      // Clear backend token and stored data
      await backendAuthService.clearStoredData();
      this.currentBackendUser = null;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    if (this.currentBackendUser) {
      return {
        uid: this.currentBackendUser.id?.toString() || '0',
        email: this.currentBackendUser.email || '',
        displayName: this.currentBackendUser.username || '',
        username: this.currentBackendUser.username || '',
        backendUser: this.currentBackendUser
      };
    }
    return null;
  }

  // Listen to auth state changes (simplified for backend-only)
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    // For backend-only auth, we'll call the callback immediately with current state
    const currentUser = this.getCurrentUser();
    callback(currentUser);
    
    // Return a no-op unsubscribe function
    return () => {};
  }

  // Check if user is authenticated (backend)
  async isAuthenticated(): Promise<boolean> {
    return await backendAuthService.isAuthenticated();
  }

  // Handle auth errors
  private handleAuthError(error: any): AuthErrorResponse {
    let message = 'An error occurred during authentication';
    
    // Handle backend errors
    if (error.message && typeof error.message === 'string') {
      message = error.message;
    } else {
        message = error.message || message;
    }

    return {
      code: error.code || 'auth/unknown',
      message
    };
  }
}

export const authService = new AuthService();
export default authService; 