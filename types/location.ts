// Location types for device GPS functionality
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
} 