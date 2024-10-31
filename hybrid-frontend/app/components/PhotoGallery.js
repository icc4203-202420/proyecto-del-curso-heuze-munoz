import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';

const PhotoGallery = ({ eventId }) => {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPictures = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      try {
        const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/events/${eventId}/event_pictures`, {
          headers: { Authorization: token },
        });
        const data = await response.json();
        setPictures(data);
      } catch (error) {
        console.error('Error fetching pictures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPictures();
  }, [eventId]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <FlatList
      data={pictures}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.pictureContainer}
          onPress={() => navigation.navigate('EventPhoto', { eventId: eventId, eventPictureId: item.id })}
        >
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <Text style={styles.description}>{item.description}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  pictureContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  description: {
    padding: 8,
    fontSize: 14,
    color: '#333',
  },
});

export default PhotoGallery;
