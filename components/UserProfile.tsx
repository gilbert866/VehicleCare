import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface UserProfileProps {
  showUsername?: boolean;
  showEmail?: boolean;
  showName?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  showUsername = true, 
  showEmail = true, 
  showName = true 
}) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      {showName && user.displayName && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user.displayName}</Text>
        </View>
      )}
      
      {showUsername && user.username && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>@{user.username}</Text>
        </View>
      )}
      
      {showEmail && user.email && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#666',
    flex: 2,
    textAlign: 'right',
  },
}); 