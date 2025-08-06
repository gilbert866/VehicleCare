import { Location } from '@/types/location';
import * as Location from 'expo-location';

class LocationService {
    async requestLocationPermission(): Promise<boolean> {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Error requesting location permission:', error);
            return false;
        }
    }

    async getCurrentLocation(): Promise<Location> {
        try {
            const hasPermission = await this.requestLocationPermission();
            if (!hasPermission) {
                throw new Error('Location permission denied. Please enable location services in your device settings.');
            }

            // Check if location services are enabled
            const isEnabled = await Location.hasServicesEnabledAsync();
            if (!isEnabled) {
                throw new Error('Location services are disabled. Please enable location services in your device settings.');
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
                timeInterval: 5000,
                distanceInterval: 10,
            });
            
            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
        } catch (error) {
            console.error('Error getting current location:', error);
            
            // Provide more specific error messages
            if (error instanceof Error) {
                if (error.message.includes('location is unavailable')) {
                    throw new Error('Location is currently unavailable. Please check your device settings and try again.');
                } else if (error.message.includes('permission')) {
                    throw new Error('Location permission is required. Please grant location permission in your device settings.');
                } else if (error.message.includes('timeout')) {
                    throw new Error('Location request timed out. Please try again.');
                }
            }
            
            throw new Error('Unable to get current location. Please check your device settings and try again.');
        }
    }

    async getLocationWithCustomDelta(
        latitudeDelta: number = 0.01,
        longitudeDelta: number = 0.01
    ): Promise<Location> {
        try {
            const location = await this.getCurrentLocation();
            return {
                ...location,
                latitudeDelta,
                longitudeDelta,
            };
        } catch (error) {
            console.error('Error getting location with custom delta:', error);
            throw error;
        }
    }

    // Get a default location (useful for fallback)
    getDefaultLocation(): Location {
        return {
            latitude: 37.7749, // San Francisco coordinates as default
            longitude: -122.4194,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }
}

export const locationService = new LocationService(); 