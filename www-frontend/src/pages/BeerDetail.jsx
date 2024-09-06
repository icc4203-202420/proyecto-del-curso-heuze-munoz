import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Card, CardContent, Grid, Divider, Avatar } from '@mui/material';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import StarIcon from '@mui/icons-material/Star';

function BeerDetail() {
  const { id } = useParams(); // Access beer ID from URL
  const [beer, setBeer] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/beers/${id}`)
      .then(response => {
        setBeer(response.data.beer); // Assuming response contains beer data
      });
  }, [id]);

  if (!beer) return <Typography>Loading...</Typography>;

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
                <StarIcon sx={{ color: '#FFD700', marginRight: 1 }} /> {beer.avg_rating ? beer.avg_rating: 'no reviews'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default BeerDetail;
