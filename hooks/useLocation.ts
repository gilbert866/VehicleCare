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
            setError(err instanceof Error ? err.message : 'Failed to get location');
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
            setError(err instanceof Error ? err.message : 'Failed to update location');
        }
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
    };
}; 