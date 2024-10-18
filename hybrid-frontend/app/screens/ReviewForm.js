import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

const ReviewForm = React.memo(({ beerId, onReviewSubmitted }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleSubmitReview = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Not Authenticated', 'You need to log in to submit a review.');
        navigation.navigate('Login');
        return;
      }

      if (reviewText.trim().length < 15) {
        setError('Review must be at least 15 characters long.');
        return;
      }

      const newReview = {
        rating: rating,
        text: reviewText.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/beers/${beerId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({ review: newReview }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error submitting review:', errorText);
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      Alert.alert('Success', 'Review submitted successfully!');
      setReviewText('');
      setRating(0);
      setError('');

      if (responseData) {
        onReviewSubmitted(responseData);
      } else {
        console.error('No review data returned from backend.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Leave a Review</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.textInput}
        placeholder="Your Review"
        value={reviewText}
        onChangeText={setReviewText}
        multiline
        numberOfLines={4}
      />
      <Text style={styles.ratingLabel}>Your Rating: {rating.toFixed(1)}</Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={1}
        maximumValue={5}
        step={0.1}
        value={rating}
        onValueChange={setRating}
        minimumTrackTintColor="#6A0DAD"
        maximumTrackTintColor="#000000"
        thumbTintColor="#6A0DAD"
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
        <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6A0DAD',
    marginBottom: 8,
  },
  textInput: {
    borderColor: '#6A0DAD',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  ratingLabel: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#6A0DAD',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default ReviewForm;
