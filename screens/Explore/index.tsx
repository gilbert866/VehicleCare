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
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AppBar from '../../components/AppBar/AppBar';

const ExploreScreen = () => {
    const router = useRouter();
    const { location, loading: locationLoading, error: locationError } = useLocation();
    const { places, searchQuery, setSearchQuery, loading: placesLoading, error: placesError } = usePlaces(location);

    React.useEffect(() => {
        if (locationError) {
            Alert.alert('Location Error', locationError);
        }
    }, [locationError]);

    React.useEffect(() => {
        if (placesError) {
            Alert.alert('Search Error', placesError);
        }
    }, [placesError]);

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
                </>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.light.PRIMARY} />
                    <Text style={styles.text}>
                        {isLoading ? 'Loading map...' : 'Unable to load location'}
                    </Text>
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
    },
    text: {
        fontSize: 16,
        color: Colors.light.TEXT,
        marginTop: 12,
    },
    searchWrapper: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 100 : 80,
        left: 16,
        right: 16,
        zIndex: 10,
    },
});
