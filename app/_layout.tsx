import { useAuth } from '@/hooks/useAuth';
import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log('RootLayout - Auth state:', { user: !!user, loading, userData: user });
        
        if (!loading) {
            if (user) {
                // User is authenticated, redirect to tabs
                console.log('RootLayout - User authenticated, navigating to explore');
                router.replace('/(tabs)/explore');
            } else {
                console.log('RootLayout - User not authenticated, staying on current screen');
            }
        }
    }, [user, loading, router]);

    return <Slot />;
}
