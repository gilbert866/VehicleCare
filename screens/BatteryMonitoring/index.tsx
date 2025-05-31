import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '@/styles/common';
import * as Battery from 'expo-battery';
import { useRouter } from 'expo-router';
import FloatingChatButton from '@/components/FloatingChatButton/FloatingChatButton';

export default function BatteryMonitoringScreen() {

    const [level, setLevel] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        Battery.getBatteryLevelAsync().then((lvl) => {
            setLevel(Math.round(lvl * 100));
        });
    }, []);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Battery Monitoring</Text>
            <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5102/5102796.png' }}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.description}>
                Battery level: {level !== null ? `${level}%` : 'Loading...'}
            </Text>
            <FloatingChatButton onPress={() => router.push('/chat')} />
        </View>
    );
}

