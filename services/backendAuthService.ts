import { API_CONFIG, ENDPOINTS, HTTP_STATUS } from '@/constants/api';
import { generateUniqueUsernameFromEmail } from '@/utils/usernameGenerator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BackendAuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  token?: string;
}

export interface BackendAuthError {
  message: string;
  status?: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  user: BackendAuthUser;
  token: string;
  message: string;
}

export interface LoginResponse {
  user: BackendAuthUser;
  token: string;
  message: string;
}

class BackendAuthService {
  private baseURL = API_CONFIG.BACKEND_BASE_URL;

  /**
   * Register a new user with the backend
   */
  async register(email: string, password: string, displayName: string, role: string = 'customer', username?: string): Promise<RegisterResponse> {
    try {
      // Use provided username or generate one from email
      const finalUsername = username || generateUniqueUsernameFromEmail(email);

      const requestData: RegisterRequest = {
        username: finalUsername,
        email,
        password,
        role
      };

      const response = await fetch(`${this.baseURL}${ENDPOINTS.USER_REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw this.handleBackendError(response.status, data);
      }

      console.log('Registration response data:', data);

      // Handle the nested response structure
      const responseData = data.data || data;
      const userData = responseData.user || data.user || data;
      const tokens = responseData.tokens || data.tokens || {};

      // Store username for future logins
      await this.storeUsername(finalUsername);
      await this.storeUsernameForEmail(email, finalUsername);
      await this.storeEmail(email);

      // Return a properly formatted response
      return {
        user: {
          id: userData.id || 0,
          username: userData.username || finalUsername,
          email: userData.email || email,
          role: userData.role || role
        },
        token: tokens.access || data.token || data.access_token || '',
        message: data.responseMessage || data.message || 'Registration successful'
      };
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Registration failed. Please try again.');
    }
  }

  /**
   * Login user with the backend using username
   */
  async login(usernameOrEmail: string, password: string): Promise<LoginResponse> {
    try {
      let username = usernameOrEmail;
      
      // If it looks like an email, try to get the stored username for that email
      if (usernameOrEmail.includes('@')) {
        const storedUsername = await this.getStoredUsernameForEmail(usernameOrEmail);
        if (storedUsername) {
          username = storedUsername;
        } else {
          // If no stored username found, try using the email prefix as username
          username = usernameOrEmail.split('@')[0];
        }
      }

      const requestData: LoginRequest = {
        username,
        password
      };

      const response = await fetch(`${this.baseURL}${ENDPOINTS.USER_LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw this.handleBackendError(response.status, data);
      }

      console.log('Login response data:', data);

      // Handle the nested response structure
      const responseData = data.data || data;
      const userData = responseData.user || data.user || data;
      const tokens = responseData.tokens || data.tokens || {};
      
      const userEmail = userData.email || usernameOrEmail;
      const userUsername = userData.username || username;

      // Store username and email for future reference
      await this.storeUsername(userUsername);
      await this.storeEmail(userEmail);

      // Return a properly formatted response
      return {
        user: {
          id: userData.id || 0,
          username: userUsername,
          email: userEmail,
          role: userData.role || 'customer'
        },
        token: tokens.access || data.token || data.access_token || '',
        message: data.responseMessage || data.message || 'Login successful'
      };
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed. Please try again.');
    }
  }

  /**
   * Store authentication token
   */
  async storeToken(token: string): Promise<void> {
    try {
      console.log('Backend auth service - Storing token:', token ? 'Token exists' : 'No token');
      await AsyncStorage.setItem('auth_token', token);
      console.log('Backend auth service - Token stored successfully');
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  /**
   * Get stored authentication token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Remove stored authentication token
   */
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  /**
   * Store username for future logins
   */
  private async storeUsername(username: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_username', username);
    } catch (error) {
      console.error('Error storing username:', error);
    }
  }

  /**
   * Store username associated with email for future logins
   */
  private async storeUsernameForEmail(email: string, username: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`auth_username_${email}`, username);
    } catch (error) {
      console.error('Error storing username for email:', error);
    }
  }

  /**
   * Get stored username
   */
  async getStoredUsername(email?: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_username');
    } catch (error) {
      console.error('Error getting stored username:', error);
      return null;
    }
  }

  /**
   * Get stored username for a specific email
   */
  private async getStoredUsernameForEmail(email: string): Promise<string | null> {
    try {
      const storedUsername = await AsyncStorage.getItem(`auth_username_${email}`);
      return storedUsername;
    } catch (error) {
      console.error('Error getting stored username for email:', error);
      return null;
    }
  }

  /**
   * Store email for future reference
   */
  private async storeEmail(email: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_email', email);
    } catch (error) {
      console.error('Error storing email:', error);
    }
  }

  /**
   * Get stored email
   */
  async getStoredEmail(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_email');
    } catch (error) {
      console.error('Error getting stored email:', error);
      return null;
    }
  }

  /**
   * Clear all stored auth data
   */
  async clearStoredData(): Promise<void> {
    try {
      // Get all keys and filter for auth-related ones
      const keys = await AsyncStorage.getAllKeys();
      const authKeys = keys.filter(key => 
        key.startsWith('auth_') || 
        key.startsWith('auth_username_') || 
        key.startsWith('auth_email')
      );
      
      if (authKeys.length > 0) {
        await AsyncStorage.multiRemove(authKeys);
      }
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return token !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Check if username is available
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      // This would require a backend endpoint to check username availability
      // For now, we'll assume it's available
      return true;
    } catch (error: any) {
      console.error('Error checking username availability:', error);
      return false;
    }
  }

  /**
   * Validate username format
   */
  validateUsernameFormat(username: string): { isValid: boolean; error?: string } {
    if (!username || username.trim().length === 0) {
      return { isValid: false, error: 'Username cannot be empty' };
    }
    
    if (username.length < 3) {
      return { isValid: false, error: 'Username must be at least 3 characters long' };
    }
    
    if (username.length > 30) {
      return { isValid: false, error: 'Username cannot exceed 30 characters' };
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
    }
    
    if (!/^[a-zA-Z0-9]/.test(username)) {
      return { isValid: false, error: 'Username must start with a letter or number' };
    }
    
    return { isValid: true };
  }

  /**
   * Handle backend error responses
   */
  private handleBackendError(status: number, data: any): BackendAuthError {
    let message = 'An error occurred';

    // Handle the specific backend response format
    if (data.responseCode && data.responseMessage) {
      message = data.responseMessage;
    } else if (data.message) {
      message = data.message;
    } else if (data.detail) {
      message = data.detail;
    } else {
      // Fallback to status-based messages
      switch (status) {
        case HTTP_STATUS.BAD_REQUEST:
          if (data.username) {
            message = `Username error: ${data.username.join(', ')}`;
          } else if (data.email) {
            message = `Email error: ${data.email.join(', ')}`;
          } else if (data.password) {
            message = `Password error: ${data.password.join(', ')}`;
          } else if (data.non_field_errors) {
            message = data.non_field_errors.join(', ');
          } else {
            message = 'Invalid request data';
          }
          break;
        case HTTP_STATUS.UNAUTHORIZED:
          message = 'Invalid credentials';
          break;
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          message = 'Server error. Please try again later';
          break;
        default:
          message = 'An unexpected error occurred';
      }
    }

    return {
      message,
      status
    };
  }
}

export const backendAuthService = new BackendAuthService();
export default backendAuthService; 