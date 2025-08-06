import { Location } from './location';
import { Mechanic } from './mechanic';

// Chat types based on API documentation
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

// API Request/Response types based on documentation
export interface ChatbotRequest {
    prompt: string;
}

export interface ChatbotResponse {
    response: {
        raw_response: string;
        formatted_response: string;
    };
}

// Legacy types for backward compatibility
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

export interface VehicleInfo {
    make?: string;
    model?: string;
    year?: number;
    issue?: string;
} 