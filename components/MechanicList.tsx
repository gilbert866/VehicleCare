import { Mechanic } from '@/services/mechanicService';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MechanicListProps {
  mechanics: Mechanic[];
  loading: boolean;
  hasMorePages: boolean;
  onMechanicPress: (mechanic: Mechanic) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
}

export const MechanicList: React.FC<MechanicListProps> = ({
  mechanics,
  loading,
  hasMorePages,
  onMechanicPress,
  onLoadMore,
  onRefresh,
}) => {
  const renderMechanic = ({ item }: { item: Mechanic }) => {
    // Validate distance
    const distance = typeof item.distance_km === 'number' && !isNaN(item.distance_km) 
      ? item.distance_km 
      : 0;

    return (
      <TouchableOpacity
        style={styles.mechanicItem}
        onPress={() => onMechanicPress(item)}
      >
        <View style={styles.mechanicIcon}>
          <Ionicons name="construct" size={24} color="#007AFF" />
        </View>
        <View style={styles.mechanicInfo}>
          <Text style={styles.shopName}>{item.shop_name || 'Mechanic Shop'}</Text>
          <Text style={styles.distance}>{distance.toFixed(1)} km away</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!hasMorePages) return null;
    
    return (
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <TouchableOpacity style={styles.loadMoreButton} onPress={onLoadMore}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="construct-outline" size={48} color="#ccc" />
      <Text style={styles.emptyText}>No mechanics found nearby</Text>
      <Text style={styles.emptySubtext}>Try adjusting your location or search area</Text>
    </View>
  );

  return (
    <FlatList
      data={mechanics}
      renderItem={renderMechanic}
      keyExtractor={(item, index) => item.id ? item.id.toString() : `${item.latitude}-${item.longitude}-${index}`}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      onRefresh={onRefresh}
      refreshing={loading && mechanics.length === 0}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flexGrow: 1,
  },
  mechanicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mechanicIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mechanicInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
}); 