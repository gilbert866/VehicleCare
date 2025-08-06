import { locationService } from '@/services/locationService';
import { Location, LocationState } from '@/types/location';
import { useCallback, useState } from 'react';

export interface UseLocationReturn {
    location: Location | null;
    loading: boolean;
    error: string | null;
    getCurrentLocation: () => Promise<void>;
    getLocationWithDelta: (latDelta?: number, lonDelta?: number) => Promise<void>;
    clearError: () => void;
    useDefaultLocation: () => void;
}

export const useLocation = (): UseLocationReturn => {
    const [state, setState] = useState<LocationState>({
        location: null,
        loading: false,
        error: null,
    });

    const updateState = useCallback((updates: Partial<LocationState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const getCurrentLocation = useCallback(async () => {
        try {
            console.log('useLocation - Starting location request...');
            updateState({ loading: true, error: null });
            const location = await locationService.getCurrentLocation();
            console.log('useLocation - Location received:', location);
            updateState({ location, loading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
            console.error('useLocation - Location error:', errorMessage);
            updateState({ error: errorMessage, loading: false });
        }
    }, [updateState]);

    const getLocationWithDelta = useCallback(async (latDelta?: number, lonDelta?: number) => {
        try {
            updateState({ loading: true, error: null });
            const location = await locationService.getLocationWithCustomDelta(latDelta, lonDelta);
            updateState({ location, loading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
            updateState({ error: errorMessage, loading: false });
        }
    }, [updateState]);

    const clearError = useCallback(() => {
        updateState({ error: null });
    }, [updateState]);

    const useDefaultLocation = useCallback(() => {
        const defaultLocation = locationService.getDefaultLocation();
        console.log('useLocation - Using default location:', defaultLocation);
        updateState({ location: defaultLocation, error: null, loading: false });
    }, [updateState]);

    return {
        location: state.location,
        loading: state.loading,
        error: state.error,
        getCurrentLocation,
        getLocationWithDelta,
        clearError,
        useDefaultLocation,
    };
}; 