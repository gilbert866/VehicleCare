import { BatteryInfo } from '@/types/battery';
import * as Battery from 'expo-battery';

class BatteryService {
    async getBatteryLevel(): Promise<number> {
        try {
            const level = await Battery.getBatteryLevelAsync();
            return Math.round(level * 100);
        } catch (error) {
            console.error('Error getting battery level:', error);
            throw error;
        }
    }

    async getBatteryInfo(): Promise<BatteryInfo> {
        try {
            const [level, isCharging, isLowPowerMode] = await Promise.all([
                this.getBatteryLevel(),
                Battery.isAvailableAsync(),
                Battery.isLowPowerModeEnabledAsync(),
            ]);

            return {
                level,
                isCharging,
                isLowPowerMode,
            };
        } catch (error) {
            console.error('Error getting battery info:', error);
            throw error;
        }
    }

    async isCharging(): Promise<boolean> {
        try {
            return await Battery.isAvailableAsync();
        } catch (error) {
            console.error('Error checking charging status:', error);
            throw error;
        }
    }

    async isLowPowerMode(): Promise<boolean> {
        try {
            return await Battery.isLowPowerModeEnabledAsync();
        } catch (error) {
            console.error('Error checking low power mode:', error);
            throw error;
        }
    }
}

export const batteryService = new BatteryService(); 