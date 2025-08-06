// Battery prediction types based on actual API documentation
export interface BatteryPredictionRequest {
  "EV Model": string;
  "Charging Duration (min)": number;
}

export interface BatteryPredictionResponse {
  "EV Model": string;
  "Charging Duration (min)": number;
  "Battery Health": "Good" | "Fair" | "Poor";
  "Charging Duration Class": "Fast" | "Normal" | "Slow";
  "Recommendation": string;
}

// Legacy types for UI compatibility (can be removed later)
export interface BatteryData {
  level: number;
  isCharging: boolean;
  temperature: number;
  voltage: number;
  health: 'Good' | 'Fair' | 'Poor';
  estimatedTimeRemaining: string;
  chargeCycles: number;
  lastUpdated?: string;
  evModel?: string;
  chargingDuration?: number;
  chargingDurationClass?: "Fast" | "Normal" | "Slow";
  recommendation?: string;
}

export interface BatteryState {
  batteryData: BatteryData | null;
    loading: boolean;
    error: string | null;
}

export interface BatteryAlert {
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: string;
}

export interface BatteryHistoryResponse {
  history: BatteryHistoryEntry[];
  period: string;
}

export interface BatteryHistoryEntry {
  timestamp: string;
  level: number;
  temperature: number;
  voltage: number;
  isCharging: boolean;
} 