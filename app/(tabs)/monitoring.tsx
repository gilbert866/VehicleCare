import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '@/styles/common';

export default function BatteryMonitoringScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Battery Monitoring</Text>
            <Image
                source={{ uri: 'https://via.placeholder.com/150' }}
                style={styles.image}
            />
            <Text style={styles.description}>
                Akouwa&#39;s GLI Coupe has an average battery health...
            </Text>
        </View>
    );
}
