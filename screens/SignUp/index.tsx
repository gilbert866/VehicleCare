import { useAuth } from '@/hooks/useAuth';
import { styles } from '@/styles/common';
import { validateUsername } from '@/utils/usernameGenerator';
import { validationUtils } from '@/utils/validation';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                editable={!loading}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
            />
            <TextInput
                style={[styles.input, usernameError && styles.inputError]}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!loading}
            />
            {usernameError && (
                <Text style={styles.errorText}>{usernameError}</Text>
            )}
            <Text style={{ 
                color: '#666', 
                fontSize: 11, 
                marginBottom: 10,
                fontStyle: 'italic'
            }}>
                Choose a unique username for your account (3-30 characters, letters, numbers, underscores)
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
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
    );
}
