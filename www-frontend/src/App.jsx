import React from 'react';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import BotNav from './components/BotNav';
import MainCard from './components/MainCard';
import Beers from './pages/Beers';
import BeerDetail from './pages/BeerDetail';
import Bars from './pages/Bars';
import BarsEvents from './pages/BarsEvents';
import Users from './pages/Users';
import Login from './pages/Login';
import Register from './pages/Register';
import BarsMap from './pages/BarsMap';
import Events from './pages/Events'
import EventsDetail from './pages/EventsDetail'

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
        <TopBar />
        {/* Main content area */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '64px', // Adjust for TopBar height
            paddingBottom: '56px', // Adjust for BotNav height
            width: '100%', // Ensures full width usage
            maxWidth: '100vw', // Prevents overflow beyond the viewport
            overflowX: 'hidden', // Prevents horizontal scrollbars
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
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventsDetail />} />
          </Routes>
        </Box>
        <BotNav />
      </Box>
    </Router>
  );
}

export default App;