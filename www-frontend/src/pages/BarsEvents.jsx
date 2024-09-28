import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, Button, Chip } from '@mui/material';
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
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          throw new Error('User session not found. Please log in again.');
        }

        const eventsResponse = await axios.get(`http://localhost:3001/api/v1/bars/${barId}/events`,{headers: { Authorization: `${token}` }});
        setEvents(eventsResponse.data.events);

        const barResponse = await axios.get(`http://localhost:3001/api/v1/bars/${barId}`);
        setBarName(barResponse.data.bar.name);

        const friendsResponse = await axios.get(`http://localhost:3001/api/v1/users/${userId}/friendships`, {
          headers: { Authorization: `${token}` },
          params: { user_id: userId }
        });

        const friendIds = friendsResponse.data.map(friend => friend.id);
        setFriends(friendIds);

        const attendeesData = {};
        for (const event of eventsResponse.data.events) {
          const attendeesResponse = await axios.get(`http://localhost:3001/api/v1/bars/${barId}/events/${event.id}/attendances`);
          attendeesData[event.id] = attendeesResponse.data.attendances || [];
        }
        setAttendees(attendeesData);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        if (!isUserLoggedIn()) {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [barId, navigate]);

  const handleCheckIn = async (eventId) => {
    if (!isUserLoggedIn()) {
      alert('You must be logged in to check in.');
      navigate('/login');
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
    <Box sx={{ padding: '24px'}}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {barName} Events
      </Typography>
      <Button onClick={() => navigate(-1)} variant="contained" color="primary" sx={{ marginBottom: '24px' }}>
        Go Back
      </Button>
      <Grid container spacing={4}>
        {events.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: '12px', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
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
                  sx={{ marginTop: '16px' }}
                >
                  Check-in
                </Button>
                <Typography variant="h6" sx={{ marginTop: '24px', fontWeight: 'bold' }}>Attendees:</Typography>
                {attendees[event.id] && attendees[event.id].length > 0 ? (
                  attendees[event.id]
                    .sort((a, b) => {
                      if (friends.includes(a.user.id) && !friends.includes(b.user.id)) return -1;
                      if (!friends.includes(a.user.id) && friends.includes(b.user.id)) return 1;
                      return 0;
                    })
                    .map(attendee => (
                      <Box key={attendee.user.id} sx={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                        <Typography variant="body2" sx={{ marginRight: '8px' }}>
                          {attendee.user.handle}
                        </Typography>
                        {friends.includes(attendee.user.id) && (
                          <Chip label="Friend" color="success" size="small" />
                        )}
                      </Box>
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
