import { Mechanic, mechanicService } from '@/services/mechanicService';
import { useCallback, useState } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

export interface UseMechanicsReturn {
  mechanics: Mechanic[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMorePages: boolean;
  fetchMechanics: (location: Location, page?: number) => Promise<void>;
  loadMoreMechanics: () => Promise<void>;
  refreshMechanics: () => Promise<void>;
}

export function useMechanics(): UseMechanicsReturn {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  const fetchMechanics = useCallback(async (location: Location, page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await mechanicService.getNearbyMechanics(
        location.latitude,
        location.longitude,
        page
      );

      // Filter out mechanics with invalid coordinates
      const validMechanics = response.mechanics.filter(mechanic => 
        mechanic && 
        typeof mechanic.latitude === 'number' && 
        typeof mechanic.longitude === 'number' &&
        !isNaN(mechanic.latitude) && 
        !isNaN(mechanic.longitude) &&
        typeof mechanic.distance_km === 'number' &&
        !isNaN(mechanic.distance_km)
      );

      console.log('Valid mechanics found:', validMechanics.length, 'out of', response.mechanics.length);

      if (page === 1) {
        // First page - replace all mechanics
        setMechanics(validMechanics);
      } else {
        // Subsequent pages - append mechanics
        setMechanics(prev => [...prev, ...validMechanics]);
      }

      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
      setCurrentLocation(location);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch mechanics');
      console.error('Error fetching mechanics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreMechanics = useCallback(async () => {
    if (currentLocation && currentPage < totalPages && !loading) {
      await fetchMechanics(currentLocation, currentPage + 1);
    }
  }, [currentLocation, currentPage, totalPages, loading, fetchMechanics]);

  const refreshMechanics = useCallback(async () => {
    if (currentLocation) {
      await fetchMechanics(currentLocation, 1);
    }
  }, [currentLocation, fetchMechanics]);

  return {
    mechanics,
    loading,
    error,
    currentPage,
    totalPages,
    hasMorePages: currentPage < totalPages,
    fetchMechanics,
    loadMoreMechanics,
    refreshMechanics,
  };
} 