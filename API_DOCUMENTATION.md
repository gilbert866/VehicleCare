# VehicleCare API Documentation

## Overview
The VehicleCare API provides endpoints for mechanic finding, user management, battery optimization predictions, and AI-powered vehicle assistance. The API is built with Django REST Framework and uses JWT authentication.

## Base URL
```
http://127.0.0.1:8000
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 1. User Management

### 1.1 Register Customer
**Endpoint:** `POST /api/users/register/`

**Description:** Register a new customer account

**Request Body:**
```json
{
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "customer"
}
```

**Response:**
```json
{
    "responseCode": "000",
    "responseMessage": "Customer account created successfully",
    "data": {
        "user": {
            "username": "string",
            "email": "string",
            "role": "customer"
        },
        "tokens": {
            "refresh": "string",
            "access": "string"
        }
    }
}
```

**Error Responses:**
- `400` - Missing required fields, Username already taken, Email already registered
- `403` - Only customers can register via this endpoint
- `500` - User creation failed

### 1.2 Login Customer
**Endpoint:** `POST /api/users/login/`

**Description:** Authenticate a customer and receive JWT tokens

**Request Body:**
```json
{
    "username": "string",
    "password": "string"
}
```

**Response:**
```json
{
    "responseCode": "000",
    "responseMessage": "Login successful",
    "data": {
        "user": {
            "username": "string",
            "email": "string",
            "role": "customer"
        },
        "tokens": {
            "refresh": "string",
            "access": "string"
        }
    }
}
```

**Error Responses:**
- `400` - Invalid password
- `403` - Only customers can log in
- `404` - User does not exist

---

## 2. Mechanic Finder

### 2.1 Get Nearby Mechanics
**Endpoint:** `GET /api/mechanicFinder/nearby-mechanics/`

**Description:** Find nearby mechanics based on user location. Returns results from Google Maps API with fallback to local database.

**Query Parameters:**
- `lat` (required): User latitude (float)
- `lon` (required): User longitude (float)
- `limit` (optional): Maximum number of Google results (default: 5)
- `page` (optional): Page number for local database results (default: 1)

**Example Request:**
```
GET /api/mechanicFinder/nearby-mechanics/?lat=5.62&lon=-0.19&limit=10
```

**Response (Google Maps Results):**
```json
{
    "mechanics": [
        {
            "shop_name": "Joe's Auto Repair",
            "phone_number": "+1-555-0123",
            "location": "123 Main St, City, State",
            "latitude": 5.6205,
            "longitude": -0.1898,
            "distance_km": null,
            "rating": 4.5,
            "user_ratings_total": 127,
            "source": "Google Maps"
        }
    ],
    "source": "google_maps",
    "google_limit": 10
}
```

**Response (Local Database Results):**
```json
{
    "mechanics": [
        {
            "shop_name": "Local Auto Shop",
            "phone_number": "+1-555-0456",
            "location": "456 Oak Ave, City, State",
            "latitude": 5.6210,
            "longitude": -0.1900,
            "distance_km": 1.32,
            "rating": null,
            "user_ratings_total": null,
            "source": "local_database"
        }
    ],
    "source": "local_database",
    "page": 1,
    "total_local_pages": 3
}
```

**Error Responses:**
- `400` - Invalid or missing 'lat' and 'lon' parameters

---

## 3. Battery Optimization

### 3.1 Predict Battery Information
**Endpoint:** `POST /api/predict/`

**Description:** Predict battery health and charging duration class based on EV model and charging duration.

**Request Body:**
```json
{
    "EV Model": "Model A",
    "Charging Duration (min)": 180
}
```

**Response:**
```json
{
    "EV Model": "Model A",
    "Charging Duration (min)": 180,
    "Battery Health": "Good",
    "Charging Duration Class": "Normal",
    "Recommendation": "Your battery health is good. Consider using normal charging mode for optimal battery life."
}
```

**Error Responses:**
- `400` - Missing required fields ("EV Model" or "Charging Duration (min)")
- `500` - Prediction error

**Available EV Models:**
The system supports various EV models from the training dataset. Contact the API provider for the complete list of supported models.

---

## 4. AI Chatbot

### 4.1 Chat with AI Assistant
**Endpoint:** `POST /chatbot/chat/`

**Description:** Get AI-powered assistance for vehicle-related questions using Google's Gemini AI.

**Request Body:**
```json
{
    "prompt": "my car is overheating. what do i do?"
}
```

**Response:**
```json
{
    "response": "If your car is overheating, here are the immediate steps you should take..."
}
```

**Error Responses:**
- `400` - Prompt is required

---

## Response Codes

### User Management Response Codes
- `000` - Success
- `001` - Invalid password
- `002` - User does not exist
- `003` - Username already taken
- `004` - Email already registered
- `005` - Missing required fields
- `006` - Only customers can register/login
- `007` - User creation failed

---

## Data Models

### Mechanic
```json
{
    "shop_name": "string",
    "phone_number": "string (optional)",
    "location": "string (optional)",
    "latitude": "float",
    "longitude": "float",
    "distance_km": "float (optional)",
    "rating": "float (optional)",
    "user_ratings_total": "integer (optional)",
    "source": "string"
}
```

### User
```json
{
    "username": "string",
    "email": "string",
    "role": "customer"
}
```

### Battery Prediction
```json
{
    "EV Model": "string",
    "Charging Duration (min)": "integer",
    "Battery Health": "string",
    "Charging Duration Class": "string",
    "Recommendation": "string"
}
```

---

## Rate Limiting
Currently, no rate limiting is implemented. Please use the API responsibly.

## Error Handling
All endpoints return appropriate HTTP status codes and error messages in JSON format. Check the response body for detailed error information.

## Testing
You can use the provided `api-test.rest` file with REST Client extensions to test the API endpoints.

---

## Notes
- The mechanic finder uses Google Maps API as the primary source with a 10km radius search
- Battery optimization predictions are based on machine learning models trained on EV charging data
- The chatbot uses Google's Gemini AI for vehicle-related assistance
- JWT tokens should be refreshed using the refresh token when the access token expires 