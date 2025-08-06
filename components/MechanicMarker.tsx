import { Mechanic } from '@/services/mechanicService';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

interface MechanicMarkerProps {
  mechanic: Mechanic;
  onPress?: (mechanic: Mechanic) => void;
}

export const MechanicMarker: React.FC<MechanicMarkerProps> = ({ mechanic, onPress }) => {
  // Validate that mechanic has valid coordinates
  if (!mechanic || 
      typeof mechanic.latitude !== 'number' || 
      typeof mechanic.longitude !== 'number' ||
      isNaN(mechanic.latitude) || 
      isNaN(mechanic.longitude)) {
    console.warn('Invalid mechanic coordinates:', mechanic);
    return null;
  }

  // Validate distance
  const distance = typeof mechanic.distance_km === 'number' && !isNaN(mechanic.distance_km) 
    ? mechanic.distance_km 
    : 0;

  return (
    <Marker
      coordinate={{
        latitude: mechanic.latitude,
        longitude: mechanic.longitude,
      }}
      title={mechanic.shop_name || 'Mechanic'}
      description={`${distance.toFixed(1)} km away`}
      onPress={() => onPress?.(mechanic)}
    >
      <View style={styles.markerContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="construct" size={20} color="#fff" />
        </View>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>
            {distance.toFixed(1)}km
          </Text>
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  distanceBadge: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  distanceText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
}); 