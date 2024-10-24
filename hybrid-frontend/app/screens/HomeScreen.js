import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Card, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    const token = await SecureStore.getItemAsync('authToken');
  
    if (token) {
      try {
        await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/logout`, {
          method: 'DELETE',
          headers: {
            Authorization: token,
          },
        });
        await SecureStore.deleteItemAsync('authToken');
        Alert.alert('Logged out', 'You have been logged out.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } catch (error) {
        console.error("Error in logout:", error);
        await SecureStore.deleteItemAsync('authToken');
        Alert.alert('Error', 'There was a problem logging out. Please try again.');
        navigation.navigate('Login');
      }
    } else {
      navigation.navigate('Login');
    }
  };

  const handleUsersClick = async () => {
    const token = await SecureStore.getItemAsync('authToken');
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BeerBuddy</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Color de fondo
  },
  header: {
    height: 60,
    backgroundColor: '#6A0DAD',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderRadius: 8, // Añadido para coherencia
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
    marginVertical: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    elevation: 3, // Sombra para el card
  },
  listItem: {
    paddingVertical: 12,
  },
  listItemText: {
    color: '#6A0DAD',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default HomeScreen;
