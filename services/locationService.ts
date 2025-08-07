import { Location } from '@/types/location';
import * as ExpoLocation from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

export interface LocationPermissionStatus {
    granted: boolean;
    canAskAgain: boolean;
    status: ExpoLocation.PermissionStatus;
}

class LocationService {
    async checkLocationPermission(): Promise<LocationPermissionStatus> {
        try {
            console.log('LocationService - Checking location permission...');
            const { status, canAskAgain } = await ExpoLocation.getForegroundPermissionsAsync();
            console.log('LocationService - Permission status:', status, 'canAskAgain:', canAskAgain);
            
            return {
                granted: status === 'granted',
                canAskAgain,
                status,
            };
        } catch (error) {
            console.error('LocationService - Error checking location permission:', error);
            return {
                granted: false,
                canAskAgain: false,
                status: 'denied' as ExpoLocation.PermissionStatus,
            };
        }
    }

    async requestLocationPermission(): Promise<LocationPermissionStatus> {
        try {
            console.log('LocationService - Requesting location permission...');
            const { status, canAskAgain } = await ExpoLocation.requestForegroundPermissionsAsync();
            console.log('LocationService - Permission request result:', status, 'canAskAgain:', canAskAgain);
            
            return {
                granted: status === 'granted',
                canAskAgain,
                status,
            };
        } catch (error) {
            console.error('LocationService - Error requesting location permission:', error);
            return {
                granted: false,
                canAskAgain: false,
                status: 'denied' as ExpoLocation.PermissionStatus,
            };
        }
    }

    async getCurrentLocation(): Promise<Location> {
        try {
            console.log('LocationService - Getting current location...');
            
            // First check current permission status
            const permissionStatus = await this.checkLocationPermission();
            
            if (!permissionStatus.granted) {
                // If we can ask again, request permission
                if (permissionStatus.canAskAgain) {
                    const requestResult = await this.requestLocationPermission();
                    if (!requestResult.granted) {
                        this.showPermissionDeniedAlert();
                        throw new Error('Location permission denied. Please enable location services in your device settings.');
                    }
                } else {
                    this.showPermissionDeniedAlert();
                    throw new Error('Location permission denied. Please enable location services in your device settings.');
                }
            }

            // Check if location services are enabled
            console.log('LocationService - Checking if location services are enabled...');
            const isEnabled = await ExpoLocation.hasServicesEnabledAsync();
            console.log('LocationService - Location services enabled:', isEnabled);
            
            if (!isEnabled) {
                this.showLocationServicesDisabledAlert();
                throw new Error('Location services are disabled. Please enable location services in your device settings.');
            }

            console.log('LocationService - Requesting position...');
            const location = await ExpoLocation.getCurrentPositionAsync({
                accuracy: ExpoLocation.Accuracy.Balanced,
                timeInterval: 10000, // 10 seconds timeout
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
            
            // Provide more specific error messages and guidance
            if (error instanceof Error) {
                if (error.message.includes('location is unavailable')) {
                    this.showLocationUnavailableAlert();
                    throw new Error('Location is currently unavailable. Please check your device settings and try again.');
                } else if (error.message.includes('permission')) {
                    this.showPermissionDeniedAlert();
                    throw new Error('Location permission is required. Please grant location permission in your device settings.');
                } else if (error.message.includes('timeout')) {
                    this.showTimeoutAlert();
                    throw new Error('Location request timed out. Please try again.');
                } else if (error.message.includes('network')) {
                    this.showNetworkErrorAlert();
                    throw new Error('Network error occurred while getting location. Please check your internet connection.');
                }
            }
            
            this.showGenericErrorAlert();
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

    // Alert helpers for better user guidance
    private showPermissionDeniedAlert() {
        Alert.alert(
            'Location Permission Required',
            'To find nearby mechanics, we need access to your location. Please enable location services in your device settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open Settings',
                    onPress: () => {
                        if (Platform.OS === 'ios') {
                            Linking.openURL('app-settings:');
                        } else {
                            Linking.openSettings();
                        }
                    },
                },
            ]
        );
    }

    private showLocationServicesDisabledAlert() {
        Alert.alert(
            'Device Location Services Disabled',
            'Location services are turned off on your device. Please enable them in your device settings to find nearby mechanics.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Turn On Location',
                    onPress: () => {
                        if (Platform.OS === 'ios') {
                            // Open iOS Location Services settings
                            Linking.openURL('App-Prefs:Privacy&path=LOCATION');
                        } else {
                            // Open Android Location settings
                            Linking.openSettings();
                        }
                    },
                },
            ]
        );
    }

    private showLocationUnavailableAlert() {
        Alert.alert(
            'Location Unavailable',
            'Your location is currently unavailable. This might be due to poor GPS signal or being indoors. Please try again in an open area.',
            [
                { text: 'OK', style: 'default' },
                { text: 'Try Again', onPress: () => this.getCurrentLocation() },
            ]
        );
    }

    private showTimeoutAlert() {
        Alert.alert(
            'Location Request Timeout',
            'The location request took too long to complete. This might be due to poor GPS signal. Please try again.',
            [
                { text: 'OK', style: 'default' },
                { text: 'Try Again', onPress: () => this.getCurrentLocation() },
            ]
        );
    }

    private showNetworkErrorAlert() {
        Alert.alert(
            'Network Error',
            'A network error occurred while getting your location. Please check your internet connection and try again.',
            [
                { text: 'OK', style: 'default' },
                { text: 'Try Again', onPress: () => this.getCurrentLocation() },
            ]
        );
    }

    private showGenericErrorAlert() {
        Alert.alert(
            'Location Error',
            'Unable to get your current location. Please check your device settings and try again.',
            [
                { text: 'OK', style: 'default' },
                { text: 'Try Again', onPress: () => this.getCurrentLocation() },
            ]
        );
    }
}

export const locationService = new LocationService(); 