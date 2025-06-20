# VehicleCare App 🚗

A React Native mobile application for vehicle maintenance and battery monitoring, built with Expo and TypeScript.

## Features

- 🔋 **Battery Monitoring**: Real-time battery level tracking
- 📍 **Location Services**: Find nearby mechanics and service centers
- 💬 **Chat Assistant**: AI-powered chat support for vehicle care
- 🔐 **User Authentication**: Secure sign-in and sign-up functionality
- 🗺️ **Interactive Maps**: Google Maps integration for service discovery

## Architecture

This project follows a clean architecture pattern with clear separation of concerns:

- **Services**: Handle business logic and external API calls
- **Hooks**: Manage state and coordinate between services and UI
- **Components**: Reusable UI components
- **Screens**: Screen-level components (UI only)
- **Utils**: Helper functions and validation
- **Types**: TypeScript interfaces and type definitions

For detailed architecture information, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Project Structure

```
VehicleCare/
├── app/              # Expo Router screens
├── components/       # Reusable UI components
├── screens/          # Screen components (UI only)
├── services/         # Business logic and API calls
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript interfaces
├── constants/        # Configuration and constants
└── styles/           # Styling utilities
```

## Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **Expo Router**: File-based routing
- **React Native Maps**: Map integration
- **Expo Battery**: Battery monitoring
- **Expo Location**: Location services

## Development

This project uses [file-based routing](https://docs.expo.dev/router/introduction) with Expo Router. You can start developing by editing the files inside the **app** directory.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
