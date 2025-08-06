# VehicleCare Architecture

This document outlines the refactored architecture that separates UI and business logic for better maintainability and testability.

## Directory Structure

```
VehicleCare/
├── types/           # TypeScript interfaces and types
├── services/        # Business logic and API calls
├── hooks/           # Custom React hooks for state management
├── utils/           # Utility functions and helpers
├── constants/       # Configuration and constants
├── components/      # Reusable UI components
├── screens/         # Screen components (UI only)
└── styles/          # Styling utilities
```

## Architecture Principles

### 1. Separation of Concerns
- **UI Components**: Handle only presentation and user interactions
- **Business Logic**: Managed in services and hooks
- **Data Management**: Centralized in custom hooks
- **API Calls**: Isolated in service classes

### 2. Service Layer
Services handle external integrations and business operations:

- `batteryService`: Battery monitoring operations
- `chatService`: Chat functionality and message handling
- `locationService`: Location permissions and coordinates
- `mechanicService`: Mechanic shop data and API integration

### 3. Custom Hooks
Hooks manage state and coordinate between services and UI:

- `useBattery`: Battery state management
- `useChat`: Chat state and message handling
- `useLocation`: Location state management
- `useMechanics`: Mechanic shop data management

### 4. Type Safety
All data structures are defined in TypeScript interfaces:

- `Message`: Chat message structure
- `Location`: Map coordinates and region
- `Mechanic`: Mechanic shop information
- `BatteryInfo`: Battery status information
- `AuthCredentials`: Authentication data

## Usage Examples

### Using a Service
```typescript
import { mechanicService } from '@/services';

const mechanics = await mechanicService.getNearbyMechanics(lat, lon);
```

### Using a Custom Hook
```typescript
import { useMechanics } from '@/hooks';

const { mechanics, loading, error, fetchMechanics } = useMechanics();
```

## Benefits

1. **Maintainability**: Clear separation makes code easier to understand and modify
2. **Testability**: Business logic can be tested independently of UI
3. **Reusability**: Services and hooks can be reused across components
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Scalability**: Easy to add new features following established patterns 