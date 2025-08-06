// Battery monitoring types
export interface BatteryInfo {
    level: number | null;
    isCharging?: boolean;
    isLowPowerMode?: boolean;
}

export interface BatteryState {
    batteryInfo: BatteryInfo;
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
}

export interface BatteryThresholds {
    lowBattery: number;
    criticalBattery: number;
    chargingThreshold: number;
} 