import { batteryService } from '@/services/batteryService';
import { BatteryInfo } from '@/types';
import { useEffect, useState } from 'react';

export const useBattery = () => {
    const [batteryInfo, setBatteryInfo] = useState<BatteryInfo>({ level: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBatteryInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            const info = await batteryService.getBatteryInfo();
            setBatteryInfo(info);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get battery info');
        } finally {
            setLoading(false);
        }
    };

    const refreshBatteryLevel = async () => {
        try {
            const level = await batteryService.getBatteryLevel();
            setBatteryInfo(prev => ({ ...prev, level }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to refresh battery level');
        }
    };

    useEffect(() => {
        fetchBatteryInfo();
    }, []);

    return {
        batteryInfo,
        loading,
        error,
        refreshBatteryLevel,
        fetchBatteryInfo,
    };
}; 