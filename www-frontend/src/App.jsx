import React from 'react';
import { Box } from '@mui/material';
import TopBar from './components/TopBar'; // Import your AppBar component here
import BotNav from './components/BotNav'; // Import your BottomNav component here
import MainCard from './components/MainCard'; // Import your CenteredCard component here

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar />
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MainCard />
      </Box>
      <BotNav />
    </Box>
  );
}

export default App;