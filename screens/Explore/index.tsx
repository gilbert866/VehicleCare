import FloatingChatButton from '@/components/FloatingChatButton/FloatingChatButton';
import { LocationPermissionPrompt } from '@/components/LocationPermissionPrompt';
import { MechanicList } from '@/components/MechanicList';
import { MechanicMarker } from '@/components/MechanicMarker';
import { UserLocationMarker } from '@/components/UserLocationMarker';
import { Colors } from '@/constants/Colors';
import { useLocation } from '@/hooks/useLocation';
import { useMechanics } from '@/hooks/useMechanics';
import { calculateDistance, formatDistance } from '@/utils/distanceCalculation';
import {
    BORDER_RADIUS,
    FONT_SIZES,
    PADDING,
    SPACING,
    getSafeAreaInsets,
    isSmallScreen
} from '@/utils/responsive';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView from 'react-native-maps';
import AppBar from '../../components/AppBar/AppBar';

const ExploreScreen = () => {
    const router = useRouter();
    const { 
        location, 
        loading: locationLoading, 
        error: locationError, 
        permissionStatus,
        showPermissionPrompt,
        getCurrentLocation, 
        useDefaultLocation,
        requestLocationPermission,
        setShowPermissionPrompt
    } = useLocation();
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
    const lastFetchedLocation = useRef<string | null>(null);

    // Get user location on mount
    useEffect(() => {
        const initializeLocation = async () => {
            try {
                console.log('ExploreScreen - Initializing location...');
                await getCurrentLocation();
            } catch (error) {
                console.error('ExploreScreen - Failed to get location on mount:', error);
                // Use default location as fallback
                console.log('ExploreScreen - Falling back to default location');
                useDefaultLocation();
            }
        };

        // Only initialize if we don't have location and aren't currently loading
        if (!location && !locationLoading) {
            console.log('ExploreScreen - No location available, initializing...');
            initializeLocation();
        } else if (location) {
            console.log('ExploreScreen - Location already available:', location);
        }
    }, [location, locationLoading, getCurrentLocation, useDefaultLocation]);

    // Fetch mechanics when location is available
    useEffect(() => {
        if (location && !mechanicsLoading) {
            const locationKey = `${location.latitude.toFixed(6)},${location.longitude.toFixed(6)}`;
            
            // Only fetch if we haven't already fetched for this exact location
            if (lastFetchedLocation.current !== locationKey) {
            console.log('ExploreScreen - Location available, fetching mechanics:', location);
                lastFetchedLocation.current = locationKey;
            fetchMechanics(location);
            } else {
                console.log('ExploreScreen - Already fetched mechanics for this location, skipping');
            }
        }
    }, [location, mechanicsLoading]);

    // Handle location errors
    useEffect(() => {
        if (locationError) {
            console.warn('ExploreScreen - Location error:', locationError);
            // Auto-fallback to default location if there's a persistent error
            if (!location) {
                console.log('ExploreScreen - No location available, using default location');
                useDefaultLocation();
            }
        }
    }, [locationError, location, useDefaultLocation]);

    // Handle mechanics errors
    useEffect(() => {
        if (mechanicsError) {
            // Show a more user-friendly message for "no mechanics found"
            const isNoMechanicsError = mechanicsError.toLowerCase().includes('no mechanics') || 
                                     mechanicsError.toLowerCase().includes('could not be found');
            
            if (isNoMechanicsError) {
                Alert.alert(
                    'No Mechanics Found', 
                    'We couldn\'t find any mechanics in your area at the moment. This might be because:\n\n• There are no registered mechanics nearby\n• Your location is in a remote area\n• Temporary service issues\n\nPlease try again later or consider expanding your search area.',
                    [
                        { text: 'OK', style: 'default' },
                        { text: 'Retry', onPress: () => location && fetchMechanics(location) }
                    ]
                );
            } else {
                Alert.alert('Service Error', mechanicsError);
            }
        }
    }, [mechanicsError, location, fetchMechanics]);

    const handleRetryLocation = async () => {
        try {
            await getCurrentLocation();
        } catch (error) {
            console.error('Location retry error:', error);
            // If location fails, use default location as fallback
            useDefaultLocation();
            Alert.alert(
                'Location Error', 
                'Failed to get your current location. Using default location instead.',
                [
                    { text: 'OK', style: 'default' },
                    { text: 'Try Again', onPress: getCurrentLocation }
                ]
            );
        }
    };

    const handleMechanicPress = (mechanic: any) => {
        // Calculate distance if not provided by backend
        let distance = 0;
        if (mechanic.distance_km !== null && typeof mechanic.distance_km === 'number') {
            distance = mechanic.distance_km;
        } else if (location) {
            distance = calculateDistance(
                location.latitude,
                location.longitude,
                mechanic.latitude,
                mechanic.longitude
            );
        }

        const rating = mechanic.rating && mechanic.user_ratings_total 
            ? `\n⭐ Rating: ${mechanic.rating.toFixed(1)}/5 (${mechanic.user_ratings_total} reviews)`
            : '\n⭐ No ratings yet';
        
        const phone = mechanic.phone_number ? `\n📞 ${mechanic.phone_number}` : '';
        const locationStr = mechanic.location ? `\n📍 ${mechanic.location}` : '';

        // Prepare alert buttons based on whether phone number is available
        const alertButtons: any[] = [
            { text: 'Cancel', style: 'cancel' }
        ];

        if (mechanic.phone_number) {
            alertButtons.push({
                text: '📞 Call',
                onPress: () => handleCallMechanic(mechanic.phone_number!)
            });
        }

        alertButtons.push({
            text: '💬 Chat',
            onPress: () => router.push('/chat')
        });

        Alert.alert(
            mechanic.shop_name,
            `Distance: ${formatDistance(distance)}${rating}${phone}${locationStr}\n\nHow would you like to contact this mechanic?`,
            alertButtons
        );
    };

    const handleCallMechanic = async (phoneNumber: string) => {
        try {
            // Clean the phone number (remove spaces, dashes, etc.)
            const cleanPhoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
            
            // Show confirmation dialog
            Alert.alert(
                'Make Phone Call',
                `Are you sure you want to call ${phoneNumber}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Call', 
                        onPress: async () => {
                            try {
                                // Check if the device can make phone calls
                                const canOpen = await Linking.canOpenURL(`tel:${cleanPhoneNumber}`);
                                
                                if (canOpen) {
                                    await Linking.openURL(`tel:${cleanPhoneNumber}`);
                                } else {
                                    Alert.alert(
                                        'Cannot Make Call',
                                        'Your device cannot make phone calls. Please try calling manually.',
                                        [{ text: 'OK' }]
                                    );
                                }
                            } catch (error) {
                                console.error('Error making phone call:', error);
                                Alert.alert(
                                    'Call Failed',
                                    'Unable to make the phone call. Please try again or call manually.',
                                    [{ text: 'OK' }]
                                );
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error preparing phone call:', error);
            Alert.alert(
                'Call Failed',
                'Unable to prepare the phone call. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const isLoading = locationLoading || mechanicsLoading;
    const safeAreaInsets = getSafeAreaInsets();

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
                        <MapView 
                            style={styles.map} 
                            region={location}
                            onRegionChangeComplete={(region) => {
                                console.log('ExploreScreen - Map region changed:', region);
                            }}
                        >
                            {/* User location marker with custom styling */}
                            <UserLocationMarker coordinate={location} />
                            
                            {/* Mechanic markers - filter out invalid coordinates */}
                            {(() => {
                                const validMechanics = mechanics.filter(mechanic => 
                                    mechanic && 
                                    typeof mechanic.latitude === 'number' && 
                                    typeof mechanic.longitude === 'number' &&
                                    !isNaN(mechanic.latitude) && 
                                    !isNaN(mechanic.longitude)
                                );
                                console.log(`ExploreScreen - Rendering ${validMechanics.length} mechanic markers on map`);
                                
                                return validMechanics.map((mechanic, index) => (
                                    <MechanicMarker
                                        key={`mechanic-${mechanic.id || `${mechanic.latitude}-${mechanic.longitude}-${index}`}`}
                                        mechanic={mechanic}
                                        userLocation={location}
                                        onPress={handleMechanicPress}
                                    />
                                ));
                            })()}
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
                    <View style={[styles.locationInfoPanel, { top: safeAreaInsets.top + (isSmallScreen ? 80 : 100) }]}>
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
                        <View style={[styles.errorBanner, { top: safeAreaInsets.top + (isSmallScreen ? 200 : 240) }]}>
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
                            <Text style={styles.loadingText}>Searching for nearby mechanics...</Text>
                        </View>
                    )}

                    {/* No mechanics found indicator */}
                    {!mechanicsLoading && mechanics.length === 0 && !mechanicsError && (
                        <View style={styles.noMechanicsOverlay}>
                            <Text style={styles.noMechanicsIcon}>🔧</Text>
                            <Text style={styles.noMechanicsTitle}>No Mechanics Found</Text>
                            <Text style={styles.noMechanicsText}>
                                We couldn't find any registered mechanics in your area.
                            </Text>
                            <TouchableOpacity 
                                onPress={() => location && fetchMechanics(location)} 
                                style={styles.retryMechanicsButton}
                            >
                                <Text style={styles.retryMechanicsText}>Search Again</Text>
                            </TouchableOpacity>
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
                    {!isLoading && (
                        <TouchableOpacity 
                            onPress={() => {
                                console.log('Manual location request triggered');
                                handleRetryLocation();
                            }} 
                            style={[styles.retryButton, { marginTop: SPACING.M }]}
                        >
                            <Text style={styles.retryText}>Get Location</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Location Permission Prompt */}
            <LocationPermissionPrompt
                visible={showPermissionPrompt}
                onRequestPermission={requestLocationPermission}
                onDismiss={() => setShowPermissionPrompt(false)}
                onUseDefaultLocation={useDefaultLocation}
            />

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
        padding: PADDING.SCREEN,
    },
    text: {
        fontSize: FONT_SIZES.L,
        color: Colors.light.TEXT,
        marginTop: SPACING.M,
        textAlign: 'center',
    },
    viewToggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        margin: SPACING.L,
        borderRadius: BORDER_RADIUS.M,
        padding: SPACING.XS,
    },
    viewToggleButton: {
        flex: 1,
        paddingVertical: SPACING.S,
        paddingHorizontal: SPACING.L,
        borderRadius: BORDER_RADIUS.S,
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
        fontSize: FONT_SIZES.M,
        fontWeight: '500',
        color: '#666',
    },
    viewToggleTextActive: {
        color: '#007AFF',
        fontWeight: '600',
    },
    locationInfoPanel: {
        position: 'absolute',
        left: SPACING.L,
        right: SPACING.L,
        backgroundColor: '#fff',
        borderRadius: BORDER_RADIUS.L,
        padding: SPACING.M,
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
        width: isSmallScreen ? 28 : 32,
        height: isSmallScreen ? 28 : 32,
        borderRadius: isSmallScreen ? 14 : 16,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.M,
    },
    locationIconText: {
        fontSize: isSmallScreen ? 14 : 16,
    },
    locationDetails: {
        flex: 1,
    },
    locationTitle: {
        fontSize: FONT_SIZES.M,
        fontWeight: '600',
        color: '#333',
        marginBottom: SPACING.XS,
    },
    locationCoords: {
        fontSize: FONT_SIZES.S,
        color: '#666',
    },
    mechanicsCount: {
        backgroundColor: '#f0f8ff',
        paddingHorizontal: SPACING.S,
        paddingVertical: SPACING.XS,
        borderRadius: BORDER_RADIUS.M,
    },
    mechanicsCountText: {
        fontSize: FONT_SIZES.S,
        color: '#007AFF',
        fontWeight: '500',
    },
    errorBanner: {
        position: 'absolute',
        left: SPACING.L,
        right: SPACING.L,
        backgroundColor: '#ffebee',
        padding: SPACING.M,
        borderRadius: BORDER_RADIUS.M,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 5,
    },
    errorText: {
        fontSize: FONT_SIZES.S,
        color: '#c62828',
        flex: 1,
        marginRight: SPACING.S,
    },
    retryButton: {
        backgroundColor: Colors.light.PRIMARY,
        paddingHorizontal: SPACING.M,
        paddingVertical: SPACING.XS,
        borderRadius: BORDER_RADIUS.S,
    },
    retryText: {
        color: '#fff',
        fontSize: FONT_SIZES.S,
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
        marginTop: SPACING.M,
        fontSize: FONT_SIZES.L,
        color: Colors.light.TEXT,
        textAlign: 'center',
    },
    noMechanicsOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: PADDING.SCREEN,
        zIndex: 10,
    },
    noMechanicsIcon: {
        fontSize: isSmallScreen ? 40 : 48,
        marginBottom: SPACING.L,
    },
    noMechanicsTitle: {
        fontSize: FONT_SIZES.XXL,
        fontWeight: '600',
        color: Colors.light.TEXT,
        marginBottom: SPACING.M,
        textAlign: 'center',
    },
    noMechanicsText: {
        fontSize: FONT_SIZES.L,
        color: Colors.light.TEXT,
        opacity: 0.7,
        textAlign: 'center',
        lineHeight: FONT_SIZES.L * 1.4,
        marginBottom: SPACING.L,
    },
    retryMechanicsButton: {
        backgroundColor: Colors.light.PRIMARY,
        paddingHorizontal: SPACING.L,
        paddingVertical: SPACING.M,
        borderRadius: BORDER_RADIUS.M,
    },
    retryMechanicsText: {
        color: '#fff',
        fontSize: FONT_SIZES.L,
        fontWeight: '600',
    },
});
