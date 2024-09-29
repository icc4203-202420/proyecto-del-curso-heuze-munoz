import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';

function EventGallery({ eventId }) {
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/v1/events/${eventId}/event_pictures`,
          {
            headers: {
              Authorization: `${localStorage.getItem('authToken')}`,
            },
          }
        );
        setPictures(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPictures();
  }, [eventId]);

  return (
    <Box sx={{ overflowY: 'scroll', maxHeight: '80vh', padding: '16px' }}>
      <Grid container spacing={2}>
        {pictures.map((picture) => (
          <Grid item xs={12} sm={6} md={4} key={picture.id}>
            <Card sx={{ borderRadius: '12px', boxShadow: 3 }}>
              <CardMedia
                component="img"
                image={picture.image_url}
                alt={picture.description}
                sx={{ height: 200, objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {picture.description}
                </Typography>
                {/* Mostrar los amigos etiquetados */}
                {picture.tagged_friends && picture.tagged_friends.length > 0 && (
                  <Box sx={{ marginTop: '8px' }}>
                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                      Tagged Users:
                    </Typography>
                    {picture.tagged_friends.map(friend => (
                      <Typography key={friend.id} variant="body2" color="textPrimary">
                        {friend.handle}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default EventGallery;
