import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthWrapper({ children, requireAuth = true }: AuthWrapperProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // User is not authenticated and auth is required
        router.replace('/');
      } else if (!requireAuth && user) {
        // User is authenticated but auth is not required (e.g., on signin/signup pages)
        router.replace('/(tabs)/explore');
      }
    }
  }, [user, loading, requireAuth, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.PRIMARY} />
      </View>
    );
  }

  // If auth is required and user is not authenticated, show loading while redirecting
  if (requireAuth && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.PRIMARY} />
      </View>
    );
  }

  // If auth is not required and user is authenticated, show loading while redirecting
  if (!requireAuth && user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.PRIMARY} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.BACKGROUND,
  },
}); 