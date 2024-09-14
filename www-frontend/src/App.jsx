import React from 'react';
import { Box, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import BotNav from './components/BotNav';
import MainCard from './components/MainCard';
import Beers from './pages/Beers';
import BeerDetail from './pages/BeerDetail'
import Bars from './pages/Bars';
import BarsEvents from './pages/BarsEvents';
import Users from './pages/Users';
import Login from './pages/Login';
import Register from './pages/Register';
import BarsMap from './pages/BarsMap';


function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: '100%' }}>
        <TopBar />
        <Box
          position="fixed"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '64px',
            paddingBottom: '56px',
            minWidth: '100%'
          }}
        >
          <Routes>
            <Route path="/" element={<MainCard />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/users" element={<Users />} />
            <Route path="/beers" element={<Beers />} />
            <Route path="/beers/:id" element={<BeerDetail />} />
            <Route path="/bars" element={<Bars />} />
            <Route path="/barsMap" element={<BarsMap />} />
            <Route path="/bars/:barId/events" element={<BarsEvents />} />
          </Routes>
        </Box>
        <BotNav />
      </Box>
    </Router>
  );
}

export default App;