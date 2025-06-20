import { styles } from '@/styles/common';
import { validationUtils } from '@/utils/validation';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const handleSignUp = () => {
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
        // TODO: Implement actual sign up logic
        router.replace('/explore');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/signin')}>
                <Text style={styles.link}>Already have an account? Sign In</Text>
            </TouchableOpacity>
        </View>
    );
}
