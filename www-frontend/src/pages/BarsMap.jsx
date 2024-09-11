import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, TextField, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // For navigation
import MapComponent from '../components/MapComponent'; // Import your MapComponent

function BarsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(''); // Stores the search term
  const [selectedBar, setSelectedBar] = useState(null); // Stores the selected bar for the map

  // Sample list of bars with latitude and longitude
  const bars = [
    {
      id: 1,
      name: "La Vinoteca",
      latitude: -33.404001,
      longitude: -70.587500,
    },
    {
      id: 2,
      name: "Master Bar-Restaurant",
      latitude: -33.52604041910966,
      longitude: -70.77353065549445,
    },
    {
      id: 3,
      name: "Flat Bar",
      latitude: -33.61211226645637,
      longitude: -70.57550148459906,
    },
    
  ];

  // Filter bars based on the search term
  const filteredBars = bars.filter(bar => 
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update the selected bar when search term changes
  useEffect(() => {
    if (filteredBars.length > 0 && (!selectedBar || selectedBar.name !== filteredBars[0].name)) {
      setSelectedBar(filteredBars[0]); // Only set if the selected bar is different
    }
  }, [searchTerm, filteredBars, selectedBar]);

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
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
      />

      {/* Use MapComponent to display the selected bar's location */}
      {selectedBar && (
        <MapComponent lat={selectedBar.latitude} lng={selectedBar.longitude} />
      )}

      {/* Bar Cards */}
      <Grid container spacing={3} sx={{ marginTop: '16px', minWidth: '100%', justifyContent: 'center' }}>
        {filteredBars.map(bar => (
          <Grid item xs={12} sm={6} md={4} key={bar.id}> {/* Changed to use bar.id */}
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {bar.name}
                </Typography>
                <RouterLink 
                  to={`/bars/${bar.id}/events`} // Using bar.id for the route
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
