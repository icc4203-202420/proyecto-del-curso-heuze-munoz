import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid2, Card, CardContent, Typography, Box } from '@mui/material';

function Beers() {
  const [beers, setbeers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/beers')
      .then(response => {
        setbeers(response.data.beers);
        console.log(response.data);
      });
  }, []);

  return (
    <Box sx={{ padding: '16px' }}> {/* Adds padding around the main container */}
      <Typography variant="h4" gutterBottom> {/* Large header for the page title */}
        Beers Page
      </Typography>
      <Grid2 container spacing={2}> {/* Grid container to manage beer cards */}
        {beers.map(beer => (
          <Grid2 item xs={12} sm={6} md={4} key={beer.id}> {/* Responsive grid item */}
            <Card sx={{ height: '100%' }}> {/* Card for each beer */}
              <CardContent>
                <Typography variant="h5" component="div"> {/* Beer name */}
                  {beer.name}
                </Typography>
                {/* Add more beer details here as needed */}
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
export default Beers;