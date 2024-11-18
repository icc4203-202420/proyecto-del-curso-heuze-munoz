import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { WebSocketContext } from '../utility/WebSocketProvider';
import { useNavigation } from '@react-navigation/native';

const FeedScreen = () => {
  const { feed, setFilters, isConnected } = useContext(WebSocketContext);
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const navigation = useNavigation();

  const applyFilter = () => {
    setFilters({ type: filterType, value: filterValue });
  };

  const clearFilter = () => {
    setFilters(null);
    setFilterType('');
    setFilterValue('');
  };

  const renderFeedItem = ({ item }) => {
    return (
      <View style={styles.feedItem}>
        <Text>{item.type === 'event_picture' ? 'Event' : 'Review'}</Text>
        <Text>{item.user.handle} {item.type === 'event_picture' ? 'posted a photo' : 'reviewed a beer'}</Text>
        {item.type === 'event_picture' && (
          <TouchableOpacity
            onPress={() => navigation.navigate('EventPhotoView', { eventId: item.event.id, eventPictureId: item.id })}
          >
            <Text style={styles.linkText}>View Event</Text>
          </TouchableOpacity>
        )}
        {item.type === 'review' && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Bars', { barId: item.bar.id })}
          >
            <Text style={styles.linkText}>View Bar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</Text>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Filter Type (friend, bar, country, beer)"
          value={filterType}
          onChangeText={setFilterType}
        />
        <TextInput
          style={styles.input}
          placeholder="Filter Value"
          value={filterValue}
          onChangeText={setFilterValue}
        />
        <TouchableOpacity style={styles.button} onPress={applyFilter}>
          <Text>Apply Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clearFilter}>
          <Text>Clear Filter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={feed}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderFeedItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  feedItem: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  linkText: {
    color: 'blue',
    marginTop: 8,
  },
  filterContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default FeedScreen;
