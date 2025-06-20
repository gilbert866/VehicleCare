import { Location as LocationType } from '@/types';
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

    async getCurrentLocation(): Promise<LocationType> {
        try {
            const hasPermission = await this.requestLocationPermission();
            if (!hasPermission) {
                throw new Error('Location permission denied');
            }

            const location = await Location.getCurrentPositionAsync({});
            
            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
        } catch (error) {
            console.error('Error getting current location:', error);
            throw error;
        }
    }

    async getLocationWithCustomDelta(
        latitudeDelta: number = 0.01,
        longitudeDelta: number = 0.01
    ): Promise<LocationType> {
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
}

export const locationService = new LocationService(); 