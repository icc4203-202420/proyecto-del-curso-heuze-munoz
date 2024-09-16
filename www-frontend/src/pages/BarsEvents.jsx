import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, Button } from '@mui/material';
import Moment from 'moment';

function BarsEvents() {
  const { barId } = useParams();
  const [events, setEvents] = useState([]);
  const [barName, setBarName] = useState("");
  const [attendees, setAttendees] = useState({});
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  // Verifica si el usuario está logueado
  const isUserLoggedIn = () => {
    const token = localStorage.getItem('authToken');
    return !!token; // Si hay un token, retorna true, si no, false
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verificar si el usuario está logueado y obtener el userId
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          throw new Error('User session not found. Please log in again.');
        }

        // Fetch events
        const eventsResponse = await axios.get(`http://localhost:3001/api/v1/bars/${barId}/events`);
        setEvents(eventsResponse.data.events);

        // Fetch bar name
        const barResponse = await axios.get(`http://localhost:3001/api/v1/bars/${barId}`);
        setBarName(barResponse.data.bar.name);

        // Fetch friends
        const friendsResponse = await axios.get(`http://localhost:3001/api/v1/users/${userId}/friendships`, {
          headers: { Authorization: `${token}` },
          params: { user_id: userId }
        });

        // Extraer solo los IDs de amigos para una comparación rápida
        const friendIds = friendsResponse.data.map(friend => friend.id);
        setFriends(friendIds);

        // Fetch attendees for each event
        const attendeesData = {};
        for (const event of eventsResponse.data.events) {
          const attendeesResponse = await axios.get(`http://localhost:3001/api/v1/bars/${barId}/events/${event.id}/attendances`);
          attendeesData[event.id] = attendeesResponse.data.attendances || [];
        }
        setAttendees(attendeesData);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        if (!isUserLoggedIn()) {
          navigate('/login'); // Redirige al login si no está logueado
        }
      }
    };

    fetchData();
  }, [barId, navigate]);

  const handleCheckIn = async (eventId) => {
    if (!isUserLoggedIn()) {
      alert('You must be logged in to check in.');
      navigate('/login'); // Redirige al login si no está logueado
      return;
    }

    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      alert('User session not found. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`http://localhost:3001/api/v1/bars/${barId}/events/${eventId}/attendances`, {
        user_id: userId
      }, {
        headers: {
          Authorization: `${token}`
        }
      });

      alert('Check-in successful!');
      
      const response = await axios.get(`http://localhost:3001/api/v1/bars/${barId}/events/${eventId}/attendances`);
      setAttendees(prevAttendees => ({
        ...prevAttendees,
        [eventId]: response.data.attendances || []
      }));
    } catch (error) {
      console.error("Error during check-in:", error);
      alert('There was an error during check-in. Please try again.');
    }
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        {barName} Events
      </Typography>
      <Button onClick={() => navigate(-1)} variant="contained" color="primary" sx={{ marginBottom: '16px' }}>
        Go Back
      </Button>
      <Grid container spacing={3}>
        {events.map(event => (
          <Grid item key={event.id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {event.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {Moment(event.date).format('MMMM D, YYYY [at] h:mm A')}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: '8px' }}>
                  {event.description}
                </Typography>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => handleCheckIn(event.id)}
                >
                  Check-in
                </Button>
                <Typography variant="h6" sx={{ marginTop: '16px' }}>Attendees:</Typography>
                {attendees[event.id] && attendees[event.id].length > 0 ? (
                  attendees[event.id].map(attendee => (
                    <Typography 
                      key={attendee.user.id} 
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      {attendee.user.handle}
                      {friends.includes(attendee.user.id) ? (
                        <Typography 
                          variant="body2"
                          sx={{ fontStyle: 'italic', color: 'green', marginLeft: '4px' }}
                        >
                          (friend)
                        </Typography>
                      ) : ''}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">No attendees yet.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BarsEvents;
