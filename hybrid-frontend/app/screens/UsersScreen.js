import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';
import { Picker } from '@react-native-picker/picker';

const UsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const isUserLoggedIn = async () => {
    const authToken = await AsyncStorage.getItem('authToken');
    return !!authToken;
  };

  useEffect(() => {
    const fetchData = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');
      
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
          headers: { Authorization: authToken, 'Content-Type': 'application/json'},
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
        const filteredUsers = usersData.filter((user) => user.id !== userId);
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
          headers: { Authorization: `${authToken}` },
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
    const authToken = await AsyncStorage.getItem('authToken');
    const userId = await AsyncStorage.getItem('userId');

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
      // Opcional: Actualiza la lista de amigos después de agregar un nuevo amigo
      // await fetchFriends();
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
      <Button title="Go Back" onPress={() => navigation.goBack()} />

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
            <Text>{item.handle}</Text>
            {/* Verificar si el usuario ya es amigo */}
            {!friends.some(friend => friend.id === item.id) && (
              <Button title="Add Friend" onPress={() => handleAddFriend(item)} />
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
            <Text>Add {selectedUser?.handle} as a friend</Text>
            {/* Picker para seleccionar evento */}
            <Picker
              selectedValue={selectedEvent}
              onValueChange={(itemValue) => setSelectedEvent(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Event" value={null} />
              {events.map((event) => (
                <Picker.Item key={event.id} label={event.name} value={event} />
              ))}
            </Picker>
            <Button title="Confirm" onPress={handleSubmit} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  userCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default UsersScreen;
