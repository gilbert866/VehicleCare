// Chat types
export interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp?: number;
}

export interface ChatState {
    messages: Message[];
    loading: boolean;
    error: string | null;
    isTyping: boolean;
}

export interface ChatRequest {
    message: string;
    userId?: string;
    context?: {
        location?: Location;
        vehicleInfo?: VehicleInfo;
    };
}

export interface ChatResponse {
    message: string;
    suggestions?: string[];
    mechanicRecommendations?: Mechanic[];
}

// Re-export types for convenience
export interface Location {
    latitude: number;
    longitude: number;
}

export interface VehicleInfo {
    make?: string;
    model?: string;
    year?: number;
    issue?: string;
}

export interface Mechanic {
    id: number;
    shop_name: string;
    latitude: number;
    longitude: number;
    distance_km: number;
} 