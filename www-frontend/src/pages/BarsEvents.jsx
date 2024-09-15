import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, Button } from '@mui/material';
import Moment from 'moment';

function BarsEvents() {
  const { barId } = useParams(); // Obtén el barId de la URL
  const [events, setEvents] = useState([]);
  const [barName, setBarName] = useState(""); // Estado para el nombre del bar
  const [attendees, setAttendees] = useState([]); // Usuarios que han hecho check-in
  const navigate = useNavigate(); // Hook para navegar

  // Verifica si el usuario está logueado
  const isUserLoggedIn = () => {
    const token = localStorage.getItem('authToken'); // Aquí asumo que guardaste el JWT en localStorage
    return !!token; // Si hay un token, retorna true, si no, false
  };

  useEffect(() => {
    // Obtener eventos del bar
    axios.get(`http://localhost:3001/api/v1/bars/${barId}/events`)
      .then(response => {
        setEvents(response.data.events);
      })
      .catch(error => {
        console.error("There was an error fetching the events!", error);
      });

    // Obtener detalles del bar
    axios.get(`http://localhost:3001/api/v1/bars/${barId}`)
      .then(response => {
        setBarName(response.data.bar.name); // Asigna el nombre del bar
      })
      .catch(error => {
        console.error("There was an error fetching the bar details!", error);
      });
  }, [barId]);

  const handleCheckIn = (eventId) => {
    if (!isUserLoggedIn()) {
      alert('You must be logged in to check in.');
      navigate('/login'); // Redirige al login si no está logueado
      return;
    }
  
    const token = localStorage.getItem('authToken'); // Obtén el token del usuario
    const userId = localStorage.getItem('userId'); // Asumiendo que el ID del usuario se guarda en localStorage
  
    axios.post(`http://localhost:3001/api/v1/bars/${barId}/events/${eventId}/attendances`, {
      user_id: userId // Envía el ID del usuario como parte del cuerpo de la solicitud
    }, {
      headers: {
        Authorization: `Bearer ${token}` // Incluye el token en los headers
      }
    })
    .then(() => {
      alert('Check-in successful!');
      fetchAttendees(eventId); // Actualiza la lista de usuarios que hicieron check-in
    })
    .catch(error => {
      console.error("Error during check-in:", error);
      alert('There was an error during check-in. Please try again.');
    });
  };
  

  const fetchAttendees = (eventId) => {
    axios.get(`http://localhost:3001/api/v1/events/${eventId}/attendances`)
      .then(response => {
        setAttendees(response.data.attendees);
      })
      .catch(error => {
        console.error("Error fetching attendees:", error);
      });
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        {barName} Events
      </Typography>
      <Button onClick={() => navigate(-1)} variant="contained" color="primary" sx={{ marginBottom: '16px' }}>
        Go Back
      </Button>
      <Grid container spacing={3}> {/* Adjust spacing for better layout */}
        {events.map(event => (
          <Grid item key={event.id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {event.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {/* Formatear la fecha con moment */}
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
                {attendees.map(attendee => (
                  <Typography key={attendee.id} variant="body2">
                    {attendee.name}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BarsEvents;
