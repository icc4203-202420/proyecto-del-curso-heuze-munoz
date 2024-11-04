import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';

const EventPhotoUpload = ({ eventId, attendees }) => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAttendees, setFilteredAttendees] = useState([]);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await SecureStore.getItemAsync('userId');
      setCurrentUserId(userId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const filterAttendees = () => {
      if (searchQuery.trim() === '') {
        setFilteredAttendees([]);
      } else {
        setFilteredAttendees(
          attendees.filter(attendee => 
            attendee.user.handle.toLowerCase().includes(searchQuery.toLowerCase()) &&
            attendee.user.id !== parseInt(currentUserId, 10) &&
            !taggedFriends.includes(attendee.user.id)
          )
        );
      }
    };
    filterAttendees();
  }, [searchQuery, attendees, taggedFriends, currentUserId]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission to access media library is required!");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const handleUploadPhoto = async () => {
    if (!image) {
      Alert.alert('Please select an image.');
      return;
    }
    setIsUploading(true);
    const token = await SecureStore.getItemAsync('authToken');
    const userId = await SecureStore.getItemAsync('userId');
    if (!token || !userId) {
      Alert.alert('User session not found. Please log in again.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('image', {
        uri: image,
        name: `event-photo-${Date.now()}.jpg`,
        type: 'image/jpeg',
      });
      formData.append('tagged_friends', JSON.stringify(taggedFriends.map(id => ({ id }))));

      const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/events/${eventId}/event_pictures`, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload photo');

      Alert.alert('Success', 'Photo uploaded successfully!');
      setImage(null);
      setDescription('');
      setTaggedFriends([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'There was an error uploading the photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const addTaggedFriend = (userId) => {
    setTaggedFriends([...taggedFriends, userId]);
    setSearchQuery('');
  };

  const removeTaggedFriend = (userId) => {
    setTaggedFriends(taggedFriends.filter(id => id !== userId));
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.pickImageButton} onPress={handlePickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>
      {image && <Text style={styles.imageSelectedText}>Image selected!</Text>}
      <TextInput
        style={styles.descriptionInput}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.tagFriendsContainer}>
        <Text style={styles.tagFriendsTitle}>Tag Users:</Text>
        <FlatList
          data={taggedFriends}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => {
            const friend = attendees.find(attendee => attendee.user.id === item);
            return (
              <View style={styles.taggedFriendContainer}>
                <Text style={styles.friendTagText}>
                  {friend ? friend.user.handle : 'Unknown'}
                </Text>
                <TouchableOpacity onPress={() => removeTaggedFriend(item)}>
                  <Text style={styles.removeButton}>Remove</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users to tag"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {filteredAttendees.length > 0 && (
          <FlatList
            data={filteredAttendees}
            keyExtractor={(item) => item.user.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestedUser}
                onPress={() => addTaggedFriend(item.user.id)}
              >
                <Text style={styles.suggestedUserText}>{item.user.handle}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.uploadButton, isUploading && styles.uploading]}
        onPress={handleUploadPhoto}
        disabled={isUploading}
      >
        <Text style={styles.buttonText}>{isUploading ? 'Uploading...' : 'Upload Photo'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
    elevation: 3,
  },
  pickImageButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageSelectedText: {
    color: 'green',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  tagFriendsContainer: {
    marginBottom: 16,
  },
  tagFriendsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  taggedFriendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  friendTagText: {
    color: '#333',
  },
  removeButton: {
    color: 'red',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestedUser: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 4,
  },
  suggestedUserText: {
    color: '#333',
  },
  uploadButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploading: {
    opacity: 0.6,
  },
});

export default EventPhotoUpload;
