import { API_CONFIG, ENDPOINTS } from '@/constants/api';
import { Place, PlacesApiResponse } from '@/types';
import axios from 'axios';

class PlacesService {
    private baseUrl = API_CONFIG.GOOGLE_PLACES_BASE_URL;
    private apiKey = API_CONFIG.GOOGLE_PLACES_API_KEY;

    async searchNearbyPlaces(
        latitude: number,
        longitude: number,
        query: string
    ): Promise<Place[]> {
        try {
            const url = `${this.baseUrl}${ENDPOINTS.PLACES_NEARBY_SEARCH}`;
            const params = {
                location: `${latitude},${longitude}`,
                radius: API_CONFIG.SEARCH_RADIUS,
                keyword: query,
                key: this.apiKey,
            };

            const response = await axios.get<PlacesApiResponse>(url, { params });
            
            if (response.data.status === 'OK') {
                return response.data.results;
            } else {
                throw new Error(`Places API error: ${response.data.status}`);
            }
        } catch (error) {
            console.error('Places API error:', error);
            throw error;
        }
    }

    async searchPlacesByQuery(
        latitude: number,
        longitude: number,
        query: string
    ): Promise<Place[]> {
        return this.searchNearbyPlaces(latitude, longitude, query);
    }
}

export const placesService = new PlacesService(); 