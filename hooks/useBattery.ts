import { batteryService } from '@/services/batteryService';
import { BatteryInfo, BatteryState } from '@/types/battery';
import { useCallback, useEffect, useState } from 'react';

export interface UseBatteryReturn {
    batteryInfo: BatteryInfo;
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
    refreshBatteryStatus: () => Promise<void>;
    clearError: () => void;
}

export const useBattery = (): UseBatteryReturn => {
    const [state, setState] = useState<BatteryState>({
        batteryInfo: {
            level: null,
            isCharging: false,
            isLowPowerMode: false,
        },
        loading: true,
        error: null,
        lastUpdated: null,
    });

    const updateState = useCallback((updates: Partial<BatteryState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const refreshBatteryStatus = useCallback(async () => {
        try {
            updateState({ loading: true, error: null });
            
            const batteryInfo = await batteryService.getBatteryInfo();
            
            updateState({
                batteryInfo,
                loading: false,
                lastUpdated: Date.now(),
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get battery status';
            updateState({
                error: errorMessage,
                loading: false,
            });
        }
    }, [updateState]);

    const clearError = useCallback(() => {
        updateState({ error: null });
    }, [updateState]);

    useEffect(() => {
        refreshBatteryStatus();
    }, [refreshBatteryStatus]);

    return {
        batteryInfo: state.batteryInfo,
        loading: state.loading,
        error: state.error,
        lastUpdated: state.lastUpdated,
        refreshBatteryStatus,
        clearError,
    };
}; 