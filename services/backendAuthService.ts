import { API_CONFIG, ENDPOINTS, HTTP_STATUS } from '@/constants/api';
import { BackendAuthError, BackendAuthUser, BackendLoginRequest, BackendRegisterRequest, LoginResponse, RegisterResponse } from '@/types/auth';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';
import { generateUniqueUsernameFromEmail } from '@/utils/usernameGenerator';
import AsyncStorage from '@react-native-async-storage/async-storage';

class BackendAuthService {
  private baseURL = API_CONFIG.BACKEND_BASE_URL;

  /**
   * Register a new user with the backend
   */
  async register(email: string, password: string, displayName: string, role: string = 'customer', username?: string): Promise<RegisterResponse> {
      const finalUsername = username || generateUniqueUsernameFromEmail(email);

      const requestData: BackendRegisterRequest = {
        username: finalUsername,
        email,
        password,
        role
      };

      const response = await fetchWithTimeout(`${this.baseURL}${ENDPOINTS.USER_REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // Add ngrok header
        },
        body: JSON.stringify(requestData),
      }, 10000); // 10 second timeout for auth requests

      const data = await response.json();

      if (!response.ok) {
        throw this.handleBackendError(response.status, data);
      }

      const responseData = data.data || data;
      const userData = responseData.user || data.user || data;
      const tokens = responseData.tokens || data.tokens || {};

    const userObj = {
          id: userData.id || 0,
          username: userData.username || finalUsername,
          email: userData.email || email,
          role: userData.role || role
    };

    // Store auth data including user info
    await this.storeAuthData(userObj.username, userObj.email);
    await this.storeUserData(userObj);

    return {
      user: userObj,
        token: tokens.access || data.token || data.access_token || '',
        message: data.responseMessage || data.message || 'Registration successful'
      };
  }

  /**
   * Login user with the backend
   */
  async login(usernameOrEmail: string, password: string): Promise<LoginResponse> {
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

      const url = `${this.baseURL}${ENDPOINTS.USER_LOGIN}`;
      console.log(`BackendAuthService - Making login request to: ${url}`);
      console.log(`BackendAuthService - Request data:`, requestData);
      
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // Add ngrok header
        },
        body: JSON.stringify(requestData),
      }, 10000); // 10 second timeout for auth requests

      console.log(`BackendAuthService - Login response status: ${response.status}`);
      console.log(`BackendAuthService - Login response headers:`, Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log(`BackendAuthService - Login response data:`, data);

      if (!response.ok) {
        console.error(`BackendAuthService - Login failed with status ${response.status}:`, data);
        throw this.handleBackendError(response.status, data);
      }

      const responseData = data.data || data;
      const userData = responseData.user || data.user || data;
      const tokens = responseData.tokens || data.tokens || {};
      
    const userObj = {
      id: userData.id || 0,
      username: userData.username || username,
      email: userData.email || usernameOrEmail,
      role: userData.role || 'customer'
    };

    // Store auth data including user info
    await this.storeAuthData(userObj.username, userObj.email);
    await this.storeUserData(userObj);

      return {
      user: userObj,
        token: tokens.access || data.token || data.access_token || '',
        message: data.responseMessage || data.message || 'Login successful'
      };
  }

  /**
   * Store authentication token
   */
  async storeToken(token: string): Promise<void> {
      await AsyncStorage.setItem('auth_token', token);
  }

  /**
   * Get stored authentication token
   */
  async getToken(): Promise<string | null> {
      return await AsyncStorage.getItem('auth_token');
  }

  /**
   * Remove stored authentication token
   */
  async removeToken(): Promise<void> {
      await AsyncStorage.removeItem('auth_token');
  }

  /**
   * Store auth data (username and email)
   */
  private async storeAuthData(username: string, email: string): Promise<void> {
      await AsyncStorage.multiSet([
        ['auth_username', username],
        ['auth_email', email],
        [`auth_username_${email}`, username]
      ]);
  }

  /**
   * Store user data
   */
  async storeUserData(user: BackendAuthUser): Promise<void> {
    await AsyncStorage.setItem('auth_user_data', JSON.stringify(user));
  }

  /**
   * Get stored user data
   */
  async getUserData(): Promise<BackendAuthUser | null> {
    try {
      const userData = await AsyncStorage.getItem('auth_user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Get stored username for a specific email
   */
  private async getStoredUsernameForEmail(email: string): Promise<string | null> {
      return await AsyncStorage.getItem(`auth_username_${email}`);
  }

  /**
   * Clear all stored auth data
   */
  async clearStoredData(): Promise<void> {
      const keys = await AsyncStorage.getAllKeys();
      const authKeys = keys.filter(key => 
        key.startsWith('auth_') || 
        key.startsWith('auth_username_') || 
        key.startsWith('auth_email')
      );
      
      if (authKeys.length > 0) {
        await AsyncStorage.multiRemove(authKeys);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
      const token = await this.getToken();
      return token !== null;
  }

  /**
   * Handle backend error responses
   */
  private handleBackendError(status: number, data: any): BackendAuthError {
    let message = 'An error occurred';

    if (data.responseMessage) {
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
          } else {
            message = 'Invalid request data';
          }
          break;
        case HTTP_STATUS.UNAUTHORIZED:
          message = 'Invalid credentials';
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