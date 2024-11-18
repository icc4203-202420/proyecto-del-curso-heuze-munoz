import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { WebSocketContext } from '../utility/WebSocketProvider';
import { useNavigation } from '@react-navigation/native';

const FeedScreen = () => {
  const { feed, isConnected } = useContext(WebSocketContext);
  const navigation = useNavigation();

  // Sort the feed array by `created_at` in descending order (newer first)
  const sortedFeed = [...feed].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

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
        data={sortedFeed}
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
        initialScrollIndex={0}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
        onScrollToIndexFailed={(error) => {
          console.warn('Scroll failed:', error);
        }}
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
