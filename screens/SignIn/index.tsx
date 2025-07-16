import { useAuth } from '@/hooks/useAuth';
import { styles } from '@/styles/common';
import { validationUtils } from '@/utils/validation';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        const validation = validationUtils.validateAuthCredentials({
            name: '', // Not needed for sign in
            email,
            password,
        });

        if (!validation.isValid) {
            setErrors(validation.errors);
            Alert.alert('Validation Error', validation.errors.join('\n'));
            return;
        }

        setErrors([]);
        setLoading(true);

        try {
            await signIn(email, password);
            router.replace('/(tabs)/explore');
        } catch (error: any) {
            setErrors([error.message]);
            Alert.alert('Sign In Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>
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
            <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleSignIn}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/signup')} disabled={loading}>
                <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}
