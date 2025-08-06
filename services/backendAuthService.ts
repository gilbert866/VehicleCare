import { API_CONFIG, ENDPOINTS, HTTP_STATUS } from '@/constants/api';
import { BackendAuthError, BackendLoginRequest, BackendRegisterRequest, LoginResponse, RegisterResponse } from '@/types/auth';
import { generateUniqueUsernameFromEmail } from '@/utils/usernameGenerator';
import AsyncStorage from '@react-native-async-storage/async-storage';

class BackendAuthService {
  private baseURL = API_CONFIG.BACKEND_BASE_URL;

  /**
   * Register a new user with the backend
   */
  async register(email: string, password: string, displayName: string, role: string = 'customer', username?: string): Promise<RegisterResponse> {
    try {
      const finalUsername = username || generateUniqueUsernameFromEmail(email);

      const requestData: BackendRegisterRequest = {
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

      const responseData = data.data || data;
      const userData = responseData.user || data.user || data;
      const tokens = responseData.tokens || data.tokens || {};

      // Store auth data
      await this.storeAuthData(finalUsername, email);

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
   * Login user with the backend
   */
  async login(usernameOrEmail: string, password: string): Promise<LoginResponse> {
    try {
      let username = usernameOrEmail;
      
      if (usernameOrEmail.includes('@')) {
        const storedUsername = await this.getStoredUsernameForEmail(usernameOrEmail);
        if (storedUsername) {
          username = storedUsername;
        } else {
          username = usernameOrEmail.split('@')[0];
        }
      }

      const requestData: BackendLoginRequest = {
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

      const responseData = data.data || data;
      const userData = responseData.user || data.user || data;
      const tokens = responseData.tokens || data.tokens || {};
      
      const userEmail = userData.email || usernameOrEmail;
      const userUsername = userData.username || username;

      // Store auth data
      await this.storeAuthData(userUsername, userEmail);

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
   * Store auth data (username and email)
   */
  private async storeAuthData(username: string, email: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        ['auth_username', username],
        ['auth_email', email],
        [`auth_username_${email}`, username]
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  }

  /**
   * Get stored username for a specific email
   */
  private async getStoredUsernameForEmail(email: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(`auth_username_${email}`);
    } catch (error) {
      console.error('Error getting stored username for email:', error);
      return null;
    }
  }

  /**
   * Clear all stored auth data
   */
  async clearStoredData(): Promise<void> {
    try {
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
   * Check if username is available (placeholder for future implementation)
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    // TODO: Implement backend endpoint for username availability check
    return true;
  }

  /**
   * Handle backend error responses
   */
  private handleBackendError(status: number, data: any): BackendAuthError {
    let message = 'An error occurred';

    if (data.responseCode && data.responseMessage) {
      message = data.responseMessage;
    } else if (data.message) {
      message = data.message;
    } else if (data.detail) {
      message = data.detail;
    } else {
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