// Location and map related types
export interface Location {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

export interface LocationState {
    location: Location | null;
    loading: boolean;
    error: string | null;
    hasPermission: boolean;
}

export interface LocationPermission {
    granted: boolean;
    canAskAgain: boolean;
    status: 'granted' | 'denied' | 'restricted' | 'undetermined';
} 