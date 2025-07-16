import FloatingChatButton from '@/components/FloatingChatButton/FloatingChatButton';
import SearchBar from '@/components/SeacrchBar/SearchBar';
import { Colors } from '@/constants/Colors';
import { useLocation } from '@/hooks/useLocation';
import { usePlaces } from '@/hooks/usePlaces';
import { useRouter } from 'expo-router';
import React from 'react';
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
import MapView, { Marker } from 'react-native-maps';
import AppBar from '../../components/AppBar/AppBar';

const ExploreScreen = () => {
    const router = useRouter();
    const { location, loading: locationLoading, error: locationError, retryLocation } = useLocation();
    const { places, searchQuery, setSearchQuery, loading: placesLoading, error: placesError } = usePlaces(location);

    React.useEffect(() => {
        if (locationError) {
            // Don't show alert immediately, let user see the error state first
            console.warn('Location error:', locationError);
        }
    }, [locationError]);

    React.useEffect(() => {
        if (placesError) {
            Alert.alert('Search Error', placesError);
        }
    }, [placesError]);

    const handleRetryLocation = async () => {
        try {
            await retryLocation();
        } catch (error) {
            Alert.alert('Location Error', 'Failed to get location. Please check your device settings.');
        }
    };

    const isLoading = locationLoading || placesLoading;

    return (
        <SafeAreaView style={styles.container}>
            <AppBar title="Explore" />
            {location ? (
                <>
                    <MapView style={styles.map} region={location}>
                        <Marker coordinate={location} title="You are here" />
                        {places.map((place) => (
                            <Marker
                                key={place.place_id}
                                coordinate={{
                                    latitude: place.geometry.location.lat,
                                    longitude: place.geometry.location.lng,
                                }}
                                title={place.name}
                                description={place.vicinity}
                            />
                        ))}
                    </MapView>

                    {/* Floating SearchBar */}
                    <View style={styles.searchWrapper}>
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search mechanics..."
                        />
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
    searchWrapper: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 100 : 80,
        left: 16,
        right: 16,
        zIndex: 10,
    },
    errorBanner: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 160 : 140,
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
});
