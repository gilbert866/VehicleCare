import { useAuth } from '@/hooks/useAuth';
import { styles } from '@/styles/common';
import { validationUtils } from '@/utils/validation';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        const validation = validationUtils.validateAuthCredentials({
            name,
            email,
            password,
        });

        const newErrors: string[] = [];

        if (!validation.isValid) {
            newErrors.push(...validation.errors);
        }

        if (password !== confirmPassword) {
            newErrors.push('Passwords do not match');
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            Alert.alert('Validation Error', newErrors.join('\n'));
            return;
        }

        setErrors([]);
        setLoading(true);

        try {
            await signUp(email, password, name);
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
                placeholder="Name"
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
