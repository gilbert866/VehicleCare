import { useAuth } from '@/hooks/useAuth';
import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                // User is authenticated, redirect to tabs
                router.replace('/(tabs)/explore');
            }
            // If user is not authenticated, stay on current screen (welcome, signin, signup)
        }
    }, [user, loading, router]);

    return <Slot />;
}
