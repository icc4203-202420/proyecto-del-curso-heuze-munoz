import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Card, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    // Aquí puedes eliminar el token o hacer la lógica que necesites para logout
    await AsyncStorage.removeItem('authToken');
    Alert.alert('Logged out', 'You have been logged out.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') }
    ]);
  };

  const handleUsersClick = async () => {
    const token = await AsyncStorage.getItem('authToken');
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
      Alert.alert('Attention', 'You must be logged in to see the users list.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } else {
      navigation.navigate('Users');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header personalizado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BeerBuddy</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Card de la lista de opciones */}
      <Card style={styles.card}>
        <Card.Content>
          <List.Section>
            <TouchableOpacity onPress={handleUsersClick} style={styles.listItem}>
              <List.Item
                title="Users"
                left={() => <Ionicons name="person" size={24} color="#6A0DAD" />}
                titleStyle={styles.listItemText}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Beers')} style={styles.listItem}>
              <List.Item
                title="Beers"
                left={() => <Ionicons name="beer" size={24} color="#6A0DAD" />}
                titleStyle={styles.listItemText}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Bars')} style={styles.listItem}>
              <List.Item
                title="Bars"
                left={() => <Ionicons name="book" size={24} color="#6A0DAD" />}
                titleStyle={styles.listItemText}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Events')} style={styles.listItem}>
              <List.Item
                title="Events"
                left={() => <Ionicons name="calendar" size={24} color="#6A0DAD" />}
                titleStyle={styles.listItemText}
              />
            </TouchableOpacity>
          </List.Section>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  header: {
    height: 60,
    backgroundColor: '#6A0DAD',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  card: {
    margin: 16,
    padding: 24,
    borderRadius: 8,
    backgroundColor: '#ffffff', // Fondo blanco del card
  },
  listItem: {
    paddingVertical: 8,
  },
  listItemText: {
    color: '#6A0DAD',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default HomeScreen;
