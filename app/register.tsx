import { Colors } from '@/constants/Colors';
import { useBattery } from '@/hooks/useBattery';
import { BatteryPredictionResponse } from '@/types/battery';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 360;

export default function VehicleRegistrationScreen() {
    const router = useRouter();
    const { predictBatteryOptimization } = useBattery();
    
    const [formData, setFormData] = useState({
        evModel: '',
        chargingDuration: '',
        ownerName: '',
        vehicleYear: '',
        batteryCapacity: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState<BatteryPredictionResponse | null>(null);

    // Cache keys for AsyncStorage
    const VEHICLE_DATA_KEY = 'vehicleData';
    const BATTERY_PREDICTION_KEY = 'batteryPrediction';
    const PREDICTION_TIMESTAMP_KEY = 'predictionTimestamp';

    // Function to cache vehicle data locally
    const cacheVehicleData = async (vehicleData: any) => {
        try {
            await AsyncStorage.setItem(VEHICLE_DATA_KEY, JSON.stringify(vehicleData));
            console.log('Vehicle data cached successfully');
        } catch (error) {
            console.error('Error caching vehicle data:', error);
        }
    };

    // Function to cache prediction results locally
    const cachePredictionResults = async (predictionData: BatteryPredictionResponse) => {
        try {
            const cacheData = {
                prediction: predictionData,
                timestamp: new Date().toISOString(),
                vehicleInfo: {
                    evModel: formData.evModel,
                    chargingDuration: parseInt(formData.chargingDuration),
                    ownerName: formData.ownerName,
                    vehicleYear: formData.vehicleYear,
                    batteryCapacity: formData.batteryCapacity
                }
            };

            await AsyncStorage.multiSet([
                [BATTERY_PREDICTION_KEY, JSON.stringify(predictionData)],
                [PREDICTION_TIMESTAMP_KEY, new Date().toISOString()],
                [VEHICLE_DATA_KEY, JSON.stringify(cacheData.vehicleInfo)]
            ]);

            console.log('Prediction results cached successfully');
        } catch (error) {
            console.error('Error caching prediction results:', error);
        }
    };

    // Function to get cached prediction data
    const getCachedPrediction = async () => {
        try {
            const cachedPrediction = await AsyncStorage.getItem(BATTERY_PREDICTION_KEY);
            const cachedTimestamp = await AsyncStorage.getItem(PREDICTION_TIMESTAMP_KEY);
            
            if (cachedPrediction && cachedTimestamp) {
                const prediction = JSON.parse(cachedPrediction);
                const timestamp = new Date(cachedTimestamp);
                const now = new Date();
                const hoursSinceCache = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
                
                // Return cached data if less than 24 hours old
                if (hoursSinceCache < 24) {
                    return { prediction, timestamp: cachedTimestamp };
                }
            }
            return null;
        } catch (error) {
            console.error('Error getting cached prediction:', error);
            return null;
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Reset prediction when form changes
        if (prediction) {
            setPrediction(null);
        }
    };

    const validateForm = () => {
        if (!formData.evModel.trim()) {
            Alert.alert('Validation Error', 'Please enter an EV model');
            return false;
        }
        
        if (!formData.chargingDuration.trim()) {
            Alert.alert('Validation Error', 'Please enter charging duration');
            return false;
        }
        
        const duration = parseInt(formData.chargingDuration);
        if (isNaN(duration) || duration <= 0 || duration > 1440) { // Max 24 hours
            Alert.alert('Validation Error', 'Please enter a valid charging duration (1-1440 minutes)');
            return false;
        }
        
        if (!formData.ownerName.trim()) {
            Alert.alert('Validation Error', 'Please enter owner name');
            return false;
        }
        
        return true;
    };

    const handlePrediction = async () => {
        if (!validateForm()) return;
        
        setLoading(true);
        try {
            const chargingDuration = parseInt(formData.chargingDuration);
            
            console.log('Making prediction for:', { evModel: formData.evModel, chargingDuration });
            
            const result = await predictBatteryOptimization(formData.evModel, chargingDuration);
            
            if (result) {
                setPrediction(result);
                
                // Cache the prediction results locally
                await cachePredictionResults(result);
                
                Alert.alert(
                    'Prediction Complete!', 
                    `Battery Health: ${result["Battery Health"]}\nCharging Class: ${result["Charging Duration Class"]}\n\n${result["Recommendation"]}\n\n✅ Results saved locally for battery monitoring.`,
                    [
                        { text: 'OK', style: 'default' },
                        { text: 'View in Monitor', onPress: () => router.push('/(tabs)/monitoring') }
                    ]
                );
            } else {
                Alert.alert('Error', 'Failed to get battery prediction. Please try again.');
            }
        } catch (error) {
            console.error('Prediction error:', error);
            Alert.alert('Error', 'Failed to get battery prediction. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterVehicle = async () => {
        if (!validateForm()) return;
        
        // Cache vehicle data
        const vehicleData = {
            evModel: formData.evModel,
            ownerName: formData.ownerName,
            vehicleYear: formData.vehicleYear,
            batteryCapacity: formData.batteryCapacity,
            registeredAt: new Date().toISOString()
        };
        
        await cacheVehicleData(vehicleData);
        
        Alert.alert(
            'Vehicle Registered!', 
            `${formData.ownerName}'s ${formData.evModel} has been registered successfully.\n\n✅ Vehicle data saved locally.`,
            [
                { text: 'Continue', onPress: () => router.back() }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
            <Text style={styles.title}>Vehicle Registration</Text>
                <Text style={styles.subtitle}>
                    Register your electric vehicle and get battery health predictions
                </Text>

                {/* Owner Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Owner Information</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Owner Name"
                        value={formData.ownerName}
                        onChangeText={(value) => handleInputChange('ownerName', value)}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Vehicle Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vehicle Information</Text>
                    
                    <Text style={styles.label}>EV Model *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter EV Model (e.g., Tesla Model 3, Nissan Leaf)"
                        value={formData.evModel}
                        onChangeText={(value) => handleInputChange('evModel', value)}
                        placeholderTextColor="#999"
                    />
                    <Text style={styles.helpText}>
                        Common models: Tesla Model 3/S/X/Y, Nissan Leaf, Chevrolet Bolt, BMW i3, Audi e-tron
                    </Text>
                    
            <TextInput
                style={styles.input}
                        placeholder="Vehicle Year (Optional)"
                        value={formData.vehicleYear}
                        onChangeText={(value) => handleInputChange('vehicleYear', value)}
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                    />
                    
            <TextInput
                style={styles.input}
                        placeholder="Battery Capacity (kWh) (Optional)"
                        value={formData.batteryCapacity}
                        onChangeText={(value) => handleInputChange('batteryCapacity', value)}
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Charging Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Charging Information</Text>
            <TextInput
                style={styles.input}
                        placeholder="Charging Duration (minutes) *"
                        value={formData.chargingDuration}
                        onChangeText={(value) => handleInputChange('chargingDuration', value)}
                keyboardType="numeric"
                        placeholderTextColor="#999"
                    />
                    <Text style={styles.helpText}>
                        Enter expected or typical charging duration in minutes (e.g., 180 for 3 hours)
                    </Text>
                </View>

                {/* Prediction Results */}
                {prediction && (
                    <View style={styles.predictionCard}>
                        <Text style={styles.predictionTitle}>Battery Prediction Results</Text>
                        <View style={styles.predictionItem}>
                            <Text style={styles.predictionLabel}>EV Model:</Text>
                            <Text style={styles.predictionValue}>{prediction["EV Model"]}</Text>
                        </View>
                        <View style={styles.predictionItem}>
                            <Text style={styles.predictionLabel}>Charging Duration:</Text>
                            <Text style={styles.predictionValue}>{prediction["Charging Duration (min)"]} minutes</Text>
                        </View>
                        <View style={styles.predictionItem}>
                            <Text style={styles.predictionLabel}>Battery Health:</Text>
                            <Text style={[
                                styles.predictionValue, 
                                { color: prediction["Battery Health"] === 'Good' ? '#4CAF50' : 
                                        prediction["Battery Health"] === 'Fair' ? '#FF9800' : '#F44336' }
                            ]}>
                                {prediction["Battery Health"]}
                            </Text>
                        </View>
                        <View style={styles.predictionItem}>
                            <Text style={styles.predictionLabel}>Charging Class:</Text>
                            <Text style={styles.predictionValue}>{prediction["Charging Duration Class"]}</Text>
                        </View>
                        <View style={styles.recommendationContainer}>
                            <Text style={styles.recommendationLabel}>Recommendation:</Text>
                            <Text style={styles.recommendationText}>{prediction["Recommendation"]}</Text>
                        </View>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={[styles.button, styles.predictButton]} 
                        onPress={handlePrediction}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <Text style={styles.buttonText}>Get Battery Prediction</Text>
                        )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.button, styles.registerButton]} 
                        onPress={handleRegisterVehicle}
                        disabled={loading}
                    >
                <Text style={styles.buttonText}>Register Vehicle</Text>
            </TouchableOpacity>
        </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.BACKGROUND,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: isSmallScreen ? 16 : 20,
        paddingVertical: 20,
    },
    title: {
        fontSize: isSmallScreen ? 28 : 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: Colors.light.TEXT,
    },
    subtitle: {
        fontSize: isSmallScreen ? 14 : 16,
        textAlign: 'center',
        marginBottom: 32,
        color: Colors.light.TEXT,
        opacity: 0.7,
        paddingHorizontal: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: Colors.light.TEXT,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: Colors.light.TEXT,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 12,
        color: Colors.light.TEXT,
    },
    helpText: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginTop: -8,
        marginBottom: 12,
    },
    predictionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    predictionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: Colors.light.TEXT,
        textAlign: 'center',
    },
    predictionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingVertical: 4,
    },
    predictionLabel: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    predictionValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.TEXT,
        flex: 1,
        textAlign: 'right',
    },
    recommendationContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    recommendationLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: Colors.light.TEXT,
    },
    recommendationText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#555',
    },
    buttonContainer: {
        gap: 12,
        marginTop: 16,
    },
    button: {
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    predictButton: {
        backgroundColor: '#007AFF',
    },
    registerButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
