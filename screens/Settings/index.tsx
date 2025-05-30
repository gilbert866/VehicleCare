import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import AppBar from '../../components/AppBar/AppBar';
import { Colors } from '@/constants/Colors';

const SettingsScreen: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    return (
        <View style={styles.container}>
            <AppBar title="Settings" />
            <View style={styles.content}>
                <Text style={styles.label}>Enable Dark Mode</Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={setIsDarkMode}
                    trackColor={{ false: '#ccc', true: Colors.light.PRIMARY }}
                    thumbColor={isDarkMode ? Colors.light.PRIMARY : '#f4f3f4'}
                />
            </View>
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.BACKGROUND,
    },
    content: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        color: Colors.light.TEXT,
    },
});
