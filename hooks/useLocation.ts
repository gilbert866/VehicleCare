import { LocationPermissionStatus, locationService } from '@/services/locationService';
import { Location, LocationState } from '@/types/location';
import { useCallback, useState } from 'react';

export interface UseLocationReturn {
    location: Location | null;
    loading: boolean;
    error: string | null;
    permissionStatus: LocationPermissionStatus | null;
    showPermissionPrompt: boolean;
    getCurrentLocation: () => Promise<void>;
    getLocationWithDelta: (latDelta?: number, lonDelta?: number) => Promise<void>;
    clearError: () => void;
    useDefaultLocation: () => void;
    requestLocationPermission: () => Promise<void>;
    checkLocationPermission: () => Promise<void>;
    setShowPermissionPrompt: (show: boolean) => void;
}

export const useLocation = (): UseLocationReturn => {
    const [state, setState] = useState<LocationState>({
        location: null,
        loading: false,
        error: null,
    });
    const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus | null>(null);
    const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

    const updateState = useCallback((updates: Partial<LocationState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const checkLocationPermission = useCallback(async () => {
        try {
            console.log('useLocation - Checking location permission...');
            const status = await locationService.checkLocationPermission();
            setPermissionStatus(status);
            
            // If permission is not granted and we can ask again, show the prompt
            if (!status.granted && status.canAskAgain) {
                setShowPermissionPrompt(true);
            }
        } catch (error) {
            console.error('useLocation - Error checking permission:', error);
            setPermissionStatus({
                granted: false,
                canAskAgain: false,
                status: 'denied' as any,
            });
        }
    }, []);

    const requestLocationPermission = useCallback(async () => {
        try {
            console.log('useLocation - Requesting location permission...');
            updateState({ loading: true, error: null });
            
            const status = await locationService.requestLocationPermission();
            setPermissionStatus(status);
            
            if (status.granted) {
                // If permission granted, get location immediately
                try {
                    const location = await locationService.getCurrentLocation();
                    updateState({ location, loading: false });
                    setShowPermissionPrompt(false);
                } catch (locationError) {
                    const errorMessage = locationError instanceof Error ? locationError.message : 'Failed to get location';
                    updateState({ error: errorMessage, loading: false });
                }
            } else {
                // If permission denied, keep the prompt visible
                updateState({ loading: false });
                // Don't auto-dismiss the prompt, let user try again or use default location
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to request location permission';
            console.error('useLocation - Permission request error:', errorMessage);
            updateState({ error: errorMessage, loading: false });
            // Don't auto-dismiss the prompt on error
        }
    }, [updateState]);

    const getCurrentLocation = useCallback(async () => {
        try {
            console.log('useLocation - Starting location request...');
            updateState({ loading: true, error: null });
            
            // First check permission status
            await checkLocationPermission();
            
            // Check if we have permission from the state
            if (permissionStatus && !permissionStatus.granted) {
                if (permissionStatus.canAskAgain) {
                    setShowPermissionPrompt(true);
                    updateState({ loading: false });
                    return;
                } else {
                    throw new Error('Location permission denied. Please enable location services in your device settings.');
                }
            }
            
            const location = await locationService.getCurrentLocation();
            console.log('useLocation - Location received:', location);
            updateState({ location, loading: false });
            setShowPermissionPrompt(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
            console.error('useLocation - Location error:', errorMessage);
            updateState({ error: errorMessage, loading: false });
            // Don't auto-dismiss the prompt on error, let user try again
        }
    }, [updateState, checkLocationPermission, permissionStatus]);

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
        setShowPermissionPrompt(false);
    }, [updateState]);

    return {
        location: state.location,
        loading: state.loading,
        error: state.error,
        permissionStatus,
        showPermissionPrompt,
        getCurrentLocation,
        getLocationWithDelta,
        clearError,
        useDefaultLocation,
        requestLocationPermission,
        checkLocationPermission,
        setShowPermissionPrompt,
    };
}; 