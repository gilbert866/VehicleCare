import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useBattery } from '@/hooks/useBattery';
import { router } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 360;
const isMediumScreen = screenWidth >= 360 && screenWidth < 400;
const isLargeScreen = screenWidth >= 400;

export default function BatteryMonitoringScreen() {
  const insets = useSafeAreaInsets();
  const { 
    batteryData, 
    loading, 
    error, 
    recommendations, 
    refreshBatteryData, 
    clearError 
  } = useBattery();

  const getBatteryLevelColor = (level: number) => {
    if (level > 60) return '#4CAF50';
    if (level > 30) return '#FF9800';
    return '#F44336';
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Good': return '#4CAF50';
      case 'Fair': return '#FF9800';
      case 'Poor': return '#F44336';
      default: return Colors.light.text;
        }
  };

    return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          Battery Monitoring
        </ThemedText>
        
        <ThemedText style={styles.subtitle}>
          Monitor your vehicle's battery health and performance
        </ThemedText>

        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={() => refreshBatteryData()}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? 'Updating...' : 'Refresh Battery Data'}
          </Text>
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={clearError} style={styles.errorButton}>
              <Text style={styles.errorButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        {batteryData ? (
          <View style={styles.dataContainer}>
            {/* Battery Level Card - Only show if we have actual data */}
            {batteryData.level > 0 && (
              <View style={styles.card}>
                <ThemedText type="subtitle" style={styles.cardTitle}>
                  Battery Level
                </ThemedText>
                <View style={styles.levelContainer}>
                  <Text style={[
                    styles.levelText, 
                    { color: getBatteryLevelColor(batteryData.level) }
                  ]}>
                    {batteryData.level}%
                  </Text>
                  <View style={styles.levelBar}>
                    <View 
                      style={[
                        styles.levelFill, 
                        { 
                          width: `${batteryData.level}%`,
                          backgroundColor: getBatteryLevelColor(batteryData.level)
                        }
                      ]} 
                    />
                  </View>
                </View>
                <Text style={styles.chargingStatus}>
                  {batteryData.isCharging ? '🔌 Charging' : '🔋 On Battery'}
                </Text>
              </View>
            )}

            {/* Battery Details Grid - Only show if we have actual sensor data */}
            {(batteryData.temperature > 0 || batteryData.voltage > 0 || batteryData.chargeCycles > 0) && (
              <View style={styles.detailsGrid}>
                {batteryData.temperature > 0 && (
                  <View style={styles.detailCard}>
                    <ThemedText style={styles.detailLabel}>Temperature</ThemedText>
                    <Text style={styles.detailValue}>
                      {batteryData.temperature.toFixed(1)}°C
                    </Text>
                  </View>
                )}

                {batteryData.voltage > 0 && (
                  <View style={styles.detailCard}>
                    <ThemedText style={styles.detailLabel}>Voltage</ThemedText>
                    <Text style={styles.detailValue}>
                      {batteryData.voltage.toFixed(1)}V
                    </Text>
                  </View>
                )}

                {batteryData.health && (
                  <View style={styles.detailCard}>
                    <ThemedText style={styles.detailLabel}>Health</ThemedText>
                    <Text style={[
                      styles.detailValue, 
                      { color: getHealthColor(batteryData.health) }
                    ]}>
                      {batteryData.health}
                    </Text>
                  </View>
                )}

                {batteryData.estimatedTimeRemaining && (
                  <View style={styles.detailCard}>
                    <ThemedText style={styles.detailLabel}>Time Remaining</ThemedText>
                    <Text style={styles.detailValue}>
                      {batteryData.estimatedTimeRemaining}
                    </Text>
                  </View>
                )}

                {batteryData.chargeCycles > 0 && (
                  <View style={styles.detailCard}>
                    <ThemedText style={styles.detailLabel}>Charge Cycles</ThemedText>
                    <Text style={styles.detailValue}>
                      {batteryData.chargeCycles}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Prediction Results Card - Main content from cached predictions */}
            {batteryData.recommendation && (
              <View style={styles.card}>
                <ThemedText type="subtitle" style={styles.cardTitle}>
                  Battery Health Prediction
                </ThemedText>
                <View style={styles.predictionGrid}>
                  <View style={styles.predictionItem}>
                    <Text style={styles.predictionLabel}>EV Model:</Text>
                    <Text style={styles.predictionValue}>{batteryData.evModel || 'Unknown'}</Text>
                  </View>
                  
                  <View style={styles.predictionItem}>
                    <Text style={styles.predictionLabel}>Battery Health:</Text>
                    <Text style={[
                      styles.predictionValue,
                      { color: getHealthColor(batteryData.health) }
                    ]}>
                      {batteryData.health}
                    </Text>
                  </View>

                  {batteryData.chargingDuration && (
                    <View style={styles.predictionItem}>
                      <Text style={styles.predictionLabel}>Charging Duration:</Text>
                      <Text style={styles.predictionValue}>{batteryData.chargingDuration} min</Text>
                    </View>
                  )}
                  
                  {batteryData.chargingDurationClass && (
                    <View style={styles.predictionItem}>
                      <Text style={styles.predictionLabel}>Charging Class:</Text>
                      <Text style={[
                        styles.predictionValue,
                        { color: batteryData.chargingDurationClass === 'Fast' ? '#FF9800' : 
                                batteryData.chargingDurationClass === 'Slow' ? '#F44336' : '#4CAF50' }
                      ]}>
                        {batteryData.chargingDurationClass}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.aiRecommendationContainer}>
                  <Text style={styles.aiRecommendationLabel}>AI Recommendation:</Text>
                  <Text style={styles.aiRecommendationText}>{batteryData.recommendation}</Text>
                </View>
                
                <Text style={styles.predictionNote}>
                  📊 Based on ML prediction model • Last updated: {batteryData.lastUpdated ? new Date(batteryData.lastUpdated).toLocaleString() : 'Unknown'}
                </Text>
              </View>
            )}

            {/* General Recommendations - Only show if we have recommendations */}
            {recommendations.length > 0 && (
              <View style={styles.card}>
                <ThemedText type="subtitle" style={styles.cardTitle}>
                  Additional Recommendations
                </ThemedText>
                <View style={styles.recommendationsList}>
                  {recommendations.map((recommendation, index) => (
                    <Text key={index} style={styles.recommendation}>
                      {recommendation}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : !loading && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              📊 No battery prediction data available
            </Text>
            <Text style={styles.placeholderSubtext}>
              Register your electric vehicle and get a battery health prediction to view monitoring data here.
            </Text>
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={() => router.push('/register')}
            >
              <Text style={styles.registerButtonText}>Register Vehicle</Text>
            </TouchableOpacity>
        </View>
        )}
      </ScrollView>
    </ThemedView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: isSmallScreen ? 24 : isMediumScreen ? 28 : 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: isSmallScreen ? 16 : 24,
    paddingHorizontal: isSmallScreen ? 8 : 16,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingVertical: isSmallScreen ? 10 : 12,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'center',
    minWidth: isSmallScreen ? 140 : 160,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: '#F44336',
    borderWidth: 1,
    borderRadius: 8,
    padding: isSmallScreen ? 10 : 12,
    marginBottom: 16,
    flexDirection: screenWidth < 340 ? 'column' : 'row',
    alignItems: screenWidth < 340 ? 'stretch' : 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#F44336',
    fontSize: isSmallScreen ? 12 : 14,
    flex: screenWidth < 340 ? undefined : 1,
    marginBottom: screenWidth < 340 ? 8 : 0,
  },
  errorButton: {
    marginLeft: screenWidth < 340 ? 0 : 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F44336',
    borderRadius: 4,
    alignSelf: screenWidth < 340 ? 'center' : 'auto',
  },
  errorButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  dataContainer: {
    gap: isSmallScreen ? 12 : 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: isSmallScreen ? 12 : 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
    marginBottom: isSmallScreen ? 8 : 12,
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? 8 : 12,
  },
  levelText: {
    fontSize: isSmallScreen ? 36 : isMediumScreen ? 42 : 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  levelBar: {
    width: '100%',
    height: isSmallScreen ? 6 : 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  levelFill: {
    height: '100%',
    borderRadius: 4,
  },
  chargingStatus: {
    fontSize: isSmallScreen ? 14 : 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isSmallScreen ? 8 : 12,
    justifyContent: 'space-between',
  },
  detailCard: {
    width: isSmallScreen ? '48%' : '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: isSmallScreen ? 8 : 12,
    alignItems: 'center',
    minHeight: isSmallScreen ? 60 : 70,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: isSmallScreen ? 10 : 12,
    opacity: 0.7,
    marginBottom: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: isSmallScreen ? 14 : isMediumScreen ? 16 : 18,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  recommendationsList: {
    gap: isSmallScreen ? 6 : 8,
  },
  recommendation: {
    fontSize: isSmallScreen ? 12 : 14,
    padding: isSmallScreen ? 6 : 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    lineHeight: isSmallScreen ? 16 : 20,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallScreen ? 32 : 48,
    paddingHorizontal: 16,
    minHeight: screenHeight * 0.3,
  },
  placeholderText: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: isSmallScreen ? 12 : 14,
    opacity: 0.5,
    textAlign: 'center',
    paddingHorizontal: isSmallScreen ? 16 : 32,
    lineHeight: isSmallScreen ? 16 : 20,
  },
  lastUpdated: {
    fontSize: isSmallScreen ? 10 : 12,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 8,
  },
  predictionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isSmallScreen ? 8 : 12,
    justifyContent: 'space-between',
    marginBottom: isSmallScreen ? 12 : 16,
  },
  predictionItem: {
    width: isSmallScreen ? '48%' : '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: isSmallScreen ? 8 : 12,
    alignItems: 'center',
    minHeight: isSmallScreen ? 60 : 70,
    justifyContent: 'center',
  },
  predictionLabel: {
    fontSize: isSmallScreen ? 10 : 12,
    opacity: 0.7,
    marginBottom: 4,
    textAlign: 'center',
  },
  predictionValue: {
    fontSize: isSmallScreen ? 14 : isMediumScreen ? 16 : 18,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  aiRecommendationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: isSmallScreen ? 10 : 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: isSmallScreen ? 12 : 16,
  },
  aiRecommendationLabel: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  aiRecommendationText: {
    fontSize: isSmallScreen ? 14 : 16,
    textAlign: 'center',
    lineHeight: isSmallScreen ? 18 : 20,
  },
  predictionNote: {
    fontSize: isSmallScreen ? 10 : 12,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 8,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: isSmallScreen ? 20 : 24,
    paddingVertical: isSmallScreen ? 10 : 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
    minWidth: isSmallScreen ? 180 : 200,
  },
  registerButtonText: {
    color: 'white',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 