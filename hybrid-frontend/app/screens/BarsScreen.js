import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';

function BarsScreen() {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/bars`);
        const data = await response.json();
        setBars(data.bars);
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };

    fetchBars();
  }, []);

  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bars Page</Text>

      <TextInput
        placeholder="Search Bars"
        style={styles.searchInput}
        onChangeText={setSearchTerm}
      />

      <View style={styles.buttonContainer}>
        <Button title="View Map of Bars" onPress={() => navigation.navigate('BarsMap')} />
      </View>

      <ScrollView>
        {filteredBars.map(bar => (
          <View key={bar.id} style={styles.card}>
            <Text style={styles.barName}>{bar.name}</Text>
            <Text style={styles.barAddress}>
              Address: {bar.address.line1}, {bar.address.line2}, {bar.address.city}, {bar.address.country.name}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('BarsEvents', { barId: bar.id })}
            >
              <Text style={styles.buttonText}>View Events</Text>
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
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
  barName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  barAddress: {
    color: '#666',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default BarsScreen;
