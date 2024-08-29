import React from 'react';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import BotNav from './components/BotNav';
import MainCard from './components/MainCard';
import Beers from './pages/Beers';
import Bars from './pages/Bars';
import BarsEvents from './pages/BarsEvents';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopBar />
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '64px', // Ajusta al tamaño de TopBar
            paddingBottom: '56px', // Ajusta al tamaño de BotNav
          }}
        >
          <Routes>
            <Route path="/" element={<MainCard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/beers" element={<Beers />} />
            <Route path="/bars" element={<Bars />} />
            <Route path="/bars/:barId/events" element={<BarsEvents />} />
          </Routes>
        </Box>
        <BotNav />
      </Box>
    </Router>
  );
}

export default App;
