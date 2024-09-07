import React from 'react';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import BotNav from './components/BotNav';
import MainCard from './components/MainCard';
import Beers from './pages/Beers';
import BeerDetail from './pages/BeerDetail'
import Bars from './pages/Bars';
import BarsEvents from './pages/BarsEvents';
import Users from './pages/Users';
//import Login from './pages/Login'; // Asegúrate de importar el componente Login
//import Register from './pages/Register'; // Asegúrate de importar el componente Register

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

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/users" element={<Users />} />
            <Route path="/beers" element={<Beers />} />
            <Route path="/beers/:id" element={<BeerDetail />} />
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