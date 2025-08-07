// API Configuration
export const API_CONFIG = {
    SEARCH_RADIUS: 5000, // meters
    SEARCH_DEBOUNCE_DELAY: 500, // milliseconds
    BACKEND_BASE_URL: "https://27cac4014167.ngrok-free.app",
    MECHANICS_LIMIT: 10, // Number of mechanics to fetch per request
    MAX_RETRY_ATTEMPTS: 5, // Maximum retry attempts for API calls
} as const;

// API Endpoints
export const ENDPOINTS = {
    // Backend authentication endpoints
    USER_REGISTER: '/api/users/register/',
    USER_LOGIN: '/api/users/login/',
    MECHANIC_FINDER: '/api/mechanicFinder/nearby-mechanics/',
    CHAT: '/api/chatbot/chat/',
    BATTERY_PREDICT: '/api/predict/',
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