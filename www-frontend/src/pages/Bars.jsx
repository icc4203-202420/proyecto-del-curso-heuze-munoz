// src/pages/Bars.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid2, Card, CardContent, Typography, Box } from '@mui/material';


function Bars() {
  const [bars, setBars] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/bars')
      .then(response => {
        setBars(response.data.bars);
        console.log(response.data)
      })
    }, []);

  return (
    <Box sx={{ padding: '16px' }}> {/* Adds padding around the main container */}
      <Typography variant="h4" gutterBottom> {/* Large header for the page title */}
        Bars Page
      </Typography>
      <Grid2 container spacing={2}> {/* Grid container to manage bar cards */}
        {bars.map(bar => (
          <Grid2 item xs={12} sm={6} md={4} key={bar.id}> {/* Responsive grid item */}
            <Card sx={{ height: '100%' }}> {/* Card for each bar */}
              <CardContent>
                <Typography variant="h5" component="div"> {/* bar name */}
                  {bar.name}
                </Typography>
                {/* Add more bar details here as needed */}
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}

export default Bars;