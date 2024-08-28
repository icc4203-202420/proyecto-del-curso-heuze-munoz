import React from 'react';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar'; // Import your AppBar component here
import BotNav from './components/BotNav'; // Import your BottomNav component here
import MainCard from './components/MainCard'; // Import your CenteredCard component here
import Beers from './pages/Beers';
import Bars from './pages/Bars';
import Events from './pages/Events';
function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <TopBar />
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Routes>
            <Route path="/" element={<MainCard />} />
            <Route path="/cervezas" element={<Beers />} />
            <Route path="/bares" element={<Bars />} />
            <Route path="/eventos" element={<Events />} />
          </Routes>
        </Box>
        <BotNav />
      </Box>
    </Router>
  );
}

export default App;