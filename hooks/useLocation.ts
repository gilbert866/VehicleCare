import { locationService } from '@/services/locationService';
import { Location, LocationState } from '@/types/location';
import { useCallback, useEffect, useState } from 'react';

export interface UseLocationReturn {
    location: Location | null;
    loading: boolean;
    error: string | null;
    hasPermission: boolean;
    fetchCurrentLocation: () => Promise<void>;
    updateLocationWithDelta: (latitudeDelta: number, longitudeDelta: number) => Promise<void>;
    retryLocation: () => Promise<void>;
}

export const useLocation = (): UseLocationReturn => {
    const [state, setState] = useState<LocationState>({
        location: null,
        loading: true,
        error: null,
        hasPermission: false,
    });

    const updateState = useCallback((updates: Partial<LocationState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const fetchCurrentLocation = useCallback(async () => {
        try {
            updateState({ loading: true, error: null });
            const currentLocation = await locationService.getCurrentLocation();
            updateState({ 
                location: {
                    ...currentLocation,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                },
                loading: false, 
                hasPermission: true 
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
            updateState({ 
                error: errorMessage, 
                loading: false, 
                hasPermission: false 
            });
            
            // Set a default location as fallback
            const defaultLocation = locationService.getDefaultLocation();
            updateState({ 
                location: {
                    ...defaultLocation,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }
            });
            
            console.warn('Using default location due to error:', errorMessage);
        }
    }, [updateState]);

    const updateLocationWithDelta = useCallback(async (latitudeDelta: number, longitudeDelta: number) => {
        try {
            const newLocation = await locationService.getLocationWithCustomDelta(
                latitudeDelta,
                longitudeDelta
            );
            updateState({ 
                location: {
                    ...newLocation,
                    latitudeDelta,
                    longitudeDelta,
                }
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update location';
            updateState({ error: errorMessage });
            
            // Update with current location and new delta if available
            if (state.location) {
                updateState({
                    location: {
                        ...state.location,
                        latitudeDelta,
                        longitudeDelta,
                    }
                });
            }
        }
    }, [state.location, updateState]);

    const retryLocation = useCallback(async () => {
        await fetchCurrentLocation();
    }, [fetchCurrentLocation]);

    useEffect(() => {
        fetchCurrentLocation();
    }, [fetchCurrentLocation]);

    return {
        location: state.location,
        loading: state.loading,
        error: state.error,
        hasPermission: state.hasPermission,
        fetchCurrentLocation,
        updateLocationWithDelta,
        retryLocation,
    };
}; 