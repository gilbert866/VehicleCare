import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import AppBar from '../../components/AppBar/AppBar';
import {Colors} from '@/constants/Colors';
import { useRouter } from 'expo-router';
import FloatingChatButton from "@/components/FloatingChatButton/FloatingChatButton";

const HomeScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <AppBar title="VehicleCare" />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.welcome}>Welcome back!</Text>
                <Text style={styles.subtitle}>Find nearby repair shops with ease.</Text>
                <Image
                    style={styles.image}
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/854/854894.png' }}
                />
            </ScrollView>
            <FloatingChatButton onPress={() => router.push('/chat')} />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.BACKGROUND,
    },
    content: {
        padding: 16,
        alignItems: 'center',
    },
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.TEXT,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.TEXT,
        marginVertical: 10,
        textAlign: 'center',
    },
    image: {
        width: 160,
        height: 160,
        marginTop: 20,
    },
});
