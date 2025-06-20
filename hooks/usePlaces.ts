import { API_CONFIG } from '@/constants/api';
import { placesService } from '@/services/placesService';
import { Location, Place } from '@/types';
import { useEffect, useState } from 'react';

export const usePlaces = (location: Location | null) => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchPlaces = async (query: string) => {
        if (!location || !query.trim()) {
            setPlaces([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const results = await placesService.searchNearbyPlaces(
                location.latitude,
                location.longitude,
                query
            );
            setPlaces(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to search places');
            setPlaces([]);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search effect
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchQuery.trim()) {
                searchPlaces(searchQuery);
            } else {
                setPlaces([]);
            }
        }, API_CONFIG.SEARCH_DEBOUNCE_DELAY);

        return () => clearTimeout(timeout);
    }, [searchQuery, location]);

    const clearSearch = () => {
        setSearchQuery('');
        setPlaces([]);
        setError(null);
    };

    return {
        places,
        searchQuery,
        setSearchQuery,
        loading,
        error,
        searchPlaces,
        clearSearch,
    };
}; 