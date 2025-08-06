# VehicleCare Architecture

This document outlines the backend-focused architecture that uses backend endpoints and authentication types, plus essential device services.

## Directory Structure

```
VehicleCare/
├── types/           # Backend TypeScript interfaces and device types
├── services/        # Backend API services and device services
├── hooks/           # Custom React hooks for backend and device state management
├── utils/           # Utility functions and helpers
├── constants/       # API configuration and constants
├── components/      # Reusable UI components
├── screens/         # Screen components (UI only)
└── styles/          # Styling utilities
```

## Architecture Principles

### 1. Backend Services
All backend services integrate directly with backend API endpoints:

- `backendAuthService`: User authentication with JWT tokens
- `chatService`: AI chat functionality with backend integration
- `mechanicService`: Mechanic finder using backend API

### 2. Device Services
Essential device functionality services:

- `locationService`: User's current location from device GPS (no backend needed)

### 3. Custom Hooks
Hooks manage state and coordinate between services and UI:

- `useAuth`: Authentication state management with backend
- `useChat`: Chat state and message handling
- `useLocation`: User's current location state management
- `useMechanics`: Mechanic shop data management

### 4. Type Safety
All data structures use appropriate TypeScript interfaces:

**Backend Types:**
- `BackendAuthUser`: User authentication data
- `BackendLoginRequest`/`BackendRegisterRequest`: Authentication requests
- `LoginResponse`/`RegisterResponse`: Authentication responses
- `Message`: Chat message structure
- `Mechanic`: Mechanic shop information

**Device Types:**
- `Location`: User's GPS coordinates and map region

## Backend API Endpoints

### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login

### Services
- `GET /api/mechanicFinder/nearby-mechanics/` - Find nearby mechanics
- `POST /api/chatbot/chat/` - Chat with AI assistant

## Usage Examples

### Using Backend Services
```typescript
import { backendAuthService } from '@/services';

const response = await backendAuthService.login(username, password);
```

### Using Device Services
```typescript
import { locationService } from '@/services';

const location = await locationService.getCurrentLocation();
```

### Using Custom Hooks
```typescript
import { useAuth, useLocation } from '@/hooks';

const { signIn, signUp, user, isAuthenticated } = useAuth();
const { location, getCurrentLocation } = useLocation();
```

## Benefits

1. **Hybrid Architecture**: Backend services for data, device services for local functionality
2. **Direct API Integration**: No unnecessary wrapper layers for backend calls
3. **Device Integration**: Direct access to device GPS without backend dependency
4. **Type Safety**: Full TypeScript support with appropriate interfaces
5. **Maintainability**: Clear separation between backend and device concerns
6. **Scalability**: Easy to add new backend endpoints or device services following established patterns 