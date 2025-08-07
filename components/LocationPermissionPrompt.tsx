import { Colors } from '@/constants/Colors';
import {
    BORDER_RADIUS,
    FONT_SIZES,
    PADDING,
    SPACING,
    isSmallScreen
} from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    BackHandler,
    Linking,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface LocationPermissionPromptProps {
    visible: boolean;
    onRequestPermission: () => Promise<void>;
    onDismiss: () => void;
    onUseDefaultLocation: () => void;
}

export const LocationPermissionPrompt: React.FC<LocationPermissionPromptProps> = ({
    visible,
    onRequestPermission,
    onDismiss,
    onUseDefaultLocation,
}) => {
    const [isRequesting, setIsRequesting] = useState(false);
    const [hasAttemptedPermission, setHasAttemptedPermission] = useState(false);

    // Prevent back button from dismissing the modal on Android
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (visible) {
                // Show confirmation dialog instead of dismissing
                Alert.alert(
                    'Location Required',
                    'Location access is needed to find nearby mechanics. Are you sure you want to continue without location?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Continue Without Location', onPress: onUseDefaultLocation },
                    ]
                );
                return true; // Prevent default back behavior
            }
            return false;
        });

        return () => backHandler.remove();
    }, [visible, onUseDefaultLocation]);

    const handleRequestPermission = async () => {
        setIsRequesting(true);
        setHasAttemptedPermission(true);
        try {
            await onRequestPermission();
        } catch (error) {
            console.error('Permission request failed:', error);
            // Don't auto-dismiss on error, let user try again
        } finally {
            setIsRequesting(false);
        }
    };

    const openDeviceLocationSettings = () => {
        Alert.alert(
            'Enable Device Location',
            'To find nearby mechanics, you need to turn on location services on your device.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open Settings',
                    onPress: () => {
                        if (Platform.OS === 'ios') {
                            // Open iOS Location Services settings
                            Linking.openURL('App-Prefs:Privacy&path=LOCATION');
                        } else {
                            // Open Android Location settings
                            Linking.openSettings();
                        }
                    },
                },
            ]
        );
    };

    const openAppLocationSettings = () => {
        Alert.alert(
            'Enable App Location Access',
            'Please allow VehicleCare to access your location to find nearby mechanics.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open Settings',
                    onPress: () => {
                        if (Platform.OS === 'ios') {
                            Linking.openURL('app-settings:');
                        } else {
                            Linking.openSettings();
                        }
                    },
                },
            ]
        );
    };

    const handleDismiss = () => {
        if (hasAttemptedPermission) {
            // If user has attempted permission, show confirmation
            Alert.alert(
                'Location Access Required',
                'Location access is needed to find nearby mechanics. Would you like to continue without location or try again?',
                [
                    { text: 'Try Again', onPress: handleRequestPermission },
                    { text: 'Continue Without Location', onPress: onUseDefaultLocation },
                    { text: 'Cancel', style: 'cancel' },
                ]
            );
        } else {
            // If user hasn't tried yet, just dismiss
            onDismiss();
        }
    };

    const getInstructions = () => {
        if (Platform.OS === 'ios') {
            return [
                '1. Go to Settings > Privacy & Security > Location Services',
                '2. Turn ON "Location Services"',
                '3. Find "VehicleCare" and set to "While Using App"',
                '4. Return to the app and tap "Enable Location Access"'
            ];
        } else {
            return [
                '1. Go to Settings > Location',
                '2. Turn ON "Location"',
                '3. Go to Settings > Apps > VehicleCare > Permissions',
                '4. Enable "Location" permission',
                '5. Return to the app and tap "Enable Location Access"'
            ];
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleDismiss}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Ionicons 
                                name="location" 
                                size={isSmallScreen ? 32 : 40} 
                                color={Colors.light.PRIMARY} 
                            />
                        </View>
                        <Text style={styles.title}>Enable Location Access</Text>
                        <Text style={styles.subtitle}>
                            We need your location to find nearby mechanics and provide you with the best service.
                        </Text>
                    </View>

                    {/* Instructions */}
                    <View style={styles.instructionsContainer}>
                        <Text style={styles.instructionsTitle}>How to enable location:</Text>
                        {getInstructions().map((instruction, index) => (
                            <View key={index} style={styles.instructionRow}>
                                <Text style={styles.instructionText}>{instruction}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Benefits */}
                    <View style={styles.benefitsContainer}>
                        <Text style={styles.benefitsTitle}>Benefits of enabling location:</Text>
                        <View style={styles.benefitItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.benefitText}>Find mechanics closest to you</Text>
                        </View>
                        <View style={styles.benefitItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.benefitText}>Get accurate distance calculations</Text>
                        </View>
                        <View style={styles.benefitItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.benefitText}>Receive location-based recommendations</Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.primaryButton, isRequesting && styles.buttonDisabled]}
                            onPress={handleRequestPermission}
                            disabled={isRequesting}
                        >
                            <Ionicons 
                                name="location" 
                                size={20} 
                                color="white" 
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.primaryButtonText}>
                                {isRequesting ? 'Requesting...' : 'Enable Location Access'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={openDeviceLocationSettings}
                        >
                            <Ionicons 
                                name="settings" 
                                size={18} 
                                color={Colors.light.TEXT} 
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.secondaryButtonText}>Turn On Device Location</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.tertiaryButton}
                            onPress={openAppLocationSettings}
                        >
                            <Text style={styles.tertiaryButtonText}>App Location Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={onUseDefaultLocation}
                        >
                            <Text style={styles.skipButtonText}>Use Default Location</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.dismissButton}
                            onPress={handleDismiss}
                        >
                            <Text style={styles.dismissButtonText}>Maybe Later</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Privacy Note */}
                    <View style={styles.privacyContainer}>
                        <Ionicons name="shield-checkmark" size={16} color="#666" />
                        <Text style={styles.privacyText}>
                            Your location is only used to find nearby mechanics and is never shared with third parties.
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: PADDING.SCREEN,
    },
    container: {
        backgroundColor: 'white',
        borderRadius: BORDER_RADIUS.XL,
        padding: PADDING.SCREEN,
        width: '100%',
        maxWidth: 400,
        maxHeight: '90%',
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.L,
    },
    iconContainer: {
        width: isSmallScreen ? 60 : 80,
        height: isSmallScreen ? 60 : 80,
        borderRadius: isSmallScreen ? 30 : 40,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.M,
    },
    title: {
        fontSize: FONT_SIZES.XXL,
        fontWeight: 'bold',
        color: Colors.light.TEXT,
        textAlign: 'center',
        marginBottom: SPACING.S,
    },
    subtitle: {
        fontSize: FONT_SIZES.M,
        color: '#666',
        textAlign: 'center',
        lineHeight: FONT_SIZES.M * 1.4,
    },
    instructionsContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: BORDER_RADIUS.M,
        padding: PADDING.CARD,
        marginBottom: SPACING.L,
    },
    instructionsTitle: {
        fontSize: FONT_SIZES.L,
        fontWeight: '600',
        color: Colors.light.TEXT,
        marginBottom: SPACING.S,
    },
    instructionRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: SPACING.XS,
    },
    instructionText: {
        fontSize: FONT_SIZES.S,
        color: '#555',
        lineHeight: FONT_SIZES.S * 1.3,
        flex: 1,
    },
    benefitsContainer: {
        marginBottom: SPACING.L,
    },
    benefitsTitle: {
        fontSize: FONT_SIZES.L,
        fontWeight: '600',
        color: Colors.light.TEXT,
        marginBottom: SPACING.S,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.XS,
    },
    benefitText: {
        fontSize: FONT_SIZES.S,
        color: '#555',
        marginLeft: SPACING.XS,
    },
    buttonContainer: {
        gap: SPACING.S,
        marginBottom: SPACING.L,
    },
    primaryButton: {
        backgroundColor: Colors.light.PRIMARY,
        borderRadius: BORDER_RADIUS.M,
        paddingVertical: SPACING.M,
        paddingHorizontal: SPACING.L,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonIcon: {
        marginRight: SPACING.S,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: FONT_SIZES.L,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#f8f9fa',
        borderRadius: BORDER_RADIUS.M,
        paddingVertical: SPACING.M,
        paddingHorizontal: SPACING.L,
        borderWidth: 1,
        borderColor: '#dee2e6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: Colors.light.TEXT,
        fontSize: FONT_SIZES.M,
        fontWeight: '500',
        textAlign: 'center',
    },
    tertiaryButton: {
        backgroundColor: '#e9ecef',
        borderRadius: BORDER_RADIUS.M,
        paddingVertical: SPACING.S,
        paddingHorizontal: SPACING.L,
        borderWidth: 1,
        borderColor: '#ced4da',
    },
    tertiaryButtonText: {
        color: '#495057',
        fontSize: FONT_SIZES.S,
        fontWeight: '500',
        textAlign: 'center',
    },
    skipButton: {
        backgroundColor: 'transparent',
        paddingVertical: SPACING.S,
    },
    skipButtonText: {
        color: '#666',
        fontSize: FONT_SIZES.S,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    dismissButton: {
        backgroundColor: 'transparent',
        paddingVertical: SPACING.S,
    },
    dismissButtonText: {
        color: '#999',
        fontSize: FONT_SIZES.S,
        textAlign: 'center',
    },
    privacyContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f0f8ff',
        borderRadius: BORDER_RADIUS.S,
        padding: SPACING.S,
    },
    privacyText: {
        fontSize: FONT_SIZES.XS,
        color: '#666',
        marginLeft: SPACING.XS,
        flex: 1,
        lineHeight: FONT_SIZES.XS * 1.3,
    },
}); 