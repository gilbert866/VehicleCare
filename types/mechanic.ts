// Mechanic types
export interface Mechanic {
    id: number;
    shop_name: string;
    latitude: number;
    longitude: number;
    distance_km: number;
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

// Import Location type from location types
import { Location } from './location';
