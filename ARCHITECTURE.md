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
- `placesService`: Google Places API integration

### 3. Custom Hooks
Hooks manage state and coordinate between services and UI:

- `useBattery`: Battery state management
- `useChat`: Chat state and message handling
- `useLocation`: Location state management
- `usePlaces`: Places search and filtering

### 4. Type Safety
All data structures are defined in TypeScript interfaces:

- `Message`: Chat message structure
- `Location`: Map coordinates and region
- `Place`: Google Places API response
- `BatteryInfo`: Battery status information
- `AuthCredentials`: Authentication data

## Usage Examples

### Using a Service
```typescript
import { batteryService } from '@/services';

const level = await batteryService.getBatteryLevel();
```

### Using a Custom Hook
```typescript
import { useBattery } from '@/hooks';

function BatteryScreen() {
    const { batteryInfo, loading, error } = useBattery();
    // UI logic here
}
```

### Using Utilities
```typescript
import { validationUtils, formattingUtils } from '@/utils';

const isValid = validationUtils.isValidEmail(email);
const formatted = formattingUtils.formatBatteryLevel(level);
```

## Benefits

1. **Testability**: Business logic can be tested independently of UI
2. **Reusability**: Services and hooks can be reused across components
3. **Maintainability**: Clear separation makes code easier to understand and modify
4. **Type Safety**: Strong typing prevents runtime errors
5. **Scalability**: Easy to add new features without affecting existing code

## Migration Guide

### Before (Mixed Logic)
```typescript
// Screen component with mixed UI and business logic
function BatteryScreen() {
    const [level, setLevel] = useState(null);
    
    useEffect(() => {
        Battery.getBatteryLevelAsync().then(setLevel);
    }, []);
    
    return <Text>{level}%</Text>;
}
```

### After (Separated Logic)
```typescript
// Service handles business logic
class BatteryService {
    async getBatteryLevel() {
        return await Battery.getBatteryLevelAsync();
    }
}

// Hook manages state
function useBattery() {
    const [level, setLevel] = useState(null);
    // State management logic
    return { level };
}

// Screen handles only UI
function BatteryScreen() {
    const { level } = useBattery();
    return <Text>{level}%</Text>;
}
```

## Best Practices

1. **Keep UI components pure**: They should only handle presentation
2. **Use services for external calls**: API calls, device APIs, etc.
3. **Manage state in hooks**: Coordinate between services and UI
4. **Validate data with utilities**: Centralize validation logic
5. **Use TypeScript interfaces**: Define clear contracts between layers 