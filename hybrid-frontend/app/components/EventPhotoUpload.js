import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';

const EventPhotoUpload = ({ eventId, attendees }) => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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
      const selectedAsset = pickerResult.assets[0];
      setImage(selectedAsset.uri);
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
          'Authorization': token,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }
  
      Alert.alert('Success', 'Photo uploaded successfully!');
      setImage(null);
      setDescription('');
      setTaggedFriends([]);
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'There was an error uploading the photo.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const availableAttendees = attendees.filter(
    attendee => !taggedFriends.includes(attendee.user.id)
  );

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
        <Text style={styles.tagFriendsTitle}>Tag Friends:</Text>
        {taggedFriends.map((friendId) => {
          const friend = attendees.find(attendee => attendee.user.id === friendId);
          return (
            <Text key={friendId} style={styles.friendTagText}>
              {friend ? friend.user.handle : 'Unknown'}
            </Text>
          );
        })}

        {availableAttendees.length > 0 && (
          <Picker
            selectedValue={null}
            style={styles.picker}
            onValueChange={(itemValue) => {
              if (itemValue) {
                setTaggedFriends([...taggedFriends, itemValue]);
              }
            }}
          >
            <Picker.Item key="default" label="Select friend to tag" value={null} />
            {availableAttendees.map(attendee => (
              <Picker.Item
                key={attendee.user.id}
                label={attendee.user.handle}
                value={attendee.user.id}
              />
            ))}
          </Picker>
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
  friendTagText: {
    color: '#333',
    marginBottom: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
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
