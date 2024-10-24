import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; // Reemplazando AsyncStorage por SecureStore
import { EXPO_PUBLIC_API_BASE_URL } from '@env';

function BeersScreen() {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken'); // Obtener token de SecureStore
        if (!token) {
          Alert.alert('Not Authenticated', 'You need to log in to view the beers.');
          navigation.navigate('Login');
          return;
        }

        const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/beers`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setBeers(data.beers);
      } catch (error) {
        console.error('Error fetching beers:', error);
        Alert.alert('Error', 'Could not fetch beers. Please try again later.');
      }
    };

    fetchBeers();
  }, []);

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = async (beerId) => {
    const isAuthenticated = await SecureStore.getItemAsync('authToken');
    if (!isAuthenticated) {
      Alert.alert('Attention', 'You must log in to view beer details.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } else {
      navigation.navigate('BeerDetail', { beerId });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beers Page</Text>

      <TextInput
        placeholder="Search Beers"
        style={styles.searchInput}
        onChangeText={setSearchTerm}
      />

      <ScrollView>
        {filteredBeers.map(beer => (
          <View
            key={beer.id}
            style={styles.card}
          >
            <Text style={styles.beerName}>{beer.name}</Text>
            {beer.style && <Text style={styles.beerStyle}>Style: {beer.style}</Text>}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleCardClick(beer.id)}
            >
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  beerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  beerStyle: {
    color: '#666',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#6A0DAD',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default BeersScreen;
