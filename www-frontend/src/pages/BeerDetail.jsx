import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Card, CardContent, Grid, Divider, Avatar, Button, TextField, MenuItem, Rating, Alert } from '@mui/material';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import StarIcon from '@mui/icons-material/Star';

function BeerDetail() {
  const { id } = useParams(); // Access beer ID from URL (this is the beer's id)
  const [beer, setBeer] = useState(null);
  const [reviews, setReviews] = useState([]); // List of reviews for the beer
  const [brewery, setBrewery] = useState(null); // State for brewery
  const [bars, setBars] = useState([]); // State for bars
  const [reviewText, setReviewText] = useState(''); // Review text
  const [rating, setRating] = useState(0); // Star rating
  const [error, setError] = useState(''); // Error message for review text

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    // Fetch beer details
    axios.get(`http://localhost:3001/api/v1/beers/${id}`, {
      headers: { Authorization: `${token}` }
    })
    .then(response => {
      const beerData = response.data.beer;
      setBeer(beerData);
      setBars(response.data.bars); // Bars serving the beer
   
      if (beerData.brand_id) {
        axios.get(`http://localhost:3001/api/v1/breweries/${beerData.brand_id}`, {
          headers: { Authorization: `${token}` }
        })
          .then(response => {
            console.log('Brewery details:', response.data); // Log the data
            setBrewery(response.data);
          })
          .catch(error => {
            console.error('Error fetching brewery:', error);
          });
      }
    })
    .catch(error => {
      console.error('Error fetching beer details:', error);
    });
   

    // Fetch reviews for the specific beer using the nested route
    axios.get(`http://localhost:3001/api/v1/beers/${id}/reviews`, {
      headers: { Authorization: `${token}` }
    })
    .then(response => {
        
        setReviews(response.data.reviews); // Only set if it's an array
    })
  }, [id]);

  if (!beer) return <Typography>Loading...</Typography>;

  const handleSubmitReview = () => {
    // Validate that review text has at least 15 characters
    if (reviewText.length < 15) {
      setError('Review must be at least 15 characters long.');
      return; // Stop submission if validation fails
    }

    const newReview = {
      rating: rating,
      text: reviewText
    };

    axios.post(`http://localhost:3001/api/v1/beers/${id}/reviews`, newReview, {
      headers: { Authorization: `${token}` }
    })
      .then(response => {
        alert('Review submitted successfully!');
        setReviewText('');
        setRating(0);
        setError('');
        setReviews([...reviews, response.data.review]);
      })
      .catch(error => {
        console.error('Error submitting review:', error);
        setError('Failed to submit review. Please try again.');
      });
  };

  return (
    <Box sx={{ padding: '24px' }}>
      <Card sx={{ padding: '16px', backgroundColor: '#f5f5f5', boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Avatar
                alt={beer.name}
                src="/images/beer-icon.png" // Placeholder, update with actual image if available
                sx={{ width: 120, height: 120, margin: 'auto', backgroundColor: '#FFD700' }}
              >
                <LocalDrinkIcon sx={{ fontSize: 60 }} />
              </Avatar>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h4" gutterBottom>
                {beer.name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {beer.beer_type} - {beer.style}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Typography variant="body1">
                <strong>Hop:</strong> {beer.hop}
              </Typography>
              <Typography variant="body1">
                <strong>Yeast:</strong> {beer.yeast}
              </Typography>
              <Typography variant="body1">
                <strong>Malts:</strong> {beer.malts}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Specifications
              </Typography>
              <Typography variant="body1">
                <strong>IBU:</strong> {beer.ibu}
              </Typography>
              <Typography variant="body1">
                <strong>Alcohol:</strong> {beer.alcohol}
              </Typography>
              <Typography variant="body1">
                <strong>BLG:</strong> {beer.blg}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: 2 }} />

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Created at: {new Date(beer.created_at).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Updated at: {new Date(beer.updated_at).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ color: '#FFD700', marginRight: 1 }} /> {beer.avg_rating ? beer.avg_rating : 'No reviews'}
              </Typography>
            </Grid>
          </Grid>
          
           {/* Brewery Information */}
           {brewery && (
            <>
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="h5">Brewery Information</Typography>
              <Typography><strong>Brewery:</strong> {brewery.name}</Typography>
            </>
          )}

          <Divider sx={{ marginY: 2 }} />
          
          <Typography variant="h5">Bars Serving This Beer</Typography>
          {Array.isArray(bars) && bars.length > 0 ? (
            bars.map(bar => (
              <Typography key={bar.id}>
                <strong>{bar.name}</strong> - {bar.address?.line1}, {bar.address?.city}
              </Typography>
            ))
          ) : (
            <Typography>No bars found serving this beer.</Typography>
          )}



          <Divider sx={{ marginY: 2 }} />

          {/* Review Form */}
          <Typography variant="h5" gutterBottom>
            Leave a Review
          </Typography>

          {/* Show error message if review is too short */}
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2}>

            <Grid item xs={12}>
              {/* Text field for the review */}
              <TextField
                label="Your Review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              {/* Star rating with decimal precision */}
              <Typography variant="h6">Your Rating</Typography>
              <Rating
                name="rating"
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                max={5}
                precision={0.1} // Allows decimal ratings (e.g., 4.3, 4.7)
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmitReview} fullWidth>
                Submit Review
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: 2 }} />
          
          {/* Reviews Section */}
          <Typography variant="h5" gutterBottom>
            Reviews
          </Typography>
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map(review => (
                <Card key={review.id} sx={{ marginBottom: '16px', padding: '16px' }}>
                <Typography variant="h6">
                    {review.user.first_name} {review.user.last_name}
                </Typography>
                <Rating value={parseFloat(review.rating)} readOnly precision={0.1} max={5} />
                <Typography variant="body1">
                    {review.text ? review.text : 'No review text provided.'}
                </Typography>
                </Card>
            ))
            ) : (
                <Typography variant="body1">No reviews yet.</Typography>
            )}


        </CardContent>
      </Card>
    </Box>
  );
}

export default BeerDetail;
