import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, TextField, Button } from '@mui/material';

function Beers() {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/beers')
      .then(response => {
        setBeers(response.data.beers);
      });
  }, []);

  // Filter beers based on search term
  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle card click and navigate to the beer's detail page
  const handleCardClick = (beerId) => {
    const isAuthenticated = localStorage.getItem('authToken'); // Verifica si el token está presente
    console.log(isAuthenticated)
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para ver los detalles de esta cerveza.'); // Muestra el mensaje
      navigate('/login'); // Redirige a la página de login
    } else {
      navigate(`/beers/${beerId}`); // Si está autenticado, navega a los detalles de la cerveza
    }
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Beers Page
      </Typography>
      <Button onClick={() => navigate(-1)} variant="contained" color="primary" sx={{ marginBottom: '16px' }}>
        Go Back
      </Button>

      {/* Search bar */}
      <TextField
        label="Search Beers"
        variant="outlined"
        fullWidth
        sx={{
          marginBottom: '16px',
          '& .MuiInputBase-input': {
            color: '#fff',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#fff',
            },
            '&:hover fieldset': {
              borderColor: '#fff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#fff',
            }
          },
          '& .MuiInputLabel-root': {
            color: '#fff',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#fff',
          },
          backgroundColor: '#3f3f3f',
        }}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
      />

      <Grid container spacing={3}>
        {filteredBeers.map(beer => (
          <Grid item xs={12} sm={6} md={4} key={beer.id}>
            <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => handleCardClick(beer.id)}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {beer.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Beers;
