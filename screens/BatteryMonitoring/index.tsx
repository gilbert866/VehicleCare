import FloatingChatButton from '@/components/FloatingChatButton/FloatingChatButton';
import { useBattery } from '@/hooks/useBattery';
import { styles } from '@/styles/common';
import { formattingUtils } from '@/utils/formatting';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, Text, View } from 'react-native';

export default function BatteryMonitoringScreen() {
    const router = useRouter();
    const { batteryInfo, loading, error, refreshBatteryLevel } = useBattery();

    React.useEffect(() => {
        if (error) {
            Alert.alert('Error', error);
        }
    }, [error]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Battery Monitoring</Text>
            <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5102/5102796.png' }}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.description}>
                {loading 
                    ? 'Loading battery information...' 
                    : `Battery level: ${formattingUtils.formatBatteryLevel(batteryInfo.level)}`
                }
            </Text>
            {batteryInfo.isCharging !== undefined && (
                <Text style={styles.description}>
                    Status: {formattingUtils.formatBatteryStatus(batteryInfo.level, batteryInfo.isCharging)}
                </Text>
            )}
            <FloatingChatButton onPress={() => router.push('/chat')} />
        </View>
    );
}

