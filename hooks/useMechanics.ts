import { mechanicService } from '@/services/mechanicService';
import { Location } from '@/types/location';
import { Mechanic, MechanicState } from '@/types/mechanic';
import { useCallback, useState } from 'react';

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
  const [state, setState] = useState<MechanicState>({
    mechanics: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    hasMorePages: false,
    currentLocation: null,
  });

  const updateState = useCallback((updates: Partial<MechanicState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const fetchMechanics = useCallback(async (location: Location, page: number = 1) => {
    try {
      updateState({ loading: true, error: null });

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

      const newMechanics = page === 1 ? validMechanics : [...state.mechanics, ...validMechanics];
      const hasMorePages = response.page < response.total_pages;

      updateState({
        mechanics: newMechanics,
        currentPage: response.page,
        totalPages: response.total_pages,
        hasMorePages,
        currentLocation: location,
        loading: false,
      });
    } catch (error: any) {
      updateState({
        error: error.message || 'Failed to fetch mechanics',
        loading: false,
      });
      console.error('Error fetching mechanics:', error);
    }
  }, [state.mechanics, updateState]);

  const loadMoreMechanics = useCallback(async () => {
    if (state.currentLocation && state.currentPage < state.totalPages && !state.loading) {
      await fetchMechanics(state.currentLocation, state.currentPage + 1);
    }
  }, [state.currentLocation, state.currentPage, state.totalPages, state.loading, fetchMechanics]);

  const refreshMechanics = useCallback(async () => {
    if (state.currentLocation) {
      await fetchMechanics(state.currentLocation, 1);
    }
  }, [state.currentLocation, fetchMechanics]);

  return {
    mechanics: state.mechanics,
    loading: state.loading,
    error: state.error,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    hasMorePages: state.hasMorePages,
    fetchMechanics,
    loadMoreMechanics,
    refreshMechanics,
  };
} 