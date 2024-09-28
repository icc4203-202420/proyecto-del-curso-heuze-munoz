import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import Moment from 'moment';

function Events() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // Verifica si el usuario está logueado
  const isUserLoggedIn = () => {
    const token = localStorage.getItem('authToken');
    return !!token; // Si hay un token, retorna true, si no, false
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          throw new Error('User session not found. Please log in again.');
        }

        const eventsResponse = await axios.get('http://localhost:3001/api/v1/events', {
          headers: { Authorization: `${token}` }
        });
        setEvents(eventsResponse.data.events);
      } catch (error) {
        console.error("There was an error fetching the events data!", error);
        if (!isUserLoggedIn()) {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <Box sx={{ padding: '24px'}}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        All Events
      </Typography>
      <Button onClick={() => navigate(-1)} variant="contained" color="primary" sx={{ marginBottom: '24px' }}>
        Go Back
      </Button>
      <Grid container spacing={4}>
        {events.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Box 
              sx={{ cursor: 'pointer' }} 
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: '12px', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {event.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {Moment(event.date).format('MMMM D, YYYY [at] h:mm A')}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: '8px' }}>
                    {event.description.substring(0, 100)}...
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Events;
