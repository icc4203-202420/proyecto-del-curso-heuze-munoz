import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, TextField , Button} from '@mui/material';

function Beers() {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const navigate = useNavigate(); // Hook para navegar

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/beers')
      .then(response => {
        setBeers(response.data.beers);
        console.log(response.data);
      });
  }, []);

  // Filtrar cervezas basadas en el término de búsqueda
  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Beers Page
      </Typography>
      <Button onClick={() => navigate(-1)} variant="contained" color="primary" sx={{ marginBottom: '16px' }}>
        Go Back
      </Button>
      
      {/* Cuadro de búsqueda */}
      <TextField
        label="Search Beers"
        variant="outlined"
        fullWidth
        sx={{ 
          marginBottom: '16px',
          '& .MuiInputBase-input': {
            color: '#fff' // Color del texto dentro del campo de búsqueda
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
          },
          backgroundColor: '#3f3f3f' // Color de fondo del campo de búsqueda (opcional)
        }}
        onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el término de búsqueda
      />
      
      <Grid container spacing={3}> {/* Grid container to manage beer cards */}
        {filteredBeers.map(beer => (
          <Grid item xs={12} sm={6} md={4} key={beer.id}> {/* Responsive grid item */}
            <Card sx={{ height: '100%' }}> {/* Card for each beer */}
              <CardContent>
                <Typography variant="h5" component="div"> {/* Beer name */}
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
