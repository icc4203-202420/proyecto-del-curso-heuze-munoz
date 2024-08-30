import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, Button } from '@mui/material';
import Moment from 'moment';

function BarsEvents() {
  const { barId } = useParams(); // Obtén el barId de la URL
  const [events, setEvents] = useState([]);
  const [barName, setBarName] = useState(""); // Estado para el nombre del bar
  const navigate = useNavigate(); // Hook para navegar

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
          <Grid item  key={event.id}>
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BarsEvents;