# Authentication System with Backend Integration

## Overview

This application implements a pure backend authentication system where users manually enter their desired username during registration. The system integrates with a backend API for all authentication operations. Users can sign in using either their email address or chosen username.

## Features

### Manual Username Entry
- Users manually enter their desired username during registration
- Real-time username validation with format checking
- Username length limited to 3-30 characters
- Username can contain letters, numbers, and underscores
- Username must start with a letter or number

### Backend Integration
- Registration and login handled by backend API (`http://127.0.0.1:8000/api`)
- Backend stores user data and handles authentication tokens
- Pure backend implementation with no external dependencies

### Authentication Flow
1. **Registration**: User provides email, password, full name, and desired username
2. **Username Validation**: System validates username format in real-time
3. **Backend Registration**: User data sent to backend API with chosen username
4. **Token Storage**: Authentication token stored in AsyncStorage
5. **Sign In**: Users can sign in using either email or username
6. **Token Retrieval**: Stored tokens are retrieved from AsyncStorage

## Implementation Details

### Username Validation Rules
- Must be 3-30 characters long
- Can only contain letters, numbers, and underscores
- Must start with a letter or number
- Cannot be empty
- Real-time validation feedback

### Username Examples
- Valid: `john_doe`, `user123`, `my_username`, `test_user_2024`
- Invalid: `ab`, `user@name`, `_username`, `123user` (if backend doesn't allow starting with numbers)

### Backend API Endpoints
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `GET /api/mechanicFinder/nearby-mechanics/` - Mechanic finder

### Database Schema
User profiles are stored in the backend:

**Backend User:**
```typescript
interface BackendAuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  token?: string;
}
```

## Components

### Core Files
- `utils/usernameGenerator.ts` - Username validation utilities
- `services/backendAuthService.ts` - Backend authentication service
- `services/authService.ts` - Main authentication service (backend-only)
- `hooks/useAuth.ts` - Authentication hook
- `components/UserProfile.tsx` - User profile display component

### Screens
- `screens/SignUp/index.tsx` - Registration with manual username entry
- `screens/SignIn/index.tsx` - Sign in using email or username
- `screens/Settings/index.tsx` - User profile display

## Usage

### Registration
```typescript
const { signUp } = useAuth();
await signUp(email, password, displayName, username);
// Username is manually entered and validated
```

### Sign In (Email or Username)
```typescript
const { signIn } = useAuth();
await signIn(emailOrUsername, password);
// Can use either email or chosen username
```

### Display User Profile
```typescript
import { UserProfile } from '@/components/UserProfile';

<UserProfile showUsername={true} showEmail={true} showName={true} />
```

## Login Options

Users can sign in using either:
1. **Email Address**: `john.doe@example.com`
2. **Chosen Username**: `john_doe`

The system automatically:
- Stores the chosen username during registration
- Associates usernames with emails for login lookup
- Allows login with either email or username
- Validates input format in real-time
- Handles email-to-username conversion for login

## Benefits

1. **User Control**: Users can choose their preferred username
2. **Flexibility**: Multiple login options (email or username)
3. **Real-time Validation**: Immediate feedback on username format
4. **Backend Integration**: Pure API integration for authentication
5. **Simple Architecture**: No external dependencies or complex integrations
6. **User Experience**: Clear validation messages and requirements

## Future Enhancements

- Backend endpoint for username availability checking
- Username change functionality after registration
- Support for username-based mentions and references
- Enhanced token management with refresh tokens
- Offline authentication support
- Username suggestions if chosen username is taken 