import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';

const EventPhotoView = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventPictureId } = route.params;

  const [eventPicture, setEventPicture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventPicture = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      try {
        const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/event_pictures/${eventPictureId}`, {
          headers: { Authorization: token },
        });
        const data = await response.json();
        setEventPicture(data);
      } catch (error) {
        console.error('Error fetching event picture:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventPicture();
  }, [eventPictureId]);

  const handleAddFriend = async () => {
    const token = await SecureStore.getItemAsync('authToken');
    if (!token) {
      Alert.alert('Error', 'User session not found. Please log in again.');
      navigation.navigate('Login');
      return;
    }

    try {
      const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/users/${eventPicture.user.id}/friendships`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        Alert.alert('Success', 'Friend request sent!');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.errors.join(', '));
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'There was an error sending the friend request.');
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!eventPicture) {
    return <Text>Photo not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: eventPicture.image_url }} style={styles.image} />
      <Text style={styles.description}>{eventPicture.description}</Text>
      <TouchableOpacity onPress={handleAddFriend} style={styles.addFriendButton}>
        <Text style={styles.addFriendButtonText}>Add {eventPicture.user.handle} as a Friend</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  addFriendButton: {
    backgroundColor: '#6A0DAD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addFriendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EventPhotoView;
