// Message types for chat functionality
export interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
}

// Location and map related types
export interface Location {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

export interface Place {
    place_id: string;
    name: string;
    vicinity: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
}

// Authentication types
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthCredentials {
    name?: string;
    email: string;
    password: string;
}

// Battery monitoring types
export interface BatteryInfo {
    level: number | null;
    isCharging?: boolean;
    isLowPowerMode?: boolean;
}

// API response types
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export interface PlacesApiResponse {
    results: Place[];
    status: string;
} 