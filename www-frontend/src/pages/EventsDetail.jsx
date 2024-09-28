import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import Moment from 'moment';
import EventPhotoUpload from '../components/EventPhotoUpload';
import EventGallery from '../components/EventGallery';

function EventShow() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [bar, setBar] = useState(null);
  const [attendees, setAttendees] = useState([]);
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

        const eventResponse = await axios.get(`http://localhost:3001/api/v1/events/${eventId}`, {
          headers: { Authorization: `${token}` }
        });
        setEvent(eventResponse.data.event);

        const barResponse = await axios.get(`http://localhost:3001/api/v1/bars/${eventResponse.data.event.bar_id}`);
        setBar(barResponse.data.bar);

        const attendeesResponse = await axios.get(`http://localhost:3001/api/v1/events/${eventId}/attendances`);
        setAttendees(attendeesResponse.data.attendances || []);

        const friendsResponse = await axios.get(`http://localhost:3001/api/v1/users/${userId}/friendships`, {
          headers: { Authorization: `${token}` },
          params: { user_id: userId }
        });
        const friendIds = friendsResponse.data.map(friend => friend.id);
        setFriends(friendIds);
      } catch (error) {
        console.error("There was an error fetching the event data!", error);
        if (!isUserLoggedIn()) {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [eventId, navigate]);

  if (!event || !bar) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: '24px'}}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {event.name}
      </Typography>
      <Button onClick={() => navigate(-1)} variant="contained" color="primary" sx={{ marginBottom: '24px' }}>
        Go Back
      </Button>
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
          <Typography variant="body1" sx={{ marginTop: '8px', fontWeight: 'bold' }}>
            Location: {bar.name}
          </Typography>
          <Typography variant="h6" sx={{ marginTop: '24px', fontWeight: 'bold' }}>Attendees:</Typography>
          {attendees.length > 0 ? (
            attendees
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
          <Typography variant="h6" sx={{ marginTop: '24px', fontWeight: 'bold' }}>Attendees:</Typography>
          <EventPhotoUpload eventId={eventId} />
        <EventGallery eventId={eventId} />
        </CardContent>
      </Card>
    </Box>
  );
}

export default EventShow;
