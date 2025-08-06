import { API_CONFIG, ENDPOINTS } from '@/constants/api';
import {
  BatteryAlert,
  BatteryData,
  BatteryHistoryResponse,
  BatteryPredictionRequest,
  BatteryPredictionResponse
} from '@/types/battery';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Battery service using actual backend API
class BatteryService {
  private baseURL = API_CONFIG.BACKEND_BASE_URL;

  /**
   * Predict battery health and charging duration using actual backend API
   */
  async predictBatteryOptimization(evModel: string, chargingDuration: number): Promise<BatteryPredictionResponse> {
    try {
      console.log('BatteryService - Predicting battery optimization for:', evModel, chargingDuration);

      const requestBody: BatteryPredictionRequest = {
        "EV Model": evModel,
        "Charging Duration (min)": chargingDuration
      };

      console.log('BatteryService - Request body:', JSON.stringify(requestBody));

      const response = await fetch(`${this.baseURL}${ENDPOINTS.BATTERY_PREDICT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`BatteryService - Response status: ${response.status}`);

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.text();
          console.log('BatteryService - Error response:', errorData);
          errorMessage = errorData || errorMessage;
        } catch (parseError) {
          console.log('BatteryService - Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('BatteryService - Raw response:', responseText);
      
      const data: BatteryPredictionResponse = JSON.parse(responseText);
      console.log('BatteryService - Parsed prediction result:', data);
      
      return data;

    } catch (error) {
      console.error('Error predicting battery optimization:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to predict battery optimization: ${error.message}`);
      } else {
        throw new Error('Failed to predict battery optimization');
      }
    }
  }

  /**
   * Get battery status with prediction data
   */
  async getBatteryStatus(vehicleId?: string, evModel?: string): Promise<BatteryData | null> {
    try {
      // Only get cached prediction data - no mock data generation
      const cachedData = await this.getCachedPredictionData();
      
      if (cachedData) {
        console.log('BatteryService - Using cached prediction data:', cachedData);
        
        // Build battery data from cached prediction only
        const batteryData: BatteryData = {
          level: 0, // Not available from prediction API
          isCharging: false, // Not available from prediction API
          temperature: 0, // Not available from prediction API
          voltage: 0, // Not available from prediction API
          health: cachedData.prediction["Battery Health"],
          estimatedTimeRemaining: '', // Not available from prediction API
          chargeCycles: 0, // Not available from prediction API
          lastUpdated: cachedData.timestamp,
          evModel: cachedData.vehicleInfo?.evModel || 'Unknown',
          chargingDuration: cachedData.vehicleInfo?.chargingDuration,
          chargingDurationClass: cachedData.prediction["Charging Duration Class"],
          recommendation: cachedData.prediction["Recommendation"]
        };

        return batteryData;
      }

      // Return null if no cached data available
      console.log('BatteryService - No cached prediction data available');
      return null;

        } catch (error) {
      console.error('Error fetching battery status:', error);
      throw new Error('Failed to fetch battery status');
    }
  }

  /**
   * Get cached prediction data from AsyncStorage
   */
  private async getCachedPredictionData(): Promise<any> {
    try {
      const cachedPrediction = await AsyncStorage.getItem('batteryPrediction');
      const cachedTimestamp = await AsyncStorage.getItem('predictionTimestamp');
      const cachedVehicleData = await AsyncStorage.getItem('vehicleData');
      
      if (cachedPrediction && cachedTimestamp) {
        const prediction = JSON.parse(cachedPrediction);
        const timestamp = new Date(cachedTimestamp);
        const now = new Date();
        const hoursSinceCache = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
        
        // Return cached data if less than 24 hours old
        if (hoursSinceCache < 24) {
          const vehicleInfo = cachedVehicleData ? JSON.parse(cachedVehicleData) : null;
          return { 
            prediction, 
            timestamp: cachedTimestamp,
            vehicleInfo,
            hoursOld: hoursSinceCache.toFixed(1)
          };
        } else {
          console.log('BatteryService - Cached prediction data is too old:', hoursSinceCache.toFixed(1), 'hours');
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting cached prediction data:', error);
      return null;
    }
  }

  /**
   * Get battery history from backend
   * TODO: Implement when backend endpoint is ready
   */
  async getBatteryHistory(period: '24h' | '7d' | '30d' = '24h'): Promise<BatteryHistoryResponse> {
    try {
      // Mock implementation for now - no backend endpoint available
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockHistory: BatteryHistoryResponse = {
        history: Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
          level: 80 + Math.random() * 20,
          temperature: 25 + Math.random() * 10,
          voltage: 12.5 + Math.random() * 1,
          isCharging: Math.random() > 0.7
        })),
        period
      };

      return mockHistory;
        } catch (error) {
      console.error('Error fetching battery history:', error);
      throw new Error('Failed to fetch battery history');
    }
  }

  /**
   * Get battery alerts from backend
   * TODO: Implement when backend endpoint is ready
   */
  async getBatteryAlerts(): Promise<BatteryAlert[]> {
    try {
      // Mock implementation for now - no backend endpoint available
      const mockAlerts: BatteryAlert[] = [
        {
          type: 'warning',
          message: 'Battery temperature is higher than normal',
          timestamp: new Date().toISOString()
        }
      ];

      return mockAlerts;
    } catch (error) {
      console.error('Error fetching battery alerts:', error);
      throw new Error('Failed to fetch battery alerts');
    }
  }

  /**
   * Get battery recommendations based on prediction data
   */
  async getBatteryRecommendations(batteryData: BatteryData): Promise<string[]> {
    try {
      const recommendations: string[] = [];

      // Add recommendation from prediction if available
      if (batteryData.recommendation) {
        recommendations.push(batteryData.recommendation);
      }

      // Add general recommendations based on current data
      if (batteryData.level < 30) {
        recommendations.push('⚠️ Battery level is low. Consider charging soon.');
      }
      if (batteryData.temperature > 30) {
        recommendations.push('🌡️ Battery temperature is high. Avoid extreme conditions.');
      }
      if (batteryData.health === 'Poor') {
        recommendations.push('🔧 Battery health is poor. Consider maintenance.');
      }
      if (batteryData.chargingDurationClass === 'Fast') {
        recommendations.push('⚡ Fast charging detected. Monitor battery temperature.');
      }
      if (batteryData.chargingDurationClass === 'Slow') {
        recommendations.push('🐌 Slow charging detected. Check charging equipment.');
      }

      return recommendations.length > 0 ? recommendations : ['✅ Battery is operating normally.'];

        } catch (error) {
      console.error('Error getting battery recommendations:', error);
      return ['Unable to load recommendations at this time.'];
        }
    }
}

export const batteryService = new BatteryService(); 