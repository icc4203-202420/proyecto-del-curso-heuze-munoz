import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TouchableOpacity, ActivityIndicator  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import dayjs from 'dayjs';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';
import EventPhotoUpload from '../components/EventPhotoUpload';
import PhotoGallery from '../components/PhotoGallery'

const BarsEventsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { barId } = route.params;

  const [events, setEvents] = useState([]);
  const [barName, setBarName] = useState('');
  const [attendees, setAttendees] = useState({});
  const [friends, setFriends] = useState([]);
  const [checkedInEvents, setCheckedInEvents] = useState({});
  const [loading, setLoading] = useState(true);

  const isUserLoggedIn = async () => {
    const token = await SecureStore.getItemAsync('authToken');
    return !!token;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      const userId = await SecureStore.getItemAsync('userId');

      if (!token || !userId) {
        Alert.alert('Error', 'User session not found. Please log in again.');
        navigation.navigate('Login');
        return;
      }

      try {
        const eventsResponse = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/bars/${barId}/events`, {
          headers: { Authorization: token },
        });
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events);

        const barResponse = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/bars/${barId}`);
        const barData = await barResponse.json();
        setBarName(barData.bar.name);

        const friendsResponse = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/users/${userId}/friendships?user_id=${userId}`, {
          headers: { Authorization: token },
          'Content-Type': 'application/json',
        });
        const friendsData = await friendsResponse.json();
        const friendIds = friendsData.map(friend => friend.id);
        setFriends(friendIds);

        const attendeesData = {};
        for (const event of eventsData.events) {
          const attendeesResponse = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/bars/${barId}/events/${event.id}/attendances`);
          attendeesData[event.id] = (await attendeesResponse.json()).attendances || [];
        }
        setAttendees(attendeesData);

        // Verificar si el usuario ya hizo check-in en los eventos
        const checkedInResponse = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/users/${userId}/attendances`, {
          headers: { Authorization: token },
        });
        const checkedInData = await checkedInResponse.json();
        const checkedInEventIds = checkedInData.map(attendance => attendance.event_id);
        const checkedInEvents = {};
        checkedInEventIds.forEach(eventId => { checkedInEvents[eventId] = true; });
        setCheckedInEvents(checkedInEvents);

      } catch (error) {
        console.error('There was an error fetching the data!', error);
        if (!await isUserLoggedIn()) {
          navigation.navigate('Login');
        }
      }
      finally {
        setLoading(false); // Cambia el estado a false cuando se complete la carga
      }
    };

    fetchData();
  }, [barId, navigation]);

  const handleCheckIn = async (eventId) => {
    const token = await SecureStore.getItemAsync('authToken');
    const userId = await SecureStore.getItemAsync('userId');

    if (!token || !userId) {
      Alert.alert('Error', 'User session not found. Please log in again.');
      navigation.navigate('Login');
      return;
    }

    try {
      await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/bars/${barId}/events/${eventId}/attendances`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      Alert.alert('Success', 'Check-in successful!');

      const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/bars/${barId}/events/${eventId}/attendances`);
      const updatedAttendees = (await response.json()).attendances || [];
      setAttendees(prev => ({
        ...prev,
        [eventId]: updatedAttendees,
      }));

      setCheckedInEvents(prev => ({ ...prev, [eventId]: true }));

    } catch (error) {
      console.error('Error during check-in:', error);
      Alert.alert('Error', 'There was an error during check-in. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{barName} Events</Text>
      {loading ? (
      <ActivityIndicator size="large" color="#6A0DAD" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(event) => event.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventDate}>{dayjs(item.date).format('MMMM D, YYYY [at] h:mm A')}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>

              {checkedInEvents[item.id] ? (
                <Text style={styles.checkedIn}>Checked in!</Text>
              ) : (
                <TouchableOpacity style={styles.checkInButton} onPress={() => handleCheckIn(item.id)}>
                  <Text style={styles.checkInButtonText}>Check-in</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.attendeesTitle}>Attendees:</Text>
              {attendees[item.id] && attendees[item.id].length > 0 ? (
                attendees[item.id]
                  .sort((a, b) => {
                    if (friends.includes(a.user.id) && !friends.includes(b.user.id)) return -1;
                    if (!friends.includes(a.user.id) && friends.includes(b.user.id)) return 1;
                    return 0;
                  })
                  .map(attendee => (
                    <View key={attendee.user.id} style={styles.attendee}>
                      <Text>{attendee.user.handle}</Text>
                      {friends.includes(attendee.user.id) && <Text style={styles.friendChip}>Friend</Text>}
                    </View>
                  ))
              ) : (
                <Text>No attendees yet.</Text>
              )}
              <EventPhotoUpload eventId={item.id} attendees={attendees[item.id] || []} />
              <PhotoGallery eventId={item.id}/>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#f5f5f5', // Color de fondo claro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3, // Sombra
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Color del nombre del evento
  },
  eventDate: {
    color: '#666', // Color del texto de la fecha
    marginBottom: 8,
  },
  eventDescription: {
    marginBottom: 16,
  },
  checkedIn: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 16,
  },
  attendeesTitle: {
    fontWeight: 'bold',
    marginTop: 24,
    color: '#333', // Color del título de asistentes
  },
  attendee: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  friendChip: {
    backgroundColor: 'green',
    color: 'white',
    padding: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  checkInButton: {
    backgroundColor: '#6A0DAD', // Color de fondo del botón
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  checkInButtonText: {
    color: '#fff', // Color del texto del botón
    fontWeight: 'bold',
  },
});

export default BarsEventsScreen;
