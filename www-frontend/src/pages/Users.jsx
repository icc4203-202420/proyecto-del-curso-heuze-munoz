// src/pages/Events.jsx
import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

function Search() {
    return <Typography variant="h6">Buscar</Typography>;
  }
function Users() {
  return (
    <Box sx={{ mt : '2px' }}> {/* Add padding to adjust space from TopBar */}
      <Typography variant="h4" gutterBottom> {/* Use Typography with variant for h1 style */}
        Users Page
      </Typography>
      <Search />
    </Box>
  );
}

export default Users;