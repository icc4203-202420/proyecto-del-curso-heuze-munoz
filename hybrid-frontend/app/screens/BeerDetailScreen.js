import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';
import jwt_decode from 'jwt-decode';
import { Rating } from 'react-native-ratings';
import ReviewForm from './ReviewForm'; // Ensure the path is correct

const BeerDetail = () => {
  const [beer, setBeer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [brewery, setBrewery] = useState(null);
  const [bars, setBars] = useState([]);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { beerId } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Not Authenticated', 'You need to log in to view this page.');
          navigation.navigate('Login');
          return;
        }

        const decodedToken = jwt_decode(token);
        setCurrentUserId(parseInt(decodedToken.sub, 10)); // Ensure it's a number

        const beerResponse = await fetch(`${API_BASE_URL}/api/v1/beers/${beerId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });

        if (!beerResponse.ok) {
          const errorText = await beerResponse.text();
          throw new Error(`Request failed with status ${beerResponse.status}: ${errorText}`);
        }

        const beerData = await beerResponse.json();
        setBeer(beerData.beer);

        if (beerData.beer && beerData.beer.brand_id) {
          const breweryResponse = await fetch(`${API_BASE_URL}/api/v1/breweries/${beerData.beer.brand_id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${token}`,
            },
          });

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
            'Authorization': `${token}`,
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
  }, [beerId, navigation]);

  const handleReviewSubmitted = useCallback((newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  }, []);

  const renderHeader = useCallback(() => (
    <View>
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
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Average Rating:</Text> {beer.avg_rating ? beer.avg_rating.toFixed(1) : 'No ratings yet'}
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
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.detailText}>No bars found serving this beer.</Text>
          )}
        </View>

        {/* Review Form */}
        <ReviewForm beerId={beerId} onReviewSubmitted={handleReviewSubmitted} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
        </View>
      </View>
    </View>
  ), [navigation, beer, brewery, bars, beerId, handleReviewSubmitted]);

  const currentUserReviews = reviews.filter((review) => review.user_id === currentUserId);
  const otherReviews = reviews.filter((review) => review.user_id !== currentUserId);
  const formattedReviews = [...currentUserReviews, ...otherReviews];

  const renderReview = ({ item }) => {
    if (!item) {
      console.warn('Encountered undefined review item.');
      return null;
    }

    return (
      <View style={styles.reviewCard}>
        <Text style={styles.reviewTitle}>
          {item.user && item.user.handle ? item.user.handle : 'Unknown User'}
          {item.user_id === currentUserId && ' (Your Review)'}
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
    );
  };

  if (!beer) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6A0DAD" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        ListHeaderComponent={renderHeader}
        data={formattedReviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReview}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
};

export default BeerDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingBottom: 20,
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
  reviewCard: {
    backgroundColor: '#EFEFEF',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
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
