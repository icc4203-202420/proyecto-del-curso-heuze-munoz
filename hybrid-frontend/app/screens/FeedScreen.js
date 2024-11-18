import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { WebSocketContext } from '../utility/WebSocketProvider';
import { useNavigation } from '@react-navigation/native';

const FeedScreen = () => {
  const { feed, setFilters, isConnected } = useContext(WebSocketContext);
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const navigation = useNavigation();

  const applyFilter = () => {
    const validTypes = ['friend', 'beer'];
    if (validTypes.includes(filterType.toLowerCase())) {
      setFilters({ type: filterType.toLowerCase(), value: filterValue });
    } else {
      alert('Invalid filter type. Choose from friend or beer.');
    }
  };

  const clearFilter = () => {
    setFilters(null);
    setFilterType('');
    setFilterValue('');
  };

  const renderFeedItem = ({ item }) => {
    if (item.type === 'review') {
      return (
        <View style={styles.feedItem}>
          <Text style={styles.feedType}>Beer Review</Text>
          <Text style={styles.feedUser}>{item.review.user.handle} reviewed a beer</Text>
          <Text style={styles.feedDetails}>Rating: {item.review.rating} / 5</Text>
          <Text style={styles.feedDetails}>Beer: {item.review.beer.name}</Text>
          <Text style={styles.feedDetails}>Description: {item.review.text}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('BeerDetail', { beerId: item.review.beer.id })}
          >
            <Text style={styles.buttonText}>View Beer</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (item.type === 'event_picture') {
      return (
        <View style={styles.feedItem}>
          <Text style={styles.feedType}>Event Picture</Text>
          <Text style={styles.feedUser}>{item.event_picture.user.handle} posted an event picture</Text>
          <Text style={styles.feedDetails}>Description: {item.event_picture.description}</Text>
          {item.event_picture.image_url && (
            <Image
              source={{ uri: item.event_picture.image_url }}
              style={styles.eventImage}
              resizeMode="cover"
            />
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('BarsEvents', { barId: item.event_picture.event.bar.id })}
          >
            <Text style={styles.buttonText}>View Event</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null; // Handle other types if necessary
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</Text>
      <FlatList
        data={feed}
        keyExtractor={(item, index) => {
          if (item.type === 'review') {
            return `review-${item.review.id}-${index}`;
          } else if (item.type === 'event_picture') {
            return `event_picture-${item.event_picture.id}-${index}`;
          } else {
            return `item-${index}`;
          }
        }}
        renderItem={renderFeedItem}
        inverted
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
    backgroundColor: '#fff',
  },
  feedType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedUser: {
    fontSize: 14,
    marginVertical: 4,
  },
  feedDetails: {
    fontSize: 14,
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginTop: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
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
  status: {
    marginBottom: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventImage: {
    width: '100%',
    height: 200,
    marginTop: 8,
    borderRadius: 8,
  },
});

export default FeedScreen;
