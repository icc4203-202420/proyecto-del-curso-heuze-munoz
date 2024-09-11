import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, TextField, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // For navigation
import MapComponent from '../components/MapComponent';

function BarsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(''); // Stores the search term
  const [selectedBar, setSelectedBar] = useState(null); // Stores the selected bar for the map

  const bars = [
    {
      name: "La Vinoteca",
      latitude: -33.404001,
      longitude: -70.587500,
    },
    {
      name: "Milánesa",
      latitude: -33.400570,
      longitude: -70.588390,
    },
    {
      name: "Candelaria Bar",
      latitude: -33.407421,
      longitude: -70.590020,
    },
    {
      name: "Senso Bar",
      latitude: -33.407830,
      longitude: -70.583200,
    },
    {
      name: "Whisky Blue",
      latitude: -33.418789,
      longitude: -70.601034,
    },
    {
      name: "Red Luxury Bar",
      latitude: -33.414702,
      longitude: -70.594739,
    },
    {
      name: "Bar Alonso",
      latitude: -33.410383,
      longitude: -70.582630,
    },
    {
      name: "Piso Uno",
      latitude: -33.405786,
      longitude: -70.588191,
    },
    {
      name: "Liguria Bar",
      latitude: -33.429452,
      longitude: -70.616123,
    },
    {
      name: "Bar Nacional",
      latitude: -33.422630,
      longitude: -70.609137,
    },
  ];
  

  const filteredBars = bars.filter(bar => 
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (filteredBars.length > 0) {
      setSelectedBar(filteredBars[0]);
    }
  }, [searchTerm, filteredBars]);

  return (
    <Box sx={{ padding: '16px', minWidth: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Bars Page
      </Typography>

      {/* Go Back Button */}
      <Button onClick={() => navigate(-1)} variant="contained" color="primary" sx={{ marginBottom: '16px' }}>
        Go Back
      </Button>

      {/* Search Bar */}
      <TextField
        label="Search Bars"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: '16px', backgroundColor: '#3f3f3f', minWidth: '100%' }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Use MapComponent instead of GoogleMap */}
      {selectedBar && (
        <MapComponent lat={selectedBar.latitude} lng={selectedBar.longitude} />
      )}

      {/* Bar Cards */}
      <Grid container spacing={3} sx={{ marginTop: '16px', minWidth: '100%', justifyContent: 'center' }}>
        {filteredBars.map(bar => (
          <Grid item xs={12} sm={6} md={4} key={bar.name}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {bar.name}
                </Typography>
                <RouterLink 
                  to={`/bars/${bar.name}/events`} 
                  style={{ textDecoration: 'none', color: '#6A0DAD' }}
                >
                  <Typography variant="body2" color="primary">
                    View Events
                  </Typography>
                </RouterLink>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BarsPage;