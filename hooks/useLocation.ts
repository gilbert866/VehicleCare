import { locationService } from '@/services/locationService';
import { Location } from '@/types';
import { useEffect, useState } from 'react';

export const useLocation = () => {
    const [location, setLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCurrentLocation = async () => {
        try {
            setLoading(true);
            setError(null);
            const currentLocation = await locationService.getCurrentLocation();
            setLocation(currentLocation);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
            setError(errorMessage);
            
            // Set a default location as fallback
            const defaultLocation = locationService.getDefaultLocation();
            setLocation(defaultLocation);
            
            console.warn('Using default location due to error:', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateLocationWithDelta = async (latitudeDelta: number, longitudeDelta: number) => {
        try {
            const newLocation = await locationService.getLocationWithCustomDelta(
                latitudeDelta,
                longitudeDelta
            );
            setLocation(newLocation);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update location';
            setError(errorMessage);
            
            // Update with current location and new delta if available
            if (location) {
                setLocation({
                    ...location,
                    latitudeDelta,
                    longitudeDelta,
                });
            }
        }
    };

    const retryLocation = async () => {
        await fetchCurrentLocation();
    };

    useEffect(() => {
        fetchCurrentLocation();
    }, []);

    return {
        location,
        loading,
        error,
        fetchCurrentLocation,
        updateLocationWithDelta,
        retryLocation,
    };
}; 