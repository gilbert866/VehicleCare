import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import AppBar from '../../components/AppBar/AppBar';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '@/constants/Colors';
import FloatingChatButton from '@/components/FloatingChatButton/FloatingChatButton';
import { useRouter } from 'expo-router';

const ExploreScreen = () => {
    const [region, setRegion] = useState(null);
    const router = useRouter();

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

    return (
        <SafeAreaView style={styles.container}>
            <AppBar title="Explore" />
            {region ? (
                <MapView style={styles.map} region={region}>
                    <Marker coordinate={region} title="You are here" />
                </MapView>
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
});
