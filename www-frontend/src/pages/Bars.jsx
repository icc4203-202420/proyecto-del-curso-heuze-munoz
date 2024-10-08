import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Box, TextField, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Bars() {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const navigate = useNavigate(); // Hook para navegar

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/bars')
      .then(response => {
        setBars(response.data.bars);
      })
      .catch(error => {
        console.error('There was an error fetching the bars!', error);
      });
  }, []);

  // Filtrar bares basados en el término de búsqueda
  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: '16px', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#ffffff' }}>
        Bars Page
      </Typography>

      {/* Botón para regresar */}
      <Button onClick={() => navigate(-1)} variant="contained" color="primary" sx={{ marginBottom: '16px' }}>
        Go Back
      </Button>
      {/* Botón para ir a mapa */}
      <Button onClick={() => navigate('/barsMap')} variant="contained" color="secondary" sx={{ marginBottom: '16px', marginLeft: '16px' }}>
        View Map of Bars
      </Button>
      
      {/* Cuadro de búsqueda */}
      <TextField
        label="Search Bars"
        variant="outlined"
        fullWidth
        sx={{ 
          marginBottom: '16px',
          '& .MuiInputBase-input': {
            color: '#000' // Color del texto dentro del campo de búsqueda
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#fff' // Color del borde del campo de búsqueda
            },
            '&:hover fieldset': {
              borderColor: '#fff' // Color del borde al pasar el mouse
            },
            '&.Mui-focused fieldset': {
              borderColor: '#fff' // Color del borde cuando el campo está enfocado
            }
          },
          '& .MuiInputLabel-root': {
            color: '#fff' // Color de la etiqueta del campo de búsqueda
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#fff' // Color de la etiqueta cuando el campo está enfocado
          }
        }}
        onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el término de búsqueda
      />
      
      <Grid container spacing={3}>
        {filteredBars.map(bar => (
          <Grid item xs={12} sm={6} md={4} key={bar.id}>
            <Card sx={{ height: '100%', backgroundColor: '#ffffff', borderRadius: '8px' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {bar.name}
                </Typography>
                {/* Mostrar detalles de la dirección */}
                <Typography variant="body2" color="textSecondary">
                  Address: {bar.address.line1}, {bar.address.line2}, {bar.address.city}, {bar.address.country.name}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(`/bars/${bar.id}/events`)}
                  sx={{ marginTop: '8px' }} // Margen superior para separar del texto
                >
                  View Events
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Bars;
