import { useAuth } from '@/hooks/useAuth';
import { styles } from '@/styles/common';
import { PADDING, SPACING } from '@/utils/responsive';
import { validateUsername } from '@/utils/usernameGenerator';
import { validationUtils } from '@/utils/validation';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Validate username when it changes
    useEffect(() => {
        if (username) {
            const validation = validateUsername(username);
            if (!validation.isValid) {
                setUsernameError(validation.error || '');
            } else {
                setUsernameError('');
            }
        } else {
            setUsernameError('');
        }
    }, [username]);

    const handleSignUp = async () => {
        const validation = validationUtils.validateRegistrationCredentials({
            name,
            email,
            username,
            password,
        });

        if (!validation.isValid) {
            setErrors(validation.errors);
            Alert.alert('Validation Error', validation.errors.join('\n'));
            return;
        }

        if (password !== confirmPassword) {
            setErrors(['Passwords do not match']);
            Alert.alert('Validation Error', 'Passwords do not match');
            return;
        }

        setErrors([]);
        setLoading(true);

        try {
            await signUp(email, password, name, username);
            router.replace('/(tabs)/explore');
        } catch (error: any) {
            setErrors([error.message]);
            Alert.alert('Sign Up Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.flex1}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[styles.flex1, styles.centered, { paddingHorizontal: PADDING.SCREEN }]}>
                    <Text style={styles.title}>Create Account</Text>
                    
                    <View style={{ width: '100%', maxWidth: 400 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            editable={!loading}
                            autoComplete="name"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                            autoComplete="email"
                        />
                        <TextInput
                            style={[styles.input, usernameError && styles.inputError]}
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            editable={!loading}
                            autoComplete="username"
                        />
                        {usernameError && (
                            <Text style={styles.errorText}>{usernameError}</Text>
                        )}
                        <Text style={[styles.textSmall, { 
                            color: '#666', 
                            marginBottom: SPACING.S,
                            fontStyle: 'italic',
                            textAlign: 'center'
                        }]}>
                            Choose a unique username for your account (3-30 characters, letters, numbers, underscores)
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            editable={!loading}
                            autoComplete="new-password"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            editable={!loading}
                            autoComplete="new-password"
                        />
                        
                        <TouchableOpacity 
                            style={[styles.button, loading && styles.buttonDisabled]} 
                            onPress={handleSignUp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => router.push('/signin')} disabled={loading}>
                            <Text style={styles.link}>Already have an account? Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
