import FloatingChatButton from '@/components/FloatingChatButton/FloatingChatButton';
import { MechanicList } from '@/components/MechanicList';
import { MechanicMarker } from '@/components/MechanicMarker';
import SearchBar from '@/components/SeacrchBar/SearchBar';
import { UserLocationMarker } from '@/components/UserLocationMarker';
import { Colors } from '@/constants/Colors';
import { useLocation } from '@/hooks/useLocation';
import { useMechanics } from '@/hooks/useMechanics';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView from 'react-native-maps';
import AppBar from '../../components/AppBar/AppBar';

const ExploreScreen = () => {
    const router = useRouter();
    const { location, loading: locationLoading, error: locationError, retryLocation } = useLocation();
    const { 
        mechanics, 
        loading: mechanicsLoading, 
        error: mechanicsError, 
        hasMorePages,
        fetchMechanics, 
        loadMoreMechanics, 
        refreshMechanics 
    } = useMechanics();
    
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [selectedMechanic, setSelectedMechanic] = useState<any>(null);

    // Fetch mechanics when location is available
    useEffect(() => {
        if (location && !mechanicsLoading) {
            fetchMechanics(location);
        }
    }, [location, fetchMechanics]);

    // Handle location errors
    useEffect(() => {
        if (locationError) {
            console.warn('Location error:', locationError);
        }
    }, [locationError]);

    // Handle mechanics errors
    useEffect(() => {
        if (mechanicsError) {
            Alert.alert('Mechanics Error', mechanicsError);
        }
    }, [mechanicsError]);

    const handleRetryLocation = async () => {
        try {
            await retryLocation();
        } catch (error) {
            Alert.alert('Location Error', 'Failed to get location. Please check your device settings.');
        }
    };

    const handleMechanicPress = (mechanic: any) => {
        setSelectedMechanic(mechanic);
        // You can navigate to a mechanic detail screen here
        Alert.alert(
            mechanic.shop_name,
            `Distance: ${mechanic.distance_km.toFixed(1)} km\n\nWould you like to contact this mechanic?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Contact', onPress: () => router.push('/chat') }
            ]
        );
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'map' ? 'list' : 'map');
    };

    const isLoading = locationLoading || mechanicsLoading;

    return (
        <SafeAreaView style={styles.container}>
            <AppBar title="Explore" />
            
            {location ? (
                <>
                    {/* View Mode Toggle */}
                    <View style={styles.viewToggleContainer}>
                        <TouchableOpacity 
                            style={[styles.viewToggleButton, viewMode === 'map' && styles.viewToggleActive]}
                            onPress={() => setViewMode('map')}
                        >
                            <Text style={[styles.viewToggleText, viewMode === 'map' && styles.viewToggleTextActive]}>
                                Map
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.viewToggleButton, viewMode === 'list' && styles.viewToggleActive]}
                            onPress={() => setViewMode('list')}
                        >
                            <Text style={[styles.viewToggleText, viewMode === 'list' && styles.viewToggleTextActive]}>
                                List
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {viewMode === 'map' ? (
                        <MapView style={styles.map} region={location}>
                            {/* User location marker with custom styling */}
                            <UserLocationMarker coordinate={location} />
                            
                            {/* Mechanic markers - filter out invalid coordinates */}
                            {mechanics
                                .filter(mechanic => 
                                    mechanic && 
                                    typeof mechanic.latitude === 'number' && 
                                    typeof mechanic.longitude === 'number' &&
                                    !isNaN(mechanic.latitude) && 
                                    !isNaN(mechanic.longitude)
                                )
                                .map((mechanic) => (
                                    <MechanicMarker
                                        key={`mechanic-${mechanic.id}`}
                                        mechanic={mechanic}
                                        onPress={handleMechanicPress}
                                    />
                                ))}
                        </MapView>
                    ) : (
                        <MechanicList
                            mechanics={mechanics}
                            loading={mechanicsLoading}
                            hasMorePages={hasMorePages}
                            onMechanicPress={handleMechanicPress}
                            onLoadMore={loadMoreMechanics}
                            onRefresh={refreshMechanics}
                        />
                    )}

                    {/* Location Info Panel */}
                    <View style={styles.locationInfoPanel}>
                        <View style={styles.locationIcon}>
                            <Text style={styles.locationIconText}>📍</Text>
                        </View>
                        <View style={styles.locationDetails}>
                            <Text style={styles.locationTitle}>Your Location</Text>
                            <Text style={styles.locationCoords}>
                                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                            </Text>
                        </View>
                        <View style={styles.mechanicsCount}>
                            <Text style={styles.mechanicsCountText}>
                                {mechanics.length} {mechanics.length === 1 ? 'mechanic' : 'mechanics'} nearby
                            </Text>
                        </View>
                    </View>
                    {/* Show location error banner if there's an error but we have a fallback location */}
                    {locationError && (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorText}>
                                Using default location. {locationError}
                            </Text>
                            <TouchableOpacity onPress={handleRetryLocation} style={styles.retryButton}>
                                <Text style={styles.retryText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Mechanics loading indicator */}
                    {mechanicsLoading && mechanics.length === 0 && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color={Colors.light.PRIMARY} />
                            <Text style={styles.loadingText}>Finding nearby mechanics...</Text>
                        </View>
                    )}
                </>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.light.PRIMARY} />
                    <Text style={styles.text}>
                        {isLoading ? 'Loading map...' : 'Unable to load location'}
                    </Text>
                    {locationError && !isLoading && (
                        <TouchableOpacity onPress={handleRetryLocation} style={styles.retryButton}>
                            <Text style={styles.retryText}>Retry Location</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <FloatingChatButton onPress={() => router.push('/chat')} />
        </SafeAreaView>
    );
};

export default ExploreScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.BACKGROUND,
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    text: {
        fontSize: 16,
        color: Colors.light.TEXT,
        marginTop: 12,
        textAlign: 'center',
    },
    viewToggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        margin: 16,
        borderRadius: 8,
        padding: 4,
    },
    viewToggleButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    viewToggleActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    viewToggleText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    viewToggleTextActive: {
        color: '#007AFF',
        fontWeight: '600',
    },
    locationInfoPanel: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 100 : 80,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 5,
    },
    locationIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    locationIconText: {
        fontSize: 16,
    },
    locationDetails: {
        flex: 1,
    },
    locationTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    locationCoords: {
        fontSize: 12,
        color: '#666',
    },
    mechanicsCount: {
        backgroundColor: '#f0f8ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    mechanicsCountText: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '500',
    },
    searchWrapper: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 180 : 160,
        left: 16,
        right: 16,
        zIndex: 10,
    },
    errorBanner: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 240 : 220,
        left: 16,
        right: 16,
        backgroundColor: '#ffebee',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 5,
    },
    errorText: {
        fontSize: 12,
        color: '#c62828',
        flex: 1,
        marginRight: 8,
    },
    retryButton: {
        backgroundColor: Colors.light.PRIMARY,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    retryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: Colors.light.TEXT,
        textAlign: 'center',
    },
});
