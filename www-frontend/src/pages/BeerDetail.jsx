import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Card, CardContent, Grid, Divider, Avatar, Button, TextField, MenuItem, Rating, Alert } from '@mui/material';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import StarIcon from '@mui/icons-material/Star';

function BeerDetail() {
  const { id } = useParams(); // Access beer ID from URL (this is the beer's id)
  const [beer, setBeer] = useState(null);
  const [users, setUsers] = useState([]); // List of users for selection
  const [reviews, setReviews] = useState([]); // List of reviews for the beer
  const [selectedUser, setSelectedUser] = useState(''); // Selected user for the review
  const [reviewText, setReviewText] = useState(''); // Review text
  const [rating, setRating] = useState(0); // Star rating
  const [error, setError] = useState(''); // Error message for review text

  useEffect(() => {
    // Fetch beer details
    axios.get(`http://localhost:3001/api/v1/beers/${id}`)
      .then(response => {
        setBeer(response.data.beer); // Assuming response contains beer data
      });

    // Fetch reviews for the specific beer using the nested route
    axios.get(`http://localhost:3001/api/v1/beers/${id}/reviews`)
    .then(response => {
        
        setReviews(response.data.reviews); // Only set if it's an array
    });

    // Fetch users (to select who leaves the review)
    axios.get('http://localhost:3001/api/v1/users') // Assuming this is the correct endpoint
      .then(response => {
        setUsers(response.data.users); // Assuming the response contains a list of users
      });
  }, [id]);

  if (!beer) return <Typography>Loading...</Typography>;

  const handleSubmitReview = () => {
    // Validate that review text has at least 15 characters
    if (reviewText.length < 15) {
      setError('Review must be at least 15 characters long.');
      return; // Stop submission if validation fails
    }

    const newReview = {
      user_id: selectedUser, // ID of the user who left the review
      rating: rating, // Star rating (can be a decimal)
      text: reviewText // Text review
    };

    // Send the review to the backend API using the nested route
    axios.post(`http://localhost:3001/api/v1/beers/${id}/reviews`, newReview)
      .then(response => {
        alert('Review submitted successfully!');
        // Optionally clear the form fields
        setSelectedUser('');
        setReviewText('');
        setRating(0);
        setError(''); // Clear any errors
        // Add the new review to the reviews list (optimistic update)
        setReviews([...reviews, response.data.review]);
      })
      .catch(error => {
        console.error('Error submitting review:', error);
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
          

          <Divider sx={{ marginY: 2 }} />

          {/* Review Form */}
          <Typography variant="h5" gutterBottom>
            Leave a Review
          </Typography>

          {/* Show error message if review is too short */}
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Dropdown to select a user */}
              <TextField
                select
                label="Select User"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                fullWidth
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

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
