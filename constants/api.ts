// API Configuration
export const API_CONFIG = {
    GOOGLE_PLACES_API_KEY: 'AIzaSyCWrJ81TE0pvadRMKxwSvNk2Ja_1oqnY6k', // TODO: Move to environment variables
    GOOGLE_PLACES_BASE_URL: 'https://maps.googleapis.com/maps/api/place',
    SEARCH_RADIUS: 5000, // meters
    SEARCH_DEBOUNCE_DELAY: 500, // milliseconds
} as const;

// API Endpoints
export const ENDPOINTS = {
    PLACES_NEARBY_SEARCH: '/nearbysearch/json',
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