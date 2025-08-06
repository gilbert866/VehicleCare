// Mechanic types
import { Location } from './location';

export interface Mechanic {
    id: number;
    shop_name: string;
    latitude: number;
    longitude: number;
    distance_km?: number; // Made optional since API might not provide it
    rating?: number;
    user_ratings_total?: number;
    phone_number?: string;
    location?: string;
}

export interface MechanicState {
    mechanics: Mechanic[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    hasMorePages: boolean;
    currentLocation: Location | null;
}

export interface NearbyMechanicsResponse {
    mechanics: Mechanic[];
    page: number;
    total_pages: number;
}

export interface MechanicError {
    message: string;
    status?: number;
}

export interface MechanicFilters {
    maxDistance?: number;
    services?: string[];
    rating?: number;
}

