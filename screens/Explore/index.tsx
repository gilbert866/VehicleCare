import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Platform,
} from 'react-native';
import AppBar from '../../components/AppBar/AppBar';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '@/constants/Colors';
import FloatingChatButton from '@/components/FloatingChatButton/FloatingChatButton';
import { useRouter } from 'expo-router';
import SearchBar from '@/components/SeacrchBar/SearchBar';
import axios from 'axios';


const GOOGLE_API_KEY = 'AIzaSyCWrJ81TE0pvadRMKxwSvNk2Ja_1oqnY6k'; // To be moved into env for production

const ExploreScreen = () => {
    const [region, setRegion] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [places, setPlaces] = useState<any[]>([]);
    const router = useRouter();

    // Get user location once
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        })();
    }, []);

    // Debounced search effect
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchQuery.trim()) {
                searchPlaces(searchQuery);
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const searchPlaces = async (query: string) => {
        if (!region) return;
        const { latitude, longitude } = region;

        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&keyword=${encodeURIComponent(
            query
        )}&key=${GOOGLE_API_KEY}`;

        try {
            const res = await axios.get(url);
            setPlaces(res.data.results);
        } catch (err) {
            console.error('Places API error:', err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <AppBar title="Explore" />
            {region ? (
                <>
                    <MapView style={styles.map} region={region}>
                        <Marker coordinate={region} title="You are here" />
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
                    <Text style={styles.text}>Loading map...</Text>
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
