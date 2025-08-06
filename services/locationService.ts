import { Location } from '@/types/location';
import * as ExpoLocation from 'expo-location';

class LocationService {
    async requestLocationPermission(): Promise<boolean> {
        try {
            console.log('LocationService - Requesting location permission...');
            const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
            console.log('LocationService - Permission status:', status);
            return status === 'granted';
        } catch (error) {
            console.error('LocationService - Error requesting location permission:', error);
            return false;
        }
    }

    async getCurrentLocation(): Promise<Location> {
        try {
            console.log('LocationService - Getting current location...');
            const hasPermission = await this.requestLocationPermission();
            if (!hasPermission) {
                throw new Error('Location permission denied. Please enable location services in your device settings.');
            }

            // Check if location services are enabled
            console.log('LocationService - Checking if location services are enabled...');
            const isEnabled = await ExpoLocation.hasServicesEnabledAsync();
            console.log('LocationService - Location services enabled:', isEnabled);
            if (!isEnabled) {
                throw new Error('Location services are disabled. Please enable location services in your device settings.');
            }

            console.log('LocationService - Requesting position...');
            const location = await ExpoLocation.getCurrentPositionAsync({
                accuracy: ExpoLocation.Accuracy.Balanced,
                timeInterval: 5000,
                distanceInterval: 10,
            });
            
            const result = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            
            console.log('LocationService - Location obtained:', result);
            return result;
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