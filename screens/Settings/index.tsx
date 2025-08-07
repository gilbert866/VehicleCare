import { UserProfile } from '@/components/UserProfile';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { FONT_SIZES, ICON_SIZES, PADDING, SPACING } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../components/AppBar/AppBar';

const SettingsScreen: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [language, setLanguage] = React.useState<'en' | 'fr'>('en');
    const router = useRouter();
    const { user, signOut } = useAuth();

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'fr' : 'en'));
    };

    const handleLogout = () => {
        Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await signOut();
                        router.replace('/');
                    } catch (error: any) {
                        Alert.alert('Error', 'Failed to logout. Please try again.');
                    }
                },
            },
        ]);
    };

    const goToRegisterVehicle = () => {
        router.push('/register'); // Make sure this screen exists
    };

    return (
        <SafeAreaView style={styles.container}>
            <AppBar title="Settings" />

            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
            {/* Profile */}
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: 'https://i.pravatar.cc/100' }}
                    style={styles.avatar}
                />
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>{user?.username || 'User'}</Text>
                    <Text style={styles.email}>{user?.email || 'No email'}</Text>
                    {user?.username && (
                        <Text style={styles.username}>@{user.username}</Text>
                    )}
                </View>
            </View>

            {/* User Profile Details */}
            <UserProfile showUsername={true} showEmail={true} showName={true} />

            {/* Divider */}
            <View style={styles.divider} />

            {/* Settings List */}
                <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem} onPress={goToRegisterVehicle}>
                <View style={styles.iconText}>
                            <Ionicons name="car-sport-outline" size={ICON_SIZES.M} color={Colors.light.TEXT} style={styles.icon} />
                    <Text style={styles.settingText}>Register a Vehicle</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.settingItem}>
                <View style={styles.iconText}>
                            <Ionicons name="moon-outline" size={ICON_SIZES.M} color={Colors.light.TEXT} style={styles.icon} />
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
                            <Ionicons name="language-outline" size={ICON_SIZES.M} color={Colors.light.TEXT} style={styles.icon} />
                    <Text style={styles.settingText}>Language: {language.toUpperCase()}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.logout]} onPress={handleLogout}>
                <View style={styles.iconText}>
                            <Ionicons name="log-out-outline" size={ICON_SIZES.M} color="#D32F2F" style={styles.icon} />
                    <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
                </View>
            </TouchableOpacity>
        </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.BACKGROUND,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: SPACING.XXL,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.L,
        paddingHorizontal: PADDING.SCREEN,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: SPACING.L,
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: FONT_SIZES.XL,
        fontWeight: '600',
        color: Colors.light.TEXT,
        marginBottom: SPACING.XS,
    },
    email: {
        fontSize: FONT_SIZES.M,
        color: '#888',
        marginBottom: SPACING.XS,
    },
    username: {
        fontSize: FONT_SIZES.S,
        color: '#007AFF',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: SPACING.M,
        marginHorizontal: PADDING.SCREEN,
    },
    settingsContainer: {
        paddingHorizontal: PADDING.SCREEN,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.L,
        paddingHorizontal: SPACING.M,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingText: {
        fontSize: FONT_SIZES.L,
        color: Colors.light.TEXT,
    },
    logout: {
        marginTop: SPACING.L,
        borderBottomWidth: 0,
    },
    logoutText: {
        color: '#D32F2F',
    },
    iconText: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: SPACING.M,
    },
});
