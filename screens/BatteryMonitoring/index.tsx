import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '@/styles/common';
import FloatingChatButton from '@/components/FloatingChatButton/FloatingChatButton';

export default function BatteryMonitoringScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Battery Monitoring</Text>
            <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5102/5102796.png' }}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.description}>
                Akouwa&#39;s GLI Coupe has an average battery health...
            </Text>
            <FloatingChatButton onPress={() => {
                // navigate to chat screen or open chat modal
            }} />
        </View>
    );
}

