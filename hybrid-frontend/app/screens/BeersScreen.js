import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Beers = () => {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation(); // Hook for navigation

  useEffect(() => {
    fetch('https://topical-pheasant-primary.ngrok-free.app/api/v1/beers')
      .then((response) => response.json())
      .then((data) => {
        setBeers(data.beers);
      })
      .catch((error) => {
        console.error('Error fetching beers:', error);
      });
  }, []);

  // Filter beers based on search term
  const filteredBeers = beers.filter((beer) =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle card click and navigate to the beer's detail page
  const handleCardClick = async (beerId) => {
    const isAuthenticated = await AsyncStorage.getItem('authToken'); // Check if token is present
    if (!isAuthenticated) {
      Alert.alert('Attention', 'You must log in to view beer details.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } else {
      navigation.navigate('BeerDetails', { beerId }); // Navigate to beer details
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beers Page</Text>
      
      {/* Search bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Beers"
        placeholderTextColor="#888"
        onChangeText={setSearchTerm}
        value={searchTerm}
      />

      <FlatList
        data={filteredBeers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleCardClick(item.id)}>
            <Text style={styles.beerName}>{item.name}</Text>
            {item.style && <Text style={styles.beerStyle}>Style: {item.style}</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#6A0DAD',
  },
  searchInput: {
    height: 40,
    borderColor: '#6A0DAD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  beerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  beerStyle: {
    fontSize: 14,
    color: '#666',
  },
});

export default Beers;
