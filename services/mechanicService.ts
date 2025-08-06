import { API_CONFIG, ENDPOINTS } from '@/constants/api';
import { MechanicError, NearbyMechanicsResponse } from '@/types/mechanic';
import { fetchWithTimeout } from '@/utils/fetchWithTimeout';

class MechanicService {
  private baseURL = API_CONFIG.BACKEND_BASE_URL;
  private readonly MECHANICS_LIMIT = API_CONFIG.MECHANICS_LIMIT;

  /**
   * Get nearby mechanics from the backend
   */
  async getNearbyMechanics(lat: number, lon: number, page: number = 1): Promise<NearbyMechanicsResponse> {
    try {
      console.log(`MechanicService - Fetching mechanics for lat=${lat.toFixed(4)}, lon=${lon.toFixed(4)}, page=${page}`);
      
      const url = `${this.baseURL}${ENDPOINTS.MECHANIC_FINDER}?lat=${lat}&lon=${lon}&page=${page}&limit=${this.MECHANICS_LIMIT}`;
      console.log(`MechanicService - Request URL: ${url}`);

      const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      }, 10000); // 10 second timeout

      console.log(`MechanicService - Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw this.handleError(response.status, errorData);
      }

      const data = await response.json();
      console.log(`MechanicService - Response received with ${Object.keys(data).length} keys`);

      // Handle different response structures
      const responseData = data.data || data;
      const mechanics = responseData.mechanics || [];

      console.log(`MechanicService - Found ${mechanics.length} mechanics`);

      return {
        mechanics,
        page: responseData.page || page,
        total_pages: responseData.total_pages || 1
      };
      
    } catch (error: any) {
      console.error(`MechanicService - Error:`, error.message);
      throw error instanceof Error ? error : new Error('Failed to fetch nearby mechanics');
    }
  }

  /**
   * Handle API errors
   */
  private handleError(status: number, data: any): MechanicError {
    let message = 'An error occurred while fetching mechanics';

    if (data.responseMessage) {
      message = data.responseMessage;
    } else if (data.message) {
      message = data.message;
    } else if (data.detail) {
      message = data.detail;
    } else {
      switch (status) {
        case 400:
          message = 'Invalid location parameters';
          break;
        case 404:
          message = 'No mechanics found in your area';
          break;
        case 500:
          message = 'Server error occurred';
          break;
        default:
          message = `Request failed with status ${status}`;
      }
    }

    return new Error(message) as MechanicError;
  }
}

export const mechanicService = new MechanicService();