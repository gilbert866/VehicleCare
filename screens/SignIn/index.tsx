import { useAuth } from '@/hooks/useAuth';
import { styles } from '@/styles/common';
import { PADDING } from '@/utils/responsive';
import { validationUtils } from '@/utils/validation';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        const validation = validationUtils.validateLoginCredentials({
            emailOrUsername,
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
            await signIn(emailOrUsername, password);
            router.replace('/(tabs)/explore');
        } catch (error: any) {
            setErrors([error.message]);
            Alert.alert('Sign In Error', error.message);
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
                    <Text style={styles.title}>Sign In</Text>
                    <Text style={styles.subtitle}>
                        Use your email address or username to sign in to your account
                    </Text>
                    
                    <View style={{ width: '100%', maxWidth: 400 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email or Username"
                            value={emailOrUsername}
                            onChangeText={setEmailOrUsername}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                            autoComplete="email"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            editable={!loading}
                            autoComplete="password"
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
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
