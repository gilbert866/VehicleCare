import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import AppBar from '../../components/AppBar/AppBar';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const SettingsScreen: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [language, setLanguage] = React.useState<'en' | 'fr'>('en');
    const router = useRouter();

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'fr' : 'en'));
    };

    const handleLogout = () => {
        Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                    // Clear session and navigate to login
                    router.replace('/signin');
                },
            },
        ]);
    };

    const goToRegisterVehicle = () => {
        router.push('/register'); // Make sure this screen exists
    };

    return (
        <View style={styles.container}>
            <AppBar title="Settings" />

            {/* Profile */}
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: 'https://i.pravatar.cc/100' }}
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.name}>John Doe</Text>
                    <Text style={styles.email}>john.doe@example.com</Text>
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Settings List */}
            <TouchableOpacity style={styles.settingItem} onPress={goToRegisterVehicle}>
                <View style={styles.iconText}>
                    <Ionicons name="car-sport-outline" size={20} color={Colors.light.TEXT} style={styles.icon} />
                    <Text style={styles.settingText}>Register a Vehicle</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.settingItem}>
                <View style={styles.iconText}>
                    <Ionicons name="moon-outline" size={20} color={Colors.light.TEXT} style={styles.icon} />
                    <Text style={styles.settingText}>Enable Dark Mode</Text>
                </View>
                <Switch
                    value={isDarkMode}
                    onValueChange={setIsDarkMode}
                    trackColor={{ false: '#ccc', true: Colors.light.PRIMARY }}
                    thumbColor={isDarkMode ? Colors.light.PRIMARY : '#f4f3f4'}
                />
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={toggleLanguage}>
                <View style={styles.iconText}>
                    <Ionicons name="language-outline" size={20} color={Colors.light.TEXT} style={styles.icon} />
                    <Text style={styles.settingText}>Language: {language.toUpperCase()}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.logout]} onPress={handleLogout}>
                <View style={styles.iconText}>
                    <Ionicons name="log-out-outline" size={20} color="#D32F2F" style={styles.icon} />
                    <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.BACKGROUND,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.TEXT,
    },
    email: {
        fontSize: 14,
        color: '#888',
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 12,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingText: {
        fontSize: 16,
        color: Colors.light.TEXT,
    },
    logout: {
        marginTop: 24,
    },
    logoutText: {
        color: '#D32F2F',
    },
    iconText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
});
