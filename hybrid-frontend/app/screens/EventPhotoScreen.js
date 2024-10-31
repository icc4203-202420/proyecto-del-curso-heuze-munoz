import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';

const EventPhotoView = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId, eventPictureId } = route.params;
  const [eventPicture, setEventPicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Fetch current user ID
    const fetchCurrentUser = async () => {
      const userId = await SecureStore.getItemAsync('userId');
      setCurrentUserId(userId);
    };

    // Fetch friends of the current user
    const fetchFriends = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      const userId = await SecureStore.getItemAsync('userId');
      if (token && userId) {
        try {
          const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/users/${userId}/friendships`, {
            headers: { Authorization: token },
          });
          const data = await response.json();
          setFriends(data.map(friend => friend.id));
        } catch (error) {
          console.error('Error fetching friends:', error);
        }
      }
    };

    fetchCurrentUser();
    fetchFriends();
  }, []);

  useEffect(() => {
    // Fetch event picture details
    const fetchEventPicture = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      try {
        const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/events/${eventId}/event_pictures/${eventPictureId}`, {
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
  }, [eventId, eventPictureId]);

  const handleAddFriend = async (friendId) => {
    const token = await SecureStore.getItemAsync('authToken');
  
    if (!token || !currentUserId) {
      Alert.alert('Error', 'User session not found. Please log in again.');
      navigation.navigate('Login');
      return;
    }
  
    try {
      const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/users/${currentUserId}/friendships`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUserId,
          friend_id: friendId,
          event_id: eventId,
        }),
      });
  
      if (response.ok) {
        Alert.alert('Success', 'Friendship created successfully.');
        setFriends(prevFriends => [...prevFriends, friendId]); // Update friends list
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.errors ? errorData.errors.join(', ') : 'An error occurred');
      }
    } catch (error) {
      console.error('Error creating friendship:', error);
      Alert.alert('Error', 'There was an error creating the friendship. Please try again.');
    }
  };
  

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!eventPicture) {
    return <Text>Photo not found.</Text>;
  }
  console.log(friends)
  return (
    <View style={styles.container}>
      <Image source={{ uri: eventPicture.image_url }} style={styles.image} />
      <Text style={styles.description}>{eventPicture.description}</Text>

      {/* Display tagged users */}
      {eventPicture.tagged_friends && eventPicture.tagged_friends.length > 0 && (
        <View style={styles.taggedFriendsContainer}>
          <Text style={styles.taggedFriendsTitle}>Tagged Users:</Text>
          {eventPicture.tagged_friends
            .filter(friend => friend.id !== currentUserId)
            .map(friend => {
              const isFriend = friends.includes(friend.id);
              return (
                <View key={friend.id} style={styles.taggedFriendItem}>
                  <Text style={styles.taggedFriendText}>{friend.handle}</Text>
                  {isFriend ? (
                    <Text style={styles.friendLabel}>Friend</Text>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleAddFriend(friend.id)}
                      style={styles.addFriendButton}
                    >
                      <Text style={styles.addFriendButtonText}>Add Friend</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
        </View>
      )}
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
  taggedFriendsContainer: {
    marginTop: 16,
  },
  taggedFriendsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  taggedFriendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taggedFriendText: {
    fontSize: 14,
    marginRight: 8,
  },
  friendLabel: {
    color: 'green',
    fontWeight: 'bold',
  },
  addFriendButton: {
    backgroundColor: '#6A0DAD',
    padding: 6,
    borderRadius: 4,
  },
  addFriendButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default EventPhotoView;
