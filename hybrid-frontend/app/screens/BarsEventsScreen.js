import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import dayjs from 'dayjs';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';

const BarsEventsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { barId } = route.params;

  const [events, setEvents] = useState([]);
  const [barName, setBarName] = useState('');
  const [attendees, setAttendees] = useState({});
  const [friends, setFriends] = useState([]);
  const [checkedInEvents, setCheckedInEvents] = useState({});

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

        const friendsResponse = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/users/${userId}/friendships`, {
          headers: { Authorization: token },
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

      <FlatList
        data={events}
        keyExtractor={(event) => event.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text>{dayjs(item.date).format('MMMM D, YYYY [at] h:mm A')}</Text>
            <Text>{item.description}</Text>

            {checkedInEvents[item.id] ? (
              <Text style={styles.checkedIn}>Checked in!</Text>
            ) : (
              <Button title="Check-in" onPress={() => handleCheckIn(item.id)} />
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
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
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
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkedIn: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 16,
  },
  attendeesTitle: {
    fontWeight: 'bold',
    marginTop: 24,
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
});

export default BarsEventsScreen;
