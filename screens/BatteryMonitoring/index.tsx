import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useBattery } from '@/hooks/useBattery';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
    PADDING, 
    FONT_SIZES, 
    BORDER_RADIUS, 
    SPACING, 
    isSmallScreen,
    isMediumScreen,
    isLargeScreen
} from '@/utils/responsive';

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
    paddingHorizontal: PADDING.SCREEN,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.L,
  },
  title: {
    fontSize: FONT_SIZES.LARGE_TITLE,
    fontWeight: 'bold',
    marginBottom: SPACING.S,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.L,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: SPACING.L,
    paddingHorizontal: PADDING.SCREEN,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    borderRadius: BORDER_RADIUS.M,
    marginBottom: SPACING.L,
    alignSelf: 'center',
    minWidth: isSmallScreen ? 180 : 200,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: FONT_SIZES.L,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: '#F44336',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.M,
    padding: PADDING.CARD,
    marginBottom: SPACING.L,
    flexDirection: isSmallScreen ? 'column' : 'row',
    alignItems: isSmallScreen ? 'stretch' : 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#F44336',
    fontSize: FONT_SIZES.M,
    flex: isSmallScreen ? undefined : 1,
    marginBottom: isSmallScreen ? SPACING.S : 0,
  },
  errorButton: {
    marginLeft: isSmallScreen ? 0 : SPACING.M,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.XS,
    backgroundColor: '#F44336',
    borderRadius: BORDER_RADIUS.S,
    alignSelf: isSmallScreen ? 'center' : 'auto',
  },
  errorButtonText: {
    color: 'white',
    fontSize: FONT_SIZES.S,
    fontWeight: '600',
  },
  dataContainer: {
    gap: SPACING.L,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.L,
    padding: PADDING.CARD,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: FONT_SIZES.XL,
    fontWeight: '600',
    marginBottom: SPACING.M,
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: SPACING.M,
  },
  levelText: {
    fontSize: isSmallScreen ? 36 : isMediumScreen ? 42 : 48,
    fontWeight: 'bold',
    marginBottom: SPACING.S,
  },
  levelBar: {
    width: '100%',
    height: isSmallScreen ? 6 : 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.S,
    overflow: 'hidden',
  },
  levelFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.S,
  },
  chargingStatus: {
    fontSize: FONT_SIZES.L,
    textAlign: 'center',
    opacity: 0.8,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.M,
    justifyContent: 'space-between',
  },
  detailCard: {
    width: isSmallScreen ? '48%' : '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.M,
    padding: PADDING.CARD,
    alignItems: 'center',
    minHeight: isSmallScreen ? 60 : 70,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: FONT_SIZES.S,
    opacity: 0.7,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: FONT_SIZES.L,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  recommendationsList: {
    gap: SPACING.S,
  },
  recommendation: {
    fontSize: FONT_SIZES.M,
    padding: SPACING.S,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.S,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    lineHeight: FONT_SIZES.M * 1.4,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.XL,
    paddingHorizontal: PADDING.SCREEN,
    minHeight: 300,
  },
  placeholderText: {
    fontSize: FONT_SIZES.XL,
    fontWeight: '600',
    marginBottom: SPACING.S,
    opacity: 0.7,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: FONT_SIZES.M,
    opacity: 0.5,
    textAlign: 'center',
    paddingHorizontal: PADDING.SCREEN,
    lineHeight: FONT_SIZES.M * 1.4,
  },
  predictionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.M,
    justifyContent: 'space-between',
    marginBottom: SPACING.L,
  },
  predictionItem: {
    width: isSmallScreen ? '48%' : '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.M,
    padding: PADDING.CARD,
    alignItems: 'center',
    minHeight: isSmallScreen ? 60 : 70,
    justifyContent: 'center',
  },
  predictionLabel: {
    fontSize: FONT_SIZES.S,
    opacity: 0.7,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  predictionValue: {
    fontSize: FONT_SIZES.L,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  aiRecommendationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.M,
    padding: PADDING.CARD,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: SPACING.L,
  },
  aiRecommendationLabel: {
    fontSize: FONT_SIZES.M,
    fontWeight: '600',
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  aiRecommendationText: {
    fontSize: FONT_SIZES.L,
    textAlign: 'center',
    lineHeight: FONT_SIZES.L * 1.4,
  },
  predictionNote: {
    fontSize: FONT_SIZES.S,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: SPACING.S,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    borderRadius: BORDER_RADIUS.M,
    marginTop: SPACING.L,
    alignSelf: 'center',
    minWidth: isSmallScreen ? 200 : 220,
  },
  registerButtonText: {
    color: 'white',
    fontSize: FONT_SIZES.L,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 