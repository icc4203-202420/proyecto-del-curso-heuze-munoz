import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Modal, ScrollView, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const UsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const isUserLoggedIn = async () => {
    const authToken = await SecureStore.getItemAsync('authToken');
    return !!authToken;
  };

  useEffect(() => {
    const fetchData = async () => {
      const authToken = await SecureStore.getItemAsync('authToken');
      const userId = await SecureStore.getItemAsync('userId');

      if (!(await isUserLoggedIn())) {
        Alert.alert('You must be logged in to see the users list.');
        navigation.navigate('Login');
        return;
      }

      if (!authToken || !userId) {
        Alert.alert('User session not found. Please log in again.');
        navigation.navigate('Login');
        return;
      }

      try {
        // Cargar los usuarios
        const usersResponse = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/users`, {
          headers: { Authorization: authToken, 'Content-Type': 'application/json' },
        });

        if (!usersResponse.ok) {
          if (usersResponse.status === 401) {
            Alert.alert('Unauthorized. Please log in again.');
            navigation.navigate('Login');
          } else {
            Alert.alert('Error fetching users data:', usersResponse.status);
          }
          return;
        }

        const usersData = await usersResponse.json();
        const filteredUsers = usersData.filter((user) => user.id.toString() !== userId); // Excluir el usuario actual
        setUsers(filteredUsers);

        // Cargar los amigos del usuario actual
        const friendsResponse = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/users/${userId}/friendships?user_id=${userId}`, {
          headers: {
            Authorization: `${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        const friendsData = await friendsResponse.json();
        setFriends(friendsData);

        // Cargar eventos
        const eventsResponse = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/events`, {
          headers: { Authorization: authToken },
        });

        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [navigation]);

  const handleAddFriend = (user) => {
    setSelectedUser(user);
    setSelectedEvent(null); // Reiniciar selección de evento
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    const authToken = await SecureStore.getItemAsync('authToken');
    const userId = await SecureStore.getItemAsync('userId');

    if (!selectedUser) {
      Alert.alert('No user selected.');
      return;
    }

    try {
      await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/users/${userId}/friendships`, {
        method: 'POST',
        headers: {
          Authorization: `${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          friend_id: selectedUser.id,
          event_id: selectedEvent ? selectedEvent.id : null,
        }),
      });
      setModalVisible(false);
    } catch (error) {
      console.error('Error creating friendship:', error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users Page</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Users"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userHandle}>{item.handle}</Text>
            {friends.some(friend => friend.id === item.id) ? (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            ) : (
              <TouchableOpacity style={styles.addFriendButton} onPress={() => handleAddFriend(item)}>
                <Text style={styles.buttonText}>Add Friend</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Modal para añadir amigo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Add {selectedUser?.handle} as a friend</Text>
              <FlatList
                data={events}
                keyExtractor={(event) => event.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.eventItem} 
                    onPress={() => setSelectedEvent(item)}
                  >
                    <Text style={styles.eventText}>{item.name}</Text>
                    {selectedEvent?.id === item.id && (
                      <Ionicons name="checkmark-circle" size={24} color="green" />
                    )}
                  </TouchableOpacity>
                )}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  userCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  userHandle: {
    fontSize: 18,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  eventItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventText: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addFriendButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100, // Tamaño uniforme
  },
  button: {
    flex: 1,
    margin: 5,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UsersScreen;
