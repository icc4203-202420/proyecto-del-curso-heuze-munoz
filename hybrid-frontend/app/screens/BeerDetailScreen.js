import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating } from 'react-native-ratings';
import { API_BASE_URL } from '@env';

const BeerDetail = () => {
  const [beer, setBeer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [brewery, setBrewery] = useState(null);
  const [bars, setBars] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { beerId } = route.params; // Adjusted to match the parameter passed from Beers component

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Not Authenticated', 'You need to log in to view this page.');
          navigation.navigate('Login');
          return;
        }

        // Fetch beer details
        const beerResponse = await fetch(`${API_BASE_URL}/api/v1/beers/${beerId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!beerResponse.ok) {
          const errorText = await beerResponse.text();
          throw new Error(`Request failed with status ${beerResponse.status}: ${errorText}`);
        }

        const beerData = await beerResponse.json();
        console.log('Beer Data:', beerData);
        setBeer(beerData.beer);

        // Fetch brewery details
        if (beerData.beer && beerData.beer.brand_id) {
          const breweryResponse = await fetch(
            `${API_BASE_URL}/api/v1/breweries/${beerData.beer.brand_id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!breweryResponse.ok) {
            const errorText = await breweryResponse.text();
            throw new Error(`Request failed with status ${breweryResponse.status}: ${errorText}`);
          }

          const breweryData = await breweryResponse.json();
          setBrewery(breweryData.brewery);
          setBars(breweryData.bars);
        }

        // Fetch reviews
        const reviewsResponse = await fetch(`${API_BASE_URL}/api/v1/beers/${beerId}/reviews`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!reviewsResponse.ok) {
          const errorText = await reviewsResponse.text();
          throw new Error(`Request failed with status ${reviewsResponse.status}: ${errorText}`);
        }

        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Could not fetch data. Please try again later.');
      }
    };

    fetchData();
  }, [beerId]);

  if (!beer) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6A0DAD" />
      </View>
    );
  }

  const handleSubmitReview = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Not Authenticated', 'You need to log in to submit a review.');
        navigation.navigate('Login');
        return;
      }

      if (reviewText.length < 15) {
        setError('Review must be at least 15 characters long.');
        return;
      }

      const newReview = {
        rating: rating,
        text: reviewText,
        user_id: currentUserId,
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/beers/${beerId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      Alert.alert('Success', 'Review submitted successfully!');
      setReviewText('');
      setRating(0);
      setError('');
      setReviews([...reviews, responseData.review]);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    }
  };

  // Handle reviews
  const currentUserReview = reviews.find((review) => review.user_id === currentUserId);
  const otherReviews = reviews.filter((review) => review.user_id !== currentUserId);
  const formattedReviews = currentUserReview ? [currentUserReview, ...otherReviews] : otherReviews;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>{beer.name}</Text>
            <Text style={styles.subtitle}>
              {beer.beer_type} - {beer.style}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Hop:</Text> {beer.hop}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Yeast:</Text> {beer.yeast}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Malts:</Text> {beer.malts}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>IBU:</Text> {beer.ibu}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Alcohol:</Text> {beer.alcohol}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>BLG:</Text> {beer.blg}
          </Text>
        </View>

        {brewery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Brewery Information</Text>
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Brewery:</Text> {brewery.name}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bars Serving This Beer</Text>
          {Array.isArray(bars) && bars.length > 0 ? (
            <FlatList
              data={bars}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Text style={styles.detailText}>{item.name}</Text>
              )}
            />
          ) : (
            <Text style={styles.detailText}>No bars found serving this beer.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leave a Review</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TextInput
            style={styles.textInput}
            placeholder="Your Review"
            value={reviewText}
            onChangeText={(text) => setReviewText(text)}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.ratingLabel}>Your Rating</Text>
          <Rating
            startingValue={rating}
            imageSize={30}
            onFinishRating={(value) => setRating(value)}
            style={styles.rating}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
            <Text style={styles.submitButtonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {formattedReviews && formattedReviews.length > 0 ? (
            <FlatList
              data={formattedReviews}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.reviewCard}>
                  <Text style={styles.reviewTitle}>
                    {item.user.handle} {item.user_id === currentUserId && '(Your Review)'}
                  </Text>
                  <Rating
                    startingValue={parseFloat(item.rating)}
                    imageSize={20}
                    readonly
                    style={styles.reviewRating}
                  />
                  <Text style={styles.reviewText}>
                    {item.text ? item.text : 'No review text provided.'}
                  </Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.detailText}>No reviews yet.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default BeerDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  goBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A0DAD',
    padding: 10,
  },
  goBackText: {
    color: '#FFF',
    marginLeft: 5,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
  },
  avatar: {
    width: 120,
    height: 120,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A0DAD',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6A0DAD',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  ratingLabel: {
    fontSize: 18,
    marginTop: 16,
  },
  rating: {
    marginVertical: 8,
  },
  textInput: {
    borderColor: '#6A0DAD',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    textAlignVertical: 'top',
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
  reviewCard: {
    backgroundColor: '#EFEFEF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6A0DAD',
  },
  reviewRating: {
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
