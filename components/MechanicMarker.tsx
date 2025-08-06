import { Mechanic } from '@/types/mechanic';
import { calculateDistance, formatDistance } from '@/utils/distanceCalculation';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

interface MechanicMarkerProps {
  mechanic: Mechanic;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  onPress?: (mechanic: Mechanic) => void;
}

export const MechanicMarker: React.FC<MechanicMarkerProps> = ({ mechanic, userLocation, onPress }) => {
  console.log('MechanicMarker - Rendering marker for:', mechanic.shop_name, 'at', mechanic.latitude, mechanic.longitude);
  
  // Validate that mechanic has valid coordinates
  if (!mechanic || 
      typeof mechanic.latitude !== 'number' || 
      typeof mechanic.longitude !== 'number' ||
      isNaN(mechanic.latitude) || 
      isNaN(mechanic.longitude)) {
    console.warn('Invalid mechanic coordinates:', mechanic);
    return null;
  }

  // Calculate distance if user location is available and backend didn't provide distance
  let distance = 0;
  if (mechanic.distance_km !== null && typeof mechanic.distance_km === 'number' && !isNaN(mechanic.distance_km)) {
    // Use backend-provided distance
    distance = mechanic.distance_km;
  } else if (userLocation) {
    // Calculate distance on frontend
    distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      mechanic.latitude,
      mechanic.longitude
    );
  }

  // Get rating display
  const rating = mechanic.rating && mechanic.user_ratings_total 
    ? `⭐ ${mechanic.rating.toFixed(1)} (${mechanic.user_ratings_total})`
    : 'No ratings';

  return (
    <Marker
      coordinate={{
        latitude: mechanic.latitude,
        longitude: mechanic.longitude,
      }}
      title={mechanic.shop_name || 'Mechanic'}
      description={`${formatDistance(distance)} • ${rating}`}
      onPress={() => onPress?.(mechanic)}
    >
      <View style={styles.markerContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="construct" size={22} color="#fff" />
        </View>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>
            {formatDistance(distance)}
          </Text>
        </View>
        {mechanic.rating && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>
              ⭐ {mechanic.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#FF6B35',
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  distanceBadge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  distanceText: {
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
  },
  ratingBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#fff',
  },
  ratingText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '600',
  },
}); 