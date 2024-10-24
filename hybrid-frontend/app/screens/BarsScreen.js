import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
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
    <View style={{ padding: 16, flex: 1, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Bars Page
      </Text>

      {/* Search Input */}
      <TextInput
        placeholder="Search Bars"
        style={{
          backgroundColor: '#fff',
          padding: 10,
          borderRadius: 8,
          marginBottom: 16,
          borderColor: '#ccc',
          borderWidth: 1,
        }}
        onChangeText={setSearchTerm}
      />

      {/* Buttons */}
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <View style={{ width: 10 }} />
        <Button title="View Map of Bars" onPress={() => navigation.navigate('BarsMap')} />
      </View>

      {/* Bars List */}
      <ScrollView>
        {filteredBars.map(bar => (
          <View
            key={bar.id}
            style={{
              backgroundColor: '#fff',
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{bar.name}</Text>
            <Text style={{ color: '#666', marginBottom: 8 }}>
              Address: {bar.address.line1}, {bar.address.line2}, {bar.address.city}, {bar.address.country.name}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#007bff',
                padding: 10,
                borderRadius: 8,
              }}
              onPress={() => navigation.navigate('BarsEvents', { barId: bar.id })}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>View Events</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default BarsScreen;
