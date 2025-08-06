import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

interface UserLocationMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

export const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({ coordinate }) => {
  return (
    <Marker
      coordinate={coordinate}
      title="You are here"
      description="Your current location"
    >
      <View style={styles.markerContainer}>
        <View style={styles.pulseContainer}>
          <View style={styles.pulse} />
          <View style={styles.pulse2} />
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={16} color="#fff" />
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>YOU</Text>
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  pulseContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.5)',
  },
  pulse2: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.4)',
  },
  iconContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
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
  labelContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  labelText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
}); 