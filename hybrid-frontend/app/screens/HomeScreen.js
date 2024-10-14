import React from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Card, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();

  const getToken = async () => {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  };

  const isAuthenticated = !!getToken; // Verifica si el token está presente

  const handleUsersClick = () => {
    if (!isAuthenticated) {
      Alert.alert('Attention', 'You must be logged in to see the users list.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }, // Redirige a la página de login
      ]);
    } else {
      navigation.navigate('Users'); // Si está autenticado, navega a la página de usuarios
    }
  };

  return (
    <View style={styles.container}>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
  },
  card: {
    width: 320,
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
