import { API_CONFIG, ENDPOINTS } from '@/constants/api';
import { MechanicError, NearbyMechanicsResponse } from '@/types/mechanic';

class MechanicService {
  private baseURL = API_CONFIG.BACKEND_BASE_URL;

  /**
   * Get nearby mechanics based on latitude and longitude
   */
  async getNearbyMechanics(lat: number, lon: number, page: number = 1): Promise<NearbyMechanicsResponse> {
    try {
      const url = `${this.baseURL}${ENDPOINTS.MECHANIC_FINDER}?lat=${lat}&lon=${lon}&page=${page}`;
      
      console.log('Fetching nearby mechanics:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw this.handleError(response.status, data);
      }

      console.log('Nearby mechanics response:', data);

      // Handle the nested response structure if needed
      const responseData = data.data || data;

      return {
        mechanics: responseData.mechanics || [],
        page: responseData.page || page,
        total_pages: responseData.total_pages || 1
      };
    } catch (error: any) {
      console.error('Error fetching nearby mechanics:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch nearby mechanics. Please try again.');
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
          message = 'No mechanics found in this area';
          break;
        case 500:
          message = 'Server error. Please try again later';
          break;
        default:
          message = 'Failed to fetch nearby mechanics';
      }
    }

    return {
      message,
      status
    };
  }
}

export const mechanicService = new MechanicService();
export default mechanicService; 