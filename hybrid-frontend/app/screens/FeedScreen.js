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
    } else {
      return null; // Handle other types if necessary
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</Text>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Filter Type (friend, beer)"
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
          <Text style={styles.buttonText}>Apply Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clearFilter}>
          <Text style={styles.buttonText}>Clear Filter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={feed}
        keyExtractor={(item, index) => `${item.type}-${item.review.id}-${index}`}
        renderItem={renderFeedItem}
        inverted // To show the latest items at the top
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
});

export default FeedScreen;
