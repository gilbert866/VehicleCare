// API Configuration
export const API_CONFIG = {
    SEARCH_RADIUS: 5000, // meters
    SEARCH_DEBOUNCE_DELAY: 500, // milliseconds
    BACKEND_BASE_URL: "https://fe64eed9cc88.ngrok-free.app/api",
} as const;

// API Endpoints
export const ENDPOINTS = {
    // Backend authentication endpoints
    USER_REGISTER: '/users/register/',
    USER_LOGIN: '/users/login/',
    MECHANIC_FINDER: '/mechanicFinder/nearby-mechanics/',
    // Chat assistant endpoint
    CHAT: '/chatbot/chat/',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const; 