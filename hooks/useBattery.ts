import { batteryService } from '@/services/batteryService';
import { BatteryAlert, BatteryData, BatteryHistoryResponse, BatteryPredictionResponse, BatteryState } from '@/types/battery';
import { useCallback, useEffect, useState } from 'react';

export interface UseBatteryReturn {
  batteryData: BatteryData | null;
  loading: boolean;
  error: string | null;
  alerts: BatteryAlert[];
  recommendations: string[];
  history: BatteryHistoryResponse | null;
  refreshBatteryData: (evModel?: string) => Promise<void>;
  getBatteryHistory: (period?: '24h' | '7d' | '30d') => Promise<void>;
  getBatteryAlerts: () => Promise<void>;
  predictBatteryOptimization: (evModel: string, chargingDuration: number) => Promise<BatteryPredictionResponse | null>;
  clearError: () => void;
}

export const useBattery = (): UseBatteryReturn => {
  const [state, setState] = useState<BatteryState>({
    batteryData: null,
    loading: false,
    error: null,
  });
  
  const [alerts, setAlerts] = useState<BatteryAlert[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [history, setHistory] = useState<BatteryHistoryResponse | null>(null);

  const updateState = useCallback((updates: Partial<BatteryState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const refreshBatteryData = useCallback(async (evModel?: string) => {
    try {
      updateState({ loading: true, error: null });
      
      const batteryData = await batteryService.getBatteryStatus(undefined, evModel);
      
      if (batteryData) {
        const batteryRecommendations = await batteryService.getBatteryRecommendations(batteryData);
        updateState({ batteryData, loading: false });
        setRecommendations(batteryRecommendations);
      } else {
        // No cached data available
        updateState({ 
          batteryData: null, 
          loading: false,
          error: 'No battery prediction data available. Please register your vehicle and get a prediction first.'
        });
        setRecommendations([]);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch battery data';
      updateState({ error: errorMessage, loading: false });
    }
  }, [updateState]);

  const getBatteryHistory = useCallback(async (period: '24h' | '7d' | '30d' = '24h') => {
    try {
      const historyData = await batteryService.getBatteryHistory(period);
      setHistory(historyData);
    } catch (error) {
      console.error('Error fetching battery history:', error);
    }
  }, []);

  const getBatteryAlerts = useCallback(async () => {
    try {
      const alertsData = await batteryService.getBatteryAlerts();
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching battery alerts:', error);
    }
  }, []);

  const predictBatteryOptimization = useCallback(async (evModel: string, chargingDuration: number): Promise<BatteryPredictionResponse | null> => {
    try {
      const prediction = await batteryService.predictBatteryOptimization(evModel, chargingDuration);
      return prediction;
    } catch (error) {
      console.error('Error predicting battery optimization:', error);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // Auto-refresh battery data every 5 minutes when component is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.batteryData) {
        refreshBatteryData(state.batteryData.evModel);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [state.batteryData, refreshBatteryData]);

  return {
    batteryData: state.batteryData,
    loading: state.loading,
    error: state.error,
    alerts,
    recommendations,
    history,
    refreshBatteryData,
    getBatteryHistory,
    getBatteryAlerts,
    predictBatteryOptimization,
    clearError,
  };
}; 