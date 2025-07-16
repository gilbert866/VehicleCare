# Firebase Authentication Setup for Expo App

This guide will help you set up Firebase Authentication for your VehicleCare Expo React Native app.

## Prerequisites

1. A Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))
2. Firebase Authentication enabled in your project
3. Expo development environment

## Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "VehicleCare")
4. Follow the setup wizard

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### 3. Add Web App to Firebase

1. In your Firebase project, click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web app icon (</>) to add a web app
5. Register your app with:
   - App nickname: "VehicleCare Web"
   - Optional: Enable Firebase Hosting
6. Copy the configuration object

### 4. Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id

# Google Maps API Key (already configured in app.json)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

Replace the values with your actual Firebase configuration.

### 5. Expo Configuration

The app.json file has been configured with:
- Bundle identifiers for iOS and Android
- Proper app configuration for Expo
- No native Firebase plugins needed (using web SDK)

### 6. Test the Setup

1. Start your development server: `npm start`
2. Run on device or simulator:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`
3. Navigate to the Sign Up screen
4. Create a new account
5. Try signing in with the created account
6. Check the Firebase Console to see the new user

## Expo-Specific Features

### Firebase Web SDK
- Uses `firebase` package (web SDK) which works perfectly with Expo
- No native configuration files needed (`google-services.json`, `GoogleService-Info.plist`)
- Works across all platforms (iOS, Android, Web)
- Automatic token management and persistence

### Development Workflow
- **Expo Go**: Test on physical devices using Expo Go app
- **Development Builds**: Create custom development builds for native features
- **EAS Build**: Build for production using Expo Application Services

## Features Implemented

- ✅ **Expo-Compatible Authentication**
- ✅ **Cross-Platform Support** (iOS, Android, Web)
- ✅ **Email/Password Authentication**
- ✅ **User Registration with Display Name**
- ✅ **User Sign In/Sign Out**
- ✅ **Authentication State Management**
- ✅ **Protected Routes**
- ✅ **Loading States**
- ✅ **Error Handling with User-Friendly Messages**
- ✅ **Form Validation**
- ✅ **Automatic Redirects**
- ✅ **No Native Configuration Required**

## Troubleshooting

### Common Issues

1. **"Firebase App named '[DEFAULT]' already exists"**
   - This usually happens in development. The app is already initialized.

2. **"auth/operation-not-allowed"**
   - Make sure Email/Password authentication is enabled in Firebase Console.

3. **"auth/invalid-api-key"**
   - Check that your Firebase API key is correct in the `.env` file.

4. **Environment variables not loading**
   - Make sure your `.env` file is in the project root
   - Restart your development server after adding environment variables
   - Ensure variables start with `EXPO_PUBLIC_` for client-side access

5. **Authentication not persisting**
   - Firebase web SDK handles persistence automatically
   - Check network connectivity

6. **AsyncStorage Warning**
   - You may see a warning about AsyncStorage not being provided
   - This is normal in Expo development and doesn't affect functionality
   - For production builds, consider using Expo SecureStore for better persistence

### Expo-Specific Notes

**Expo Go:**
- Works immediately without additional setup
- Perfect for development and testing
- Limited to JavaScript APIs

**Development Builds:**
- Required for production apps
- Use `eas build` to create custom builds
- Supports all native features

**Web Platform:**
- Works seamlessly with the same codebase
- No additional configuration needed

## Development Commands

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Create development build
eas build --profile development

# Create production build
eas build --profile production
```

## Next Steps

1. **Test on Real Devices**: Use Expo Go to test on physical devices
2. **Create Development Build**: Use EAS Build for native features
3. **Add Social Auth**: Implement Google, Apple, or Facebook authentication
4. **Password Reset**: Add password reset functionality
5. **Email Verification**: Implement email verification flow
6. **Deploy to Stores**: Use EAS Submit to deploy to app stores

## Security Best Practices

- Keep Firebase configuration secure
- Use environment variables for sensitive data
- Implement proper error handling
- Consider adding rate limiting
- Monitor authentication events in Firebase Console
- Use Expo's secure storage for sensitive data

## Expo vs React Native Firebase

| Feature | Expo (Firebase Web SDK) | React Native Firebase |
|---------|------------------------|----------------------|
| Setup Complexity | Simple | Complex |
| Native Files | Not required | Required |
| Cross-Platform | Yes | Yes |
| Performance | Good | Excellent |
| Development Speed | Fast | Slower |
| Production Ready | Yes | Yes |
| EAS Build Support | Full | Full |

The Firebase web SDK with Expo provides an excellent balance of simplicity and functionality for most authentication needs! 